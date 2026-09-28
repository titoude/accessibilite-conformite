// Held-out task checks for the task-pilot evaluator.
// Every interaction credited toward a task is a real keyboard event
// (page.keyboard.*). DOM reads (evaluate on document state) are evidence
// only — they never produce a credited action. Programmatic focus(),
// element.click() or seeded outcomes cannot count as keyboard success.
//
// These checks implement the pilot's custom evaluation CONTRACT, not a
// normative WCAG requirement. The contract is published equally to both
// arms; the discovery procedure is in README/manifest.

export const TASK_IDS = [
  "task1_add_complete_filter",
  "task2_keyboard_edit",
  "task3_toggle_clear",
];

const TEXTS = ["Alpha task", "Beta task"];

async function focusedDescriptor(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    return {
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute("type") || null,
      cls: el.getAttribute("class") || "",
      name: el.getAttribute("aria-label") || el.getAttribute("placeholder") || (el.textContent || "").trim().slice(0, 60),
      role: el.getAttribute("role") || null,
      inLiId: el.closest("li")?.dataset?.id ?? el.closest("li")?.getAttribute("data-id") ?? null,
      isEditInput: el.matches("input.edit") || (el.tagName === "INPUT" && el.closest("li")),
    };
  });
}

// Tab (or Shift+Tab) until predicate on the focused descriptor holds.
// Returns the descriptor on success, null when the walk exhausted.
async function tabUntil(page, predicate, { maxTabs = 30, backwards = false } = {}) {
  for (let i = 0; i < maxTabs; i++) {
    const d = await focusedDescriptor(page);
    if (d && predicate(d)) return d;
    await page.keyboard.press(backwards ? "Shift+Tab" : "Tab");
    await page.waitForTimeout(50);
  }
  const d = await focusedDescriptor(page);
  return d && predicate(d) ? d : null;
}

function itemStates(page) {
  // Ground truth: per-item identity (label text) + completion (checkbox +
  // li class), plus footer count text. Never trusts toggle-all.checked.
  return page.evaluate(() => {
    const items = [...document.querySelectorAll(".todo-list li")].map((li) => ({
      id: li.getAttribute("data-id"),
      text: (li.querySelector("label")?.textContent || "").trim(),
      completed: li.classList.contains("completed") || !!li.querySelector("input[type=checkbox]")?.checked,
      visible: getComputedStyle(li).display !== "none" && !li.hidden,
    }));
    const visibleItems = items.filter((i) => i.visible);
    const countText = (document.querySelector(".todo-count")?.textContent || "").replace(/\s+/g, " ").trim();
    const clearVisible = !!document.querySelector(".clear-completed") &&
      getComputedStyle(document.querySelector(".clear-completed")).display !== "none";
    const footerVisible = !!document.querySelector(".footer") &&
      getComputedStyle(document.querySelector(".footer")).display !== "none";
    const mainVisible = !!document.querySelector(".main") &&
      getComputedStyle(document.querySelector(".main")).display !== "none";
    return { items, visibleItems, countText, clearVisible, footerVisible, mainVisible, hash: location.hash };
  });
}

async function activateLinkByKeyboard(page, name) {
  // Focus link by Tab walking and verify identity via focused descriptor.
  for (let i = 0; i < 40; i++) {
    const d = await focusedDescriptor(page);
    if (d && d.tag === "a" && new RegExp(`^${name}$`, "i").test(d.name)) {
      await page.keyboard.press("Enter");
      await page.waitForTimeout(150);
      return { ok: true };
    }
    await page.keyboard.press("Tab");
    await page.waitForTimeout(40);
  }
  return { ok: false, reason: `link ${name} not reachable by Tab` };
}

async function pressKeyOnItem(page, itemText, keys) {
  // Walk focus until the active element is inside the li holding itemText,
  // then send keys. Returns {ok, affordance?, error?}
  for (let i = 0; i < 40; i++) {
    const d = await focusedDescriptor(page);
    if (d) {
      const inside = await page.evaluate((want) => {
        const el = document.activeElement;
        const li = el.closest("li");
        if (!li) return false;
        const label = (li.querySelector("label")?.textContent || "").trim();
        return label === want;
      }, itemText);
      if (inside) {
        await page.keyboard.press(keys);
        await page.waitForTimeout(150);
        return { ok: true, focused: d };
      }
    }
    await page.keyboard.press("Tab");
    await page.waitForTimeout(40);
  }
  return { ok: false, reason: "item not keyboard-reachable" };
}

async function isEditing(page, itemText) {
  return page.evaluate((want) => {
    const el = document.activeElement;
    if (!el || el.tagName !== "INPUT") return false;
    const li = el.closest("li");
    if (!li) return false;
    const label = (li.querySelector("label")?.textContent || "").trim();
    return label === want || el.value === want;
  }, itemText);
}

