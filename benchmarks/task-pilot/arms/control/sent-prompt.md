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

- Offline work only: do NOT consult the experimental repository
  (titoude/accessibilite-conformite), its issues/PRs, or any sibling worker
  session's output. Your three config files (package.json, pnpm-lock.yaml,
  pnpm-workspace.yaml) are verbatim copies from freeze commit
  `3f78d7c3668d108df26a43cff364c8cff946849f`.
- Real keyboard operability — programmatic-only hooks that no keyboard focus can reach do not count.
- Do not break existing mouse behavior (dblclick edit, click toggles).
- Budgets: max 3 correction rounds; 20-minute session wall-time including setup. Report your actual elapsed minutes honestly — they are recorded as self-reported.
- Preserve upstream MIT notices. Do not touch `learn.json`, `node_modules`, or files outside `examples/javascript-es5/` and `index.html`-adjacent sources.

## Deliverable

`worker-patch.diff` + a short `report.md` stating what you changed, elapsed minutes (self-reported), and anything you could not fix.


---

## Operational setup (appended by dispatcher — identical for both arms)

Where the task text says the repo is "already cloned and served" and deps
"already installed", read it as the target layout — YOU perform that clone and
install per the steps below; it counts inside your 20-minute session.

1. Clone https://github.com/tastejs/todomvc.git on your own VM and run
   `git checkout ff43b02e59dfa604386bb382034b2cd07c2bcd8a`. Edit only inside
   `examples/javascript-es5/` (`index.html`, `src/*.js`).
2. This message carries attached config files — package.json, pnpm-lock.yaml,
   pnpm-workspace.yaml — byte-verbatim from approved freeze commit
   bdef03d69e7f8a49044debdaa15725f4a9bce011 (identical to config source
   3f78d7c3668d108df26a43cff364c8cff946849f). After they download to
   ~/attachments/, place them in a worker root directory and run
   `pnpm install --frozen-lockfile --ignore-scripts` there (install
   pnpm@10.34.5 via npm if absent).
3. Use Node v22.23.3. If `node -v` differs, install it from
   https://nodejs.org/dist/v22.23.3/node-v22.23.3-linux-x64.tar.xz and put it
   on PATH. Record actual `node -v`, `npm -v`, `pnpm -v` in your report.
4. In `todomvc/examples/javascript-es5/` run
   `npm ci --omit=dev --ignore-scripts --no-audit --no-fund`. No build step.
5. To exercise the app manually, serve the todomvc repo ROOT statically and
   open /examples/javascript-es5/ (e.g. `python3 -m http.server` or
   `npx http-server`). All requests stay local.
6. Time budget: 20 minutes TOTAL from your session's platform creation time —
   includes all setup, waits, and remediation. Max 3 correction rounds. If time
   expires mid-work, stop immediately and deliver the current patch as-is —
   partial work is preserved and scored. No pause or reset.
7. Deliverables: attach BOTH `worker-patch.diff` (output of `git diff` inside
   the todomvc clone) and `report.md` (what changed, self-reported elapsed
   minutes, anything unfixed) to your final message via
   message_user(attachments=[...]).
8. Isolation: do NOT access titoude/accessibilite-conformite or any benchmark/
   evaluator repository, its PRs/issues, or another worker session's output.
   The attached files and the public todomvc clone are your only inputs.


ATTACHMENT:"https://app.devin.ai/attachments/f1392b0f-4f2f-4187-a341-39aae0600029/package.json"
ATTACHMENT:"https://app.devin.ai/attachments/a32ce7f2-a5bb-4b3f-a76a-4577aaa40353/pnpm-lock.yaml"
ATTACHMENT:"https://app.devin.ai/attachments/4631e60e-365d-467d-b66a-c42a4f66ebb3/pnpm-workspace.yaml"
