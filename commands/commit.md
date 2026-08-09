---
description: Stage all changes and commit with an auto-generated Conventional Commits message in English.
---

Analyze the current git changes and commit them.

First, run these commands to understand the state:
1. `git status`
2. `git diff --staged` (if staged changes exist)
3. `git diff` (if unstaged changes exist)

Then generate a concise, descriptive commit message in English following the Conventional Commits format:
- `<type>(<scope>): <short description>`
- Imperative mood, max 72 chars for subject
- No trailing period

Execute the commit:
1. `git add .`
2. `git commit -m "<generated message>"`

Report the commit hash back to the user.

$ARGUMENTS
