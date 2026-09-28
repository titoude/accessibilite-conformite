// Held-out task checks for the task-pilot evaluator.
// Every interaction credited toward a task is a real keyboard event
// (page.keyboard.*). DOM reads are evidence only — they never produce a
// credited action. Programmatic focus(), element.click(), or seeded
// outcomes cannot count as keyboard success.
//
// These checks implement the pilot's custom evaluation CONTRACT (see
// manifest.json), not a normative WCAG requirement. The contract and the
// discovery procedure are published equally to both arms.

import { expect } from "@playwright/test";

export const TASK_IDS = [
  "task1_add_complete_filter",
  "task2_keyboard_edit",
  "task3_toggle_clear",
];

const TEXTS = ["Alpha task", "Beta task"];
const ENTER = "Enter";
const PW_OPTS = { timeout: 400 }; // accessible-name assertions are instant

async function focusedDescriptor(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute("type") || null,
      cls: el.getAttribute("class") || "",
      name: el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 60),
      visible: !!(r.width || r.height) && getComputedStyle(el).visibility !== "hidden",
      liIndex: el.closest("li") ? [...document.querySelectorAll(".todo-list li")].indexOf(el.closest("li")) : null,
    };
  });
}

// Real accessible-name check on the currently focused element using the
// pinned Playwright matcher — no in-page approximation.
async function focusedHasName(page, re) {
  try {
    await expect(page.locator(":focus")).toHaveAccessibleName(re, PW_OPTS);
    return true;
  } catch {
    return false;
  }
}

// Tab until predicate(descriptor) holds; descriptor is evidence, and for
// name checks callers should use focusedHasName (real accName).
async function tabUntil(page, predicate, { maxTabs = 40 } = {}) {
  for (let i = 0; i < maxTabs; i++) {
    const d = await focusedDescriptor(page);
    if (d && (await predicate(d, page))) return d;
    await page.keyboard.press("Tab");
    await page.waitForTimeout(40);
  }
  const d = await focusedDescriptor(page);
  return d && (await predicate(d, page)) ? d : null;
}

function itemStates(page) {
  // Ground truth per item: identity text, checkbox.checked AND li class
  // kept SEPARATE (a mismatch = inconsistent state, not "completed"),
  // plus visibility via checkVisibility which covers hidden ancestors,
  // visibility:hidden and opacity:0. Never trusts toggle-all.checked.
  return page.evaluate(() => {
    const items = [...document.querySelectorAll(".todo-list li")].map((li) => {
      const cb = li.querySelector("input[type=checkbox]");
      const clsDone = li.classList.contains("completed");
      const cbDone = cb ? !!cb.checked : null;
      const visible = typeof li.checkVisibility === "function"
        ? li.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
        : (getComputedStyle(li).display !== "none" && getComputedStyle(li).visibility !== "hidden"
           && Number(getComputedStyle(li).opacity) > 0 && !li.hidden);
      return {
        id: li.getAttribute("data-id"),
        text: (li.querySelector("label")?.textContent || "").trim(),
        checkboxChecked: cbDone,
        classCompleted: clsDone,
        completed: cbDone === true && clsDone === true,
        inconsistent: cbDone !== null && cbDone !== clsDone,
        visible,
      };
    });
    const vis = items.filter((i) => i.visible);
    return {
      items, visibleItems: vis,
      anyInconsistent: items.some((i) => i.inconsistent),
      countText: (document.querySelector(".todo-count")?.textContent || "").replace(/\s+/g, " ").trim(),
      clearVisible: (() => { const c = document.querySelector(".clear-completed"); return !!c && (typeof c.checkVisibility === "function" ? c.checkVisibility() : getComputedStyle(c).display !== "none"); })(),
      hash: location.hash,
    };
  });
}