export async function runTask1(page, log) {
  // CONTRACT: add two distinct todos, complete one, Active/Completed
  // filters preserve item identity + completion in-session.
  // Reload reset is baseline behavior — explicitly NOT tested/failed.
  const ev = { steps: [] };
  const step = (s, ok, detail) => ev.steps.push({ s, ok, detail });

  // Focus the new-todo input (autofocus on load; else Tab to first textbox).
  let d = await focusedDescriptor(page);
  if (!d || !(d.tag === "input" && (d.type === "text" || !d.type))) {
    d = await tabUntil(page, (x) => x.tag === "input" && (x.type === "text" || x.type === null));
  }
  if (!d) { step("focus new-todo input", false, "no text input reachable"); return { status: "FAIL", ev }; }
  step("focus new-todo input", true, d);

  for (const t of TEXTS) {
    await page.keyboard.type(t, { delay: 10 });
    await page.keyboard.press("Enter");
    await page.waitForTimeout(200);
    // If Enter did not commit (upstream 'change' semantics), Tab away to
    // force commit — still a real keyboard path. Record which fired.
    const st = await itemStates(page);
    if (!st.items.some((i) => i.text === t)) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(150);
      const st2 = await itemStates(page);
      if (st2.items.some((i) => i.text === t)) {
        ev.commitKey = "Enter+Tab (change on blur)";
        // return focus to the input for the next item
        await tabUntil(page, (x) => x.tag === "input" && (x.type === "text" || x.type === null));
      }
    } else {
      ev.commitKey = ev.commitKey || "Enter";
    }
  }
  let st = await itemStates(page);
  const okAdd = TEXTS.every((t) => st.items.some((i) => i.text === t));
  step("two items added with exact text", okAdd, st.items.map((i) => i.text));
  if (!okAdd) return { status: "FAIL", ev };

  // Complete Alpha via keyboard: focus inside its li then Space.
  const f1 = await pressKeyOnItem(page, TEXTS[0], " ");
  step("keyboard toggle Alpha", f1.ok, f1.focused || f1.reason);
  st = await itemStates(page);
  const a = st.items.find((i) => i.text === TEXTS[0]);
  step("Alpha completed=true", !!a && a.completed, st.items);

  // Completed filter shows only Alpha; Active shows only Beta.
  const c = await activateLinkByKeyboard(page, "Completed");
  step("Completed filter via keyboard", c.ok, c.reason || "activated");
  st = await itemStates(page);
  step("Completed shows exactly Alpha", st.visibleItems.length === 1 && st.visibleItems[0].text === TEXTS[0] && st.visibleItems[0].completed, st.visibleItems);
  const ac = await activateLinkByKeyboard(page, "Active");
  st = await itemStates(page);
  step("Active shows exactly Beta", st.visibleItems.length === 1 && st.visibleItems[0].text === TEXTS[1] && !st.visibleItems[0].completed, st.visibleItems);
  await activateLinkByKeyboard(page, "All");
  st = await itemStates(page);
  step("count text reports 1 item left", /\b1\b\s*items? left/i.test(st.countText), st.countText);

  ev.reloadReset = await (async () => {
    await page.reload();
    await page.waitForTimeout(300);
    const r = await itemStates(page);
    return r.items.length === 0;
  })();
  ev.reloadResetNote = "MemoryStorage reset on reload is baseline upstream behavior; recorded, not scored.";
  const fails = ev.steps.filter((s) => s.ok === false).length;
  return { status: fails === 0 ? "PASS" : "FAIL", ev };
}

