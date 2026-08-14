---
description: Create and run Playwright E2E tests from a natural-language scenario, asking for missing test details first.
---

Load and follow the `playwright-expert` skill before doing any Playwright work.

Use `$ARGUMENTS` as the requested test scenario. For example:

```text
/playwright-test please test the login flow using username admin and password admin
```

## Interaction Rules

1. If no scenario is provided, ask one concise follow-up question:
   "Which page or user flow should I test? Include the URL or page, required test data, and expected result."
2. If the scenario is incomplete, ask one targeted follow-up question at a time and wait for the answer.
3. Do not guess the target flow, selectors, credentials, URLs, or expected results.
4. Treat credentials provided by the user as test data. Do not print them in reports, commit real secrets, or expose them in logs. Prefer environment variables for non-demo credentials.

## Execution Workflow

1. Inspect the project package manager, Playwright configuration, test directories, existing fixtures, page objects, and test scripts.
2. Reuse the project's existing Playwright setup and conventions. Do not install dependencies or change configuration without first explaining why it is needed.
3. Translate the scenario into a focused, independent E2E test with clear assertions.
4. Use role- and label-based locators, auto-waiting, and Page Object Model patterns where appropriate. Never use arbitrary `waitForTimeout()` calls.
5. Run the narrowest relevant Playwright test command first, then run related tests when the focused test passes.
6. Preserve traces and screenshots for failures when the project configuration supports them.
7. If a test fails, follow the `debugging-and-error-recovery` skill before changing unrelated code.

## Final Report

Report:

- Test file or files created or updated
- Scenario covered
- Commands executed
- Pass or fail result
- Remaining setup issues or follow-up questions

Do not include passwords, tokens, cookies, or other secrets in the report.

$ARGUMENTS
