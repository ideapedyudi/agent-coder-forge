---
description: Stage all changes, commit with an auto-generated Conventional Commits message in English, and push to the remote.
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

Execute these commands:
1. `git add .`
2. `git commit -m "<generated message>"`
3. `git push`

Report the commit hash and push result back to the user.

$ARGUMENTS
