---
description: Review code changes for correctness, security, performance, maintainability, and test coverage using the code-reviewer skill.
---

Load and follow the `code-reviewer` skill to review the requested code changes.

Use `$ARGUMENTS` as the review scope. It may contain a pull request, branch, commit, file path, directory, or specific review focus. If no scope is provided, review the current git changes.

Before reviewing:
1. Understand the intent and summarize it in one sentence.
2. Inspect the relevant diff and surrounding code.
3. Check existing tests and project lint/typecheck commands when relevant.

Report findings first, ordered by severity, with file paths and line numbers. Include concrete, actionable suggestions and distinguish real correctness, security, performance, maintainability, and test-coverage issues from optional style preferences. End with positive feedback, questions, and a verdict of Approve, Request Changes, or Comment.

$ARGUMENTS