async function activateLinkByKeyboard(page, name) {
  // Tab to a link whose accessible name is exactly `name`, press Enter,
  // then wait for the RENDERED outcome — the selected filter marker plus a
  // settled visible-item set — never the hash alone ("All" maps to "#/").
  for (let i = 0; i < 40; i++) {
    const d = await focusedDescriptor(page);
    if (d && d.tag === "a") {
      const named = await focusedHasName(page, new RegExp(`^${name}$`, "i"));
      if (named) {
        const before = await itemStates(page);
        await page.keyboard.press("Enter");
        // wait for EITHER a hash change to the filter route OR (All="#/")
        // a rendered visibility change in the list — no swallowed timeout.
        const targetHash = { all: "#/", active: "#/active", completed: "#/completed" }[name.toLowerCase()] || name.toLowerCase();
        try {
          await page.waitForFunction(
            ([th, prev]) => location.hash === th || location.hash !== prev,
            [targetHash, before.hash], { timeout: 2000 });
        } catch {
          return { ok: false, reason: `Enter on "${name}" produced no route/render change` };
        }
        await page.waitForTimeout(200);
        const after = await itemStates(page);
        const ok = after.hash === targetHash || after.hash !== before.hash;
        return { ok, hash: after.hash };
      }
    }
    await page.keyboard.press("Tab");
    await page.waitForTimeout(40);
  }
  return { ok: false, reason: `link ${name} not reachable by Tab` };
}

// Move focus INSIDE the li whose label text === itemText, landing on a
// specific descendant kind ('checkbox'|'label'|'any'). Walks past the
// first descendant — does not stop at the checkbox when another
// affordance is requested.
async function focusInsideItem(page, itemText, want = "any") {
  for (let i = 0; i < 50; i++) {
    const d = await focusedDescriptor(page);
    if (d && d.liIndex !== null) {
      const ok = await page.evaluate(([wantText, wantKind, idx]) => {
        const li = document.querySelectorAll(".todo-list li")[idx];
        if (!li) return false;
        if ((li.querySelector("label")?.textContent || "").trim() !== wantText) return false;
        const el = document.activeElement;
        if (!li.contains(el)) return false;
        if (wantKind === "any") return true;
        if (wantKind === "checkbox") return el.matches('input[type=checkbox]');
        if (wantKind === "label") return el.tagName === "LABEL" || el.matches('[role=button],button,a,label');
        if (wantKind === "noncheckbox") return !el.matches('input[type=checkbox]');
        return false;
      }, [itemText, want, d.liIndex]);
      if (ok) return { ok: true, focused: d };
    }
    await page.keyboard.press("Tab");
    await page.waitForTimeout(40);
  }
  return { ok: false, reason: `no ${want} focusable inside item ${itemText}` };
}

// Editing is REAL when the focused element is a VISIBLE text editor AND
// it belongs to the exact recorded item id. After exiting, the li must no
// longer carry editing state or an editor — moving focus elsewhere while
// the editor stays open is NOT an exit.
async function itemEditorOpen(page, itemId) {
  return page.evaluate((id) => {
    const li = id ? document.querySelector(`.todo-list li[data-id="${id}"]`)
                  : null;
    if (!li) return { open: false, focused: false };
    const editor = li.querySelector("input.edit, input[type=text], textarea");
    const open = li.classList.contains("editing") || !!editor;
    return { open: !!(editor && open), focused: document.activeElement === editor };
  }, itemId);
}