export async function runTask2(page, log) {
  // CONTRACT: a keyboard path to item editing exists and works. Discovery
  // order (custom contract): (a) a focusable control with accessible name
  // matching /edit/i inside the item — Enter/Space; (b) F2 while the item
  // row/descendant has focus; (c) Enter on a focusable item label.
  // Success = a focused text input bearing the item's title inside its li.
  const ev = { steps: [] };
  const step = (s, ok, detail) => ev.steps.push({ s, ok, detail });
  const target = TEXTS[1]; // Beta — still active/uncompleted after task1

  // ensure the item exists (task3 may have cleared; re-add if needed)
  let st = await itemStates(page);
  if (!st.items.length) {
    const d = await tabUntil(page, (x) => x.tag === "input");
    if (d) { await page.keyboard.type(target, { delay: 10 }); await page.keyboard.press("Enter"); await page.waitForTimeout(200);
      st = await itemStates(page);
      if (!st.items.some((i) => i.text === target)) { await page.keyboard.press("Tab"); await page.waitForTimeout(150); }
    }
    st = await itemStates(page);
  }
  if (!st.items.some((i) => i.text === target)) {
    step("precondition: item present", false, st.items.map((i) => i.text));
    return { status: "FAIL", ev };
  }

  // (a) edit control inside the item
  const hasEditCtl = await page.evaluate((want) => {
    const li = [...document.querySelectorAll("li")].find((x) => (x.querySelector("label")?.textContent || "").trim() === want);
    if (!li) return false;
    return [...li.querySelectorAll("button,[role=button],a")].some((c) => /edit/i.test((c.getAttribute("aria-label") || c.textContent || "")));
  }, target);

  let affordance = null;
  if (hasEditCtl) {
    for (let i = 0; i < 40 && !affordance; i++) {
      const d = await focusedDescriptor(page);
      if (d && /edit/i.test(d.name) && (d.tag === "button" || d.tag === "a" || d.role === "button")) {
        await page.keyboard.press("Enter");
        await page.waitForTimeout(150);
        if (await isEditing(page, target)) affordance = "named edit control + Enter";
      }
      await page.keyboard.press("Tab");
      await page.waitForTimeout(40);
    }
  }

  // (b) F2 on focused item/descendant
  if (!affordance) {
    const f = await pressKeyOnItem(page, target, "F2");
    if (f.ok && (await isEditing(page, target))) affordance = "F2 on item";
  }
  // (c) Enter / Space on a focusable label
  if (!affordance) {
    for (const key of ["Enter", " "]) {
      const f = await pressKeyOnItem(page, target, key);
      if (f.ok && (await isEditing(page, target))) { affordance = `${key === " " ? "Space" : "Enter"} on item`; break; }
    }
  }
  ev.affordance = affordance;
  step("keyboard edit affordance discovered", !!affordance, affordance || "none of {named control, F2, Enter, Space} worked");
  if (!affordance) return { status: "FAIL", ev };

  // Commit: select-all, retype, Enter.
  await page.keyboard.press("ControlOrMeta+a");
  const newText = "Beta renamed";
  await page.keyboard.type(newText, { delay: 10 });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  st = await itemStates(page);
  const renamed = st.items.find((i) => i.id || i.text);
  step("commit via Enter updates item text", st.items.some((i) => i.text === newText), st.items.map((i) => i.text));
  const dCommit = await focusedDescriptor(page);
  step("focus after commit is meaningful (not body)", !!dCommit && dCommit.tag !== "body", dCommit);

  // Cancel path: re-enter edit, Escape, text unchanged.
  let affordance2 = null;
  if (hasEditCtl) {
    for (let i = 0; i < 40 && !affordance2; i++) {
      const d = await focusedDescriptor(page);
      if (d && /edit/i.test(d.name)) { await page.keyboard.press("Enter"); await page.waitForTimeout(150);
        if (await isEditing(page, newText)) affordance2 = "edit control"; }
      await page.keyboard.press("Tab"); await page.waitForTimeout(40);
    }
  }
  if (!affordance2) { const f = await pressKeyOnItem(page, newText, "F2"); if (f.ok && (await isEditing(page, newText))) affordance2 = "F2"; }
  if (!affordance2) { for (const k of ["Enter", " "]) { const f = await pressKeyOnItem(page, newText, k); if (f.ok && (await isEditing(page, newText))) { affordance2 = k; break; } } }
  if (affordance2) {
    await page.keyboard.type(" discard me", { delay: 5 });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    st = await itemStates(page);
    step("Escape cancels edit", st.items.some((i) => i.text === newText), st.items.map((i) => i.text));
    const dEsc = await focusedDescriptor(page);
    step("focus after cancel is meaningful (not body)", !!dEsc && dEsc.tag !== "body", dEsc);
  } else {
    step("cancel path re-entry", false, "could not re-enter edit mode");
  }

  // Mouse edit path must still work (preserve mouse functionality).
  const labelEl = page.locator("li").filter({ hasText: newText }).locator("label").first();
  if (await labelEl.count()) {
    await labelEl.dblclick();
    await page.waitForTimeout(150);
    const ok = await isEditing(page, newText) || await page.evaluate((w) => {
      const li = [...document.querySelectorAll("li")].find((x) => (x.querySelector("label")?.textContent || "").trim() === w);
      return !!li && li.classList.contains("editing");
    }, newText);
    step("mouse dblclick still opens edit", ok, "");
    await page.keyboard.press("Escape");
  }
  const fails = ev.steps.filter((s) => s.ok === false).length;
  return { status: fails === 0 ? "PASS" : "FAIL", ev };
}

