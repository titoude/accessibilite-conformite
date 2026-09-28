# Worker report — CONTROL arm

## Scope
Repo: `tastejs/todomvc` @ `ff43b02e59dfa604386bb382034b2cd07c2bcd8a`.
Patch touches only `examples/javascript-es5/index.html` and `examples/javascript-es5/src/{view,template}.js`. No persistence added (upstream reload reset kept, as instructed). MIT notices untouched.

## Changes

**index.html**
- Gave the toggle-all checkbox `id="toggle-all"` so the existing `<label for="toggle-all">` is a real label association (mouse clicks on the label now natively activate the checkbox instead of relying on a manual re-click).

**src/view.js**
- `bind("toggleAll")`: handler moved from the label's `click` to the checkbox input's `click`. Upstream bug: the listener lived on `.toggle-all-label`, so a keyboard user pressing Space on the (focusable) checkbox flipped only the checkbox and never completed any item — the "control checked but items not completed" failure. Now any activation path (keyboard Space, direct click, or label click via the new `for`/`id` link) fires the handler with the real checked state.
- `render("toggleAll")`: fixed a no-op that assigned `.checked` to the label element; it now syncs the actual input, so the control reflects state when all items are completed individually.
- `bind("itemEdit")`: kept `dblclick` on `li label`; added a `keydown` listener on the list so (a) F2 inside an item, or (b) Enter/Space on the item's (now focusable) label, enters edit mode for that item — covering discovery contract paths (b) and (c).
- `_editItemDone`: after commit or cancel, focus moves to the item's visible label (tabindex'd, actionable — Enter/Space/F2 re-enter edit), instead of falling to `document.body`. Item `data-id` is untouched in both flows.
- `_editItem`: guard against re-entering edit mode on an already-editing item.
- `_editItemDone`/`editing` class removal: `.trim()` so the `completed` class stays exact.
- `bind("newTodo")`: added a `keydown` Enter path alongside the existing `change` binding so committing a new item never depends on blur/commit timing; the controller's empty-title guard prevents double-adds.

**src/template.js**
- Per-item `<label>` gets `tabindex="0"` — keyboard focusable edit affordance (non-checkbox descendant, contract path c) and a valid focus target after edit commit/cancel.

## Verification
Real-keyboard smoke test (Playwright over CDP, `page.keyboard` events only) against the served app — 15/15 checks pass:
- type + Enter adds two items; Space on an item's `.toggle` completes it (class + checkbox agree); `1 item left` reported; All/Active/Completed links driven by focus+Enter filter the visible list; id+label identity preserved across filter changes.
- Enter on a focused label opens edit mode with focus in `.edit`; Enter commits the new title and returns focus to that item's label; Enter→Escape cancels, restores the original title, returns focus to the label; F2 on a focused `.toggle` also opens edit; dblclick still opens edit.
- Space on `.toggle-all` completes every item (each checkbox + `completed` class agree, `0 items left`); Enter on "Clear completed" removes completed items.

## Environment (actual)
- node v22.23.3 (installed from nodejs.org tarball), npm 10.9.9, pnpm 10.34.5 (installed via `npm i -g pnpm@10.34.5 --ignore-scripts`)
- worker root: `pnpm install --frozen-lockfile --ignore-scripts` — OK
- `examples/javascript-es5`: `npm ci --omit=dev --ignore-scripts --no-audit --no-fund` — OK (2 packages)

## Elapsed
≈5–6 minutes self-reported (session creation to delivery), 1 correction round used.

## Could not fix / notes
- Nothing outstanding. `.toggle-all` and `.toggle` use `opacity:0` styling (upstream CSS), which keeps them keyboard-focusable; the focus post-edit goes to the item's visible label rather than the visually-hidden checkbox.