async function isEditing(page, itemText, itemId = null) {
  return page.evaluate(([want, id]) => {
    const el = document.activeElement;
    if (!el || !(el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return false;
    if (el.tagName === "INPUT" && el.type && !["text", "search"].includes(el.type)) return false;
    const li = el.closest("li");
    if (!li) return false;
    if (id && li.getAttribute("data-id") !== String(id)) return false;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (!(r.width || r.height) || cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) return false;
    // exact match on identity: the item's label OR the editor's own value
    const label = (li.querySelector("label")?.textContent || "").trim();
    return label === want || el.value === want;
  }, [itemText, itemId]);
}

async function addItem(page, text) {
  const d = await tabUntil(page, (x) => x.tag === "input" && (x.type === "text" || x.type === null || x.type === "search") && x.liIndex === null);
  if (!d) return { ok: false, reason: "no empty-list text input reachable" };
  await page.keyboard.type(text, { delay: 10 });
  await page.keyboard.press(ENTER);
  await page.waitForTimeout(180);
  let st = await itemStates(page);
  if (!st.items.some((i) => i.text === text)) {
    // upstream commits on 'change' (blur) — Tab to commit is still a real
    // keyboard path; record which mechanism fired.
    await page.keyboard.press("Tab");
    await page.waitForTimeout(150);
    st = await itemStates(page);
    if (st.items.some((i) => i.text === text)) return { ok: true, commitKey: "Enter+Tab" };
    return { ok: false, reason: "item not added" };
  }
  return { ok: true, commitKey: "Enter" };
}

export async function runTask1(page) {
  // CONTRACT: add two distinct todos, complete one via keyboard, filters
  // Active/Completed show the correct items (visible, identity-verified),
  // and All restores both. Reload reset is baseline, not scored.
  const ev = { steps: [] };
  const step = (s, ok, detail) => ev.steps.push({ s, ok, detail });
  let commitKey = null;
  for (const t of TEXTS) {
    const a = await addItem(page, t);
    commitKey = commitKey || a.commitKey;
    if (!a.ok) { step(`add "${t}"`, false, a.reason); return { status: "FAIL", ev }; }
    step(`add "${t}"`, true, a.commitKey);
    // refocus input for next item if focus moved into the list
    const d = await focusedDescriptor(page);
    if (d && d.liIndex !== null) await tabUntil(page, (x) => x.tag === "input" && x.liIndex === null);
  }
  ev.commitKey = commitKey;
  let st = await itemStates(page);
  step("two items added with exact text", TEXTS.every((t) => st.items.some((i) => i.text === t)), st.items.map((i) => i.text));

  // Complete Alpha: focus the checkbox inside ITS li, press Space.
  const f1 = await focusInsideItem(page, TEXTS[0], "checkbox");
  if (f1.ok) { await page.keyboard.press(" "); await page.waitForTimeout(150); }
  step("keyboard toggle Alpha", f1.ok, f1.focused || f1.reason);
  st = await itemStates(page);
  const a = st.items.find((i) => i.text === TEXTS[0]);
  step("Alpha completed (checked AND class agree)",
    !!a && a.completed && !a.inconsistent,
    a ? { checked: a.checkboxChecked, cls: a.classCompleted } : "item missing");

  const c = await activateLinkByKeyboard(page, "Completed");
  step("Completed filter via keyboard", c.ok, c.reason || c.hash);
  st = await itemStates(page);
  step("Completed shows exactly Alpha (visible)", st.visibleItems.length === 1 && st.visibleItems[0].text === TEXTS[0] && st.visibleItems[0].completed, st.visibleItems);
  const ac = await activateLinkByKeyboard(page, "Active");
  step("Active filter via keyboard", ac.ok, ac.reason || ac.hash);
  st = await itemStates(page);
  step("Active shows exactly Beta (visible)", st.visibleItems.length === 1 && st.visibleItems[0].text === TEXTS[1] && !st.visibleItems[0].completed, st.visibleItems);
  const all = await activateLinkByKeyboard(page, "All");
  step("All filter via keyboard", all.ok, all.reason || all.hash);
  st = await itemStates(page);
  step("All restores both items with identities intact",
    st.visibleItems.length === 2 && st.visibleItems.some((i) => i.text === TEXTS[0]) && st.visibleItems.some((i) => i.text === TEXTS[1]),
    st.visibleItems.map((i) => i.text));
  step("no inconsistent checked/class states anywhere", !st.anyInconsistent, st.items.filter((i) => i.inconsistent));
  step("count text reports 1 item left", /\b1\b\s*items? left/i.test(st.countText), st.countText);

  ev.reloadReset = await (async () => {
    await page.reload(); await page.waitForTimeout(300);
    const r = await itemStates(page);
    return r.items.length === 0;
  })();
  ev.reloadResetNote = "MemoryStorage reset on reload is baseline upstream behavior; recorded, not scored.";
  const fails = ev.steps.filter((s) => s.ok === false).length;
  return { status: fails === 0 ? "PASS" : "FAIL", ev };
}

export async function runTask2(page) {
  // CONTRACT: a keyboard path to item editing exists. Discovery order
  // (custom contract, equal for both arms):
  //   (a) focusable control inside the item whose ACCESSIBLE NAME (real
  //       accName via toHaveAccessibleName — covers aria-labelledby and
  //       native labels) matches /edit/i → Enter/Space;
  //   (b) F2 while focus is inside the item (any descendant);
  //   (c) Enter/Space on a focusable label/non-checkbox descendant.
  // Success = a visible focused text editor bearing the item's title.
  const ev = { steps: [] };
  const step = (s, ok, detail) => ev.steps.push({ s, ok, detail });
  const target = TEXTS[1];

  let st = await itemStates(page);
  if (!st.items.some((i) => i.text === target)) {
    const a = await addItem(page, target);
    if (a.ok) { const d = await focusedDescriptor(page); if (d?.liIndex === null) {} }
    st = await itemStates(page);
  }
  if (!st.items.some((i) => i.text === target)) {
    step("precondition: item present", false, st.items.map((i) => i.text));
    return { status: "FAIL", ev };
  }
  const itemId = st.items.find((i) => i.text === target)?.id;
  ev.itemId = itemId;

  const tryEnter = async (want, wantId = null) => {
    // Tab through the document; whenever focus is inside the item's li,
    // apply the contract's affordance search on that focused element.
    for (let i = 0; i < 60; i++) {
      const d = await focusedDescriptor(page);
      if (d) {
        const inside = await page.evaluate(([wantText]) => {
          const el = document.activeElement;
          const li = el.closest("li");
          return !!li && (li.querySelector("label")?.textContent || "").trim() === wantText;
        }, [want]);
        if (inside) {
          // (a) real accessible name check on the focused element
          if (await focusedHasName(page, /edit/i)) {
            await page.keyboard.press(ENTER);
            await page.waitForTimeout(150);
            if (await isEditing(page, want, wantId ?? itemId)) return "named edit control + Enter";
            await page.keyboard.press(" ");
            await page.waitForTimeout(150);
            if (await isEditing(page, want, wantId ?? itemId)) return "named edit control + Space";
          }
          // (b) F2 while inside the item
          await page.keyboard.press("F2");
          await page.waitForTimeout(150);
          if (await isEditing(page, want, wantId ?? itemId)) return "F2 inside item";
          // (c) Enter/Space on a non-checkbox descendant (label etc.)
          if (d.tag !== "input" || d.type !== "checkbox") {
            await page.keyboard.press(ENTER);
            await page.waitForTimeout(150);
            if (await isEditing(page, want, wantId ?? itemId)) return "Enter on item descendant";
            await page.keyboard.press(" ");
            await page.waitForTimeout(150);
            if (await isEditing(page, want, wantId ?? itemId)) return "Space on item descendant";
          }
        }
      }
      await page.keyboard.press("Tab");
      await page.waitForTimeout(40);
    }
    return null;
  };

  const affordance = await tryEnter(target, itemId);
  ev.affordance = affordance;
  step("keyboard edit affordance discovered", !!affordance, affordance || "none of {named control, F2, Enter/Space} worked");
  if (!affordance) return { status: "FAIL", ev };

  // Commit path: Ctrl+A retype Enter — item ID must be preserved, edit
  // mode must exit, focus must land on a visible affordance tied to the
  // SAME item (not BODY).
  await page.keyboard.press("ControlOrMeta+a");
  const newText = "Beta renamed";
  await page.keyboard.type(newText, { delay: 10 });
  await page.keyboard.press(ENTER);
  await page.waitForTimeout(250);
  st = await itemStates(page);
  const committed = st.items.find((i) => i.text === newText);
  const edState = await itemEditorOpen(page, itemId);
  step("commit preserves item id + exits edit mode",
    !!committed && committed.id === itemId && !edState.open,
    { items: st.items.map((i) => [i.id, i.text]), wantedId: itemId, editorOpen: edState.open });
  const dCommit = await focusedDescriptor(page);
  const focusOkCommit = dCommit && await page.evaluate((id) => {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const li = el.closest("li");
    if (!li) return false;
    if (id && li.getAttribute("data-id") !== String(id)) return false;
    // must be a real semantic control inside the item, genuinely visible
    // (ancestors included via checkVisibility when available)
    if (!el.matches("button,input,a,[role=button],[role=checkbox],[tabindex]") ) return false;
    if (typeof el.checkVisibility === "function") {
      return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
    }
    const cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden" && Number(cs.opacity) > 0;
  }, itemId);
  step("focus after commit lands on visible affordance of same item", !!focusOkCommit, dCommit);

  // Cancel path: re-enter edit on the same item, Escape → text unchanged,
  // id preserved, edit exited, meaningful focus.
  let affordance2 = await tryEnter(newText, itemId);
  if (affordance2) {
    await page.keyboard.type(" discard", { delay: 5 });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    st = await itemStates(page);
    const still = st.items.find((i) => i.id === itemId);
    const edState2 = await itemEditorOpen(page, itemId);
    step("Escape cancels: text unchanged, id preserved, edit exited",
      !!still && still.text === newText && !edState2.open,
      { items: st.items.map((i) => [i.id, i.text]), editorOpen: edState2.open });
    const dEsc = await focusedDescriptor(page);
    const focusOkEsc = dEsc && await page.evaluate((id) => {
      const el = document.activeElement;
      if (!el || el === document.body) return false;
      const li = el.closest("li");
      if (!li) return false;
      if (id && li.getAttribute("data-id") !== String(id)) return false;
      if (!el.matches("button,input,a,[role=button],[role=checkbox],[tabindex]")) return false;
      if (typeof el.checkVisibility === "function") {
        return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      }
      const cs = getComputedStyle(el);
      return cs.display !== "none" && cs.visibility !== "hidden" && Number(cs.opacity) > 0;
    }, itemId);
    step("focus after cancel lands on visible affordance of same item", !!focusOkEsc, dEsc);
  } else {
    step("cancel path re-entry", false, "could not re-enter edit mode");
  }

  // Mouse path must still work.
  const labelEl = page.locator(".todo-list li").filter({ hasText: newText }).locator("label").first();
  if (await labelEl.count()) {
    await labelEl.dblclick();
    await page.waitForTimeout(200);
    const ok = await page.evaluate((w) => {
      const li = [...document.querySelectorAll(".todo-list li")].find((x) => (x.querySelector("label")?.textContent || "").trim() === w);
      return !!li && li.classList.contains("editing") && !!li.querySelector("input.edit, input[type=text], textarea");
    }, newText);
    step("mouse dblclick still opens edit", ok, "");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);
  }
  const fails = ev.steps.filter((s) => s.ok === false).length;
  return { status: fails === 0 ? "PASS" : "FAIL", ev };
}

export async function runTask3(page) {
  // CONTRACT: keyboard toggle-all actually completes every item
  // (per-item checked+class truth), count and filters agree, and Clear
  // completed removes only completed items.
  const ev = { steps: [] };
  const step = (s, ok, detail) => ev.steps.push({ s, ok, detail });

  await page.reload(); await page.waitForTimeout(300);
  const NAMES = ["One", "Two", "Three"];
  for (const t of NAMES) {
    const a = await addItem(page, t);
    if (!a.ok) { step(`add "${t}"`, false, a.reason); return { status: "FAIL", ev }; }
    const d = await focusedDescriptor(page);
    if (d && d.liIndex !== null) await tabUntil(page, (x) => x.tag === "input" && x.liIndex === null);
  }
  let st = await itemStates(page);
  step("three items present", st.items.length === 3, st.items.map((i) => i.text));

  const f = await focusInsideItem(page, "One", "checkbox");
  if (f.ok) { await page.keyboard.press(" "); await page.waitForTimeout(150); }
  st = await itemStates(page);
  const one = st.items.find((i) => i.text === "One");
  step("complete One (checked AND class agree)", !!one && one.completed && !one.inconsistent,
    one ? { checked: one.checkboxChecked, cls: one.classCompleted } : "missing");

  // Clear completed via keyboard (real accessible name).
  let cleared = false;
  for (let i = 0; i < 50 && !cleared; i++) {
    const d = await focusedDescriptor(page);
    if (d && (d.tag === "button" || await focusedHasName(page, /clear completed/i))) {
      if (await focusedHasName(page, /clear completed/i)) {
        const before = await itemStates(page);
        await page.keyboard.press(ENTER);
        await page.waitForTimeout(200);
        let after = await itemStates(page);
        if (!after.items.some((x) => x.completed) && after.items.length === before.items.length - 1) cleared = true;
        else {
          await page.keyboard.press(" ");
          await page.waitForTimeout(200);
          after = await itemStates(page);
          if (!after.items.some((x) => x.completed)) cleared = true;
        }
      }
      if (cleared) break;
    }
    await page.keyboard.press("Tab"); await page.waitForTimeout(40);
  }
  step("Clear completed via keyboard", cleared, "");
  st = await itemStates(page);
  step("remaining items are exactly Two+Three, still active",
    st.items.length === 2 && st.items.some((i) => i.text === "Two") && st.items.some((i) => i.text === "Three") && st.items.every((i) => !i.completed && !i.inconsistent),
    st.items.map((i) => [i.text, i.completed]));

  // Record survivor identities BEFORE toggle-all so a patched item set
  // (same count, different ids) cannot pass.
  const survivorIds = st.items.map((i) => `${i.id}|${i.text}`).sort();

  // Toggle-all: find the all-toggle via accessible name (/mark all|toggle
  // all|complete all/i) or the checkbox near the list top; press Space and
  // require EVERY item completed — a box that checks itself without
  // completing items is the known upstream failure and must FAIL.
  let toggled = false, via = null;
  for (let i = 0; i < 50 && !toggled; i++) {
    const d = await focusedDescriptor(page);
    if (!d) { await page.keyboard.press("Tab"); continue; }
    const named = await focusedHasName(page, /mark all|toggle all|check all|complete all|select all/i);
    const isAllCb = d.tag === "input" && d.type === "checkbox" && d.liIndex === null;
    if (named || isAllCb) {
      await page.keyboard.press(" ");
      await page.waitForTimeout(200);
      const s2 = await itemStates(page);
      if (s2.items.length && s2.items.every((x) => x.completed && !x.inconsistent)) {
        toggled = true; via = `Space on ${d.tag}.${d.cls || d.type}${named ? " (named)" : ""}`;
      } else {
        ev.toggleAllCheckedWithoutEffect = await page.evaluate(() => {
          const c = document.querySelector(".toggle-all, input.toggle-all");
          return c ? (c.checked ?? null) : null;
        });
        via = `Space on ${d.tag}.${d.cls || d.type} had no per-item effect`;
      }
      break;
    }
    await page.keyboard.press("Tab"); await page.waitForTimeout(40);
  }
  step("toggle-all keyboard path completes all items", toggled, via || "no toggle-all affordance");
  st = await itemStates(page);
  step("survivors keep id+text identity after toggle-all",
    st.items.map((i) => `${i.id}|${i.text}`).sort().join() === survivorIds.join(),
    { before: survivorIds, after: st.items.map((i) => `${i.id}|${i.text}`) });
  st = await itemStates(page);
  step("count reports 0 items left", /\b0\b\s*items? left/i.test(st.countText), st.countText);
  const ac = await activateLinkByKeyboard(page, "Active");
  st = await itemStates(page);
  step("Active filter shows 0 items", ac.ok && st.visibleItems.length === 0, st.visibleItems.length);
  const cp = await activateLinkByKeyboard(page, "Completed");
  st = await itemStates(page);
  step("Completed filter shows all remaining by identity",
    cp.ok && st.visibleItems.length === 2 && st.visibleItems.every((i) => i.completed)
      && st.visibleItems.map((i) => `${i.id}|${i.text}`).sort().join() === survivorIds.join(),
    st.visibleItems.map((i) => [i.id, i.text]));
  const fails = ev.steps.filter((s) => s.ok === false).length;
  return { status: fails === 0 ? "PASS" : "FAIL", ev };
}
