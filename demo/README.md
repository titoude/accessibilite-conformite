# Two-minute source-fix demonstration

This is a **hand-authored teaching fixture**, not an agent benchmark. The broken version intentionally contains barriers. Nothing leaves the browser and no real reservation is made.

From the repository root after the locked installation:

```sh
pnpm demo
```

Open [the broken form](http://127.0.0.1:4173/before.html), then [the corrected form](http://127.0.0.1:4173/after.html). Stop the server with Ctrl+C. This is a local preview; it does not deploy a website.

## Narration / transcript

1. In **Before**, try to reach “Reserve a place” using Tab. The mouse-only control cannot be reached. The visible field captions are not programmatic labels and the help text has insufficient contrast.
2. In **After**, Tab to “Reserve a place” and press Enter with an empty name. Focus moves to the named field with an associated error.
3. Enter “Alex”, choose “In person” with the keyboard, and reserve. The named dialog confirms the actual selection.
4. Press Escape. The dialog closes, focus returns to the reservation button, and the result remains in a status region.
5. Explain the evidence: automated scans run at initial, validation-error, dialog-open and confirmed states. Keyboard assertions check the complete task. Human screen reader and usability checks remain open.

## Reproduce the evidence

```sh
pnpm test:demo
```

The test starts its own loopback server, checks the deliberately broken baseline, runs the corrected keyboard task, tests reflow at a 320 CSS-pixel viewport and forced-colors operation, and writes full axe results and screenshots under `test-results/demo/`. Viewport reflow is not a substitute for testing actual browser zoom or mobile assistive technology.

The result fails if an axe violation **or incomplete finding** appears in the corrected declared states, if focus or the actual booking result is wrong, or if the fixed page cannot complete the task. It does not establish every WCAG criterion or demonstrate that an AI agent independently produced this patch.
