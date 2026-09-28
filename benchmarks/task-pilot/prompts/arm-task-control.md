# Task-pilot worker prompt — CONTROL arm (neutral)

You are fixing an existing vanilla-JavaScript TodoMVC app so keyboard users can complete real tasks. The evaluator drives the app with real keyboard events only and checks actual item identities.

## Target

- Repo is already cloned and served for you. App root: `examples/javascript-es5/` (`index.html`, `src/*.js`). Do not replace the app or rewrite it wholesale.
- Production deps are already installed; no build step is needed — edit `src/*.js` / `index.html` directly.
- Your patch must apply cleanly to upstream pin `ff43b02e59dfa604386bb382034b2cd07c2bcd8a`. Work in the clone; produce `worker-patch.diff` (git diff) at the end.

## User tasks that must work

1. **Add two distinct tasks, complete one, filter active/completed.** A keyboard-only user must be able to: type two items, mark one complete via its own control, and use the All/Active/Completed filters — with the visible list actually changing per filter. Items must keep their identity (id + label) across filter changes within the session. Reload resetting the list is existing upstream behavior — do NOT implement persistence; it is not scored.

2. **Keyboard editing with meaningful focus.** A keyboard-only user must be able to enter edit mode for a specific item, commit the new text, and cancel an edit — and after either action focus must land on a visible, actionable control belonging to that same item (not the page body, not a hidden element). Item id must survive both operations. Mouse double-click editing must keep working.

   Evaluation discovery contract (informational — this is a benchmark contract, not a normative WCAG requirement): the evaluator discovers the edit affordance by trying, in order, (a) a per-item control whose accessible name matches /edit/i, (b) the F2 key inside the item, (c) Enter/Space on a non-checkbox descendant of the item. Any of these satisfies it — pick whichever fits the app most naturally.

3. **Toggle all, then clear completed.** A keyboard-only user must be able to activate the "toggle all" control and have it actually complete the remaining items (each item's checkbox AND completed state must agree — checking the control itself without completing items is a known upstream failure). Item count text must report the real number. "Clear completed" must remove completed items without losing the others.

## Rules

- Real keyboard operability — programmatic-only hooks that no keyboard focus can reach do not count.
- Do not break existing mouse behavior (dblclick edit, click toggles).
- Budgets: max 3 correction rounds; 20-minute session wall-time including setup. Report your actual elapsed minutes honestly — they are recorded as self-reported.
- Preserve upstream MIT notices. Do not touch `learn.json`, `node_modules`, or files outside `examples/javascript-es5/` and `index.html`-adjacent sources.

## Deliverable

`worker-patch.diff` + a short `report.md` stating what you changed, elapsed minutes (self-reported), and anything you could not fix.
