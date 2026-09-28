# Assertion mutation suite

These tests exercise the **ways we test accessibility**. Nine deliberately broken cases challenge weak assertions and the shared helpers in `assertions.mjs`. Valid controls ensure the strengthened assertions still accept the intended behavior.

From the repository root:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm exec playwright install chromium
pnpm test:validateurs
```

Exit 0 means all nine deliberate defects were detected and their valid controls passed.

| Mutation | Weak assertion | Stronger check |
| --- | --- | --- |
| `read` versus `unread` | Substring in class name | Exact class token |
| Empty accessible name | Attribute exists | Exact locator's computed accessible name |
| Decoy with the same name | Whole-page name query | Target the actual control |
| Empty label reference | Referenced ID exists | Computed name plus explicit reference integrity |
| Hidden application | Element has width | Business landmark passes visibility checks |
| Transparent ancestor | Playwright `isVisible()` alone | Check opacity through the ancestor chain |
| Missing required control | Swallowed exception | Required action must complete |
| Ineffective filter | Selection succeeded | Expected result actually changes |
| Error page | Page has a title | Expected business landmark and no error template |

`accNameMatches` uses Playwright's accessible-name matcher on a unique locator. Its additional label-reference guard is a stricter test contract, not an independent WCAG success criterion. An image's `alt` may supply a referenced name. The older `accName` export is retained for diagnostic compatibility only; never use it as evidence about the exact target.

`isTrulyVisible` detects missing boxes, display/visibility suppression and zero opacity on ancestors. It does not prove absence of clipping, occlusion or every possible visual defect. Pair it with appropriate visual and functional checks.

These nine cases are a targeted regression suite, not exhaustive validation of every possible assertion.
