# Worker report — javascript-es5 keyboard remediation

## What changed (3 files inside examples/javascript-es5/)

**index.html**
- Added `id="toggle-all"` to the toggle-all checkbox so the existing `<label for="toggle-all">` resolves (previously orphaned — clicking the label toggled nothing).
- Added a small `<style>` block for `.edit-item` (opacity-based reveal on hover/focus, mirroring upstream `.destroy`; stays in the keyboard tab order).

**src/template.js**
- Each todo `<li>` now renders a `<button class="edit-item">Edit</button>` — a per-item control whose accessible name matches /edit/i.

**src/view.js**
- `newTodo`: added an Enter `keydown` handler. Upstream bound only `change`, which never fires on Enter outside a `<form>` — keyboard users could not add items.
- `toggleAll`: handler moved from the label's `click` to the checkbox input's `click`. Previously Space on the focused checkbox fired `click` on the input (unhandled), so it checked itself without completing any items. Label clicks now reach the input natively via `for`/`id`.
- `render("toggleAll")`: sets `.checked` on `$toggleAllInput` (the checkbox) instead of `$toggleAll` (the label), so the control reflects the all-complete state.
- `itemEdit`: added click delegation on `.edit-item` and an F2 `keydown` handler on the list (resolves the containing `li`'s `data-id`). Dblclick binding untouched.
- `_editItemDone`: after commit or Escape-cancel, focus moves to that item's `.toggle` checkbox — a visible, actionable control belonging to the same item (previously focus fell to `<body>`).

## Verification

Drove the served app (`python3 -m http.server` at repo root) through Playwright over CDP to real Chrome 137 using real `page.keyboard` events only — 17/17 checks PASS: add via Enter ×2, Space completes item, All/Active/Completed filter Enter, item ids/labels survive filters, Edit-button Enter → type → Enter commit, Escape cancel keeps label, focus lands on the same item's toggle after both, F2 enters edit, Space on `#toggle-all` completes all + input checked + "0 items left", Enter on Clear completed removes all, dblclick editing still works. Verification script: `worker/verify.mjs` (not part of the patch).

## Environment (self-reported)

- node v22.23.3, npm 10.9.9, pnpm 10.34.5
- `pnpm install --frozen-lockfile --ignore-scripts` in worker root; `npm ci --omit=dev --ignore-scripts` in the example.

## Elapsed

~9 minutes (self-reported) for setup, patch, and verification.

## Not fixed / out of scope

- `.destroy` remains hover-reveal styling (upstream `display:none` until `:hover`), so it is not reachable by Tab; task scope did not score deletion. Edit/toggle provide keyboard operability for all scored tasks.
- Items do not persist across reload (upstream memory store) — per spec, persistence intentionally not implemented.
- No screen-reader (NVDA/VoiceOver) run; keyboard-event verification only.