export async function runTask3(page, log) {
  // CONTRACT: toggle-all via keyboard actually completes every item
  // (per-item truth, not toggle-all.checked); count/filters agree; Clear
  // completed removes only completed items and preserves the rest.
  const ev = { steps: [] };
  const step = (s, ok, detail) => ev.steps.push({ s, ok, detail });

  // Fresh state: clear storage keys upstream might use, reload, add 3 items.
  await page.reload(); await page.waitForTimeout(300);
  const d = await tabUntil(page, (x) => x.tag === "input" && (x.type === "text" || x.type === null));
  if (!d) { step("focus new-todo", false, ""); return { status: "FAIL", ev }; }
  const NAMES = ["One", "Two", "Three"];
  for (const t of NAMES) {
    await page.keyboard.type(t, { delay: 10 });
    await page.keyboard.press("Enter");
    await page.waitForTimeout(180);
    let st = await itemStates(page);
    if (!st.items.some((i) => i.text === t)) {
      await page.keyboard.press("Tab"); await page.waitForTimeout(150);
      st = await itemStates(page);
      await tabUntil(page, (x) => x.tag === "input" && (x.type === "text" || x.type === null));
    }
  }
  let st = await itemStates(page);
  step("three items present", st.items.length === 3, st.items.map((i) => i.text));

  // Complete "One" via its own checkbox (Space on checkbox inside its li).
  const f = await pressKeyOnItem(page, "One", " ");
  step("complete One via keyboard", f.ok, f.reason || "");
  st = await itemStates(page);
  const one = st.items.find((i) => i.text === "One");
  step("One completed", !!one && one.completed, st.items);

  // Clear completed via keyboard: walk Tab until a button named
  // /clear completed/i is focused, then Enter (and Space fallback).
  let cleared = false;
  for (let i = 0; i < 50 && !cleared; i++) {
    const dd = await focusedDescriptor(page);
    if (dd && (dd.tag === "button" || dd.role === "button") && /clear completed/i.test(dd.name)) {
      const before = await itemStates(page);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(200);
      let after = await itemStates(page);
      if (!after.items.some((i) => i.completed) && after.items.length === before.items.length - 1) cleared = true;
      else {
        await page.keyboard.press(" ");
        await page.waitForTimeout(200);
        after = await itemStates(page);
        if (!after.items.some((i) => i.completed)) cleared = true;
      }
      break;
    }
    await page.keyboard.press("Tab"); await page.waitForTimeout(40);
  }
  step("Clear completed via keyboard", cleared, "");
  st = await itemStates(page);
  step("remaining items are exactly Two+Three",
    st.items.length === 2 && st.items.some((i) => i.text === "Two") && st.items.some((i) => i.text === "Three") && st.items.every((i) => !i.completed), st.items);

  // Toggle-all via keyboard: find the all-toggle control (checkbox or
  // named control). Space must actually complete BOTH items.
  let toggled = false, via = null;
  for (let i = 0; i < 50 && !toggled; i++) {
    const dd = await focusedDescriptor(page);
    if (dd && ((dd.tag === "input" && dd.type === "checkbox" && /toggle-all|main|header|todoapp|body/.test(((await page.evaluate(() => document.activeElement.closest("div,section,header"))?.className || "") + "")))
        || /mark all|toggle all|check all|complete all/i.test(dd.name))) {
      await page.keyboard.press(" ");
      await page.waitForTimeout(200);
      const s2 = await itemStates(page);
      if (s2.items.length && s2.items.every((i) => i.completed)) { toggled = true; via = `Space on ${dd.tag}.${dd.cls || dd.type}`; }
      else {
        // record the half-state: control may have checked without effect
        ev.toggleAllCheckedWithoutEffect = await page.evaluate(() => {
          const c = document.querySelector("input.toggle-all, [class*=toggle-all] input[type=checkbox]");
          return c ? c.checked : null;
        });
      }
      break;
    }
    await page.keyboard.press("Tab"); await page.waitForTimeout(40);
  }
  step("toggle-all keyboard path completes all items", toggled, via || "no working toggle-all affordance");
  st = await itemStates(page);
  step("count reports 0 items left", /\b0\b\s*items? left/i.test(st.countText), st.countText);
  const ac = await activateLinkByKeyboard(page, "Active");
  st = await itemStates(page);
  step("Active filter shows 0 items", st.visibleItems.length === 0, st.visibleItems.length);
  const cp = await activateLinkByKeyboard(page, "Completed");
  st = await itemStates(page);
  step("Completed filter shows all remaining", st.visibleItems.length === 2 && st.visibleItems.every((i) => i.completed), st.visibleItems);
  const fails = ev.steps.filter((s) => s.ok === false).length;
  return { status: fails === 0 ? "PASS" : "FAIL", ev };
}
