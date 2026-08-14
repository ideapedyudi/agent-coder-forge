---
description: Stage all changes, commit with an auto-generated Conventional Commits message in English, and push to the remote.
---

Commit and push the current git changes immediately. Do not create a todo list or ask for confirmation unless there is a merge conflict, authentication issue, or another blocking error.

Run these commands directly:

```bash
git status
git diff --staged
git diff
git add .
git commit -m "<generated message>"
git push
```

Generate the commit message in English using Conventional Commits:
- `<type>(<scope>): <short description>`
- Imperative mood, max 72 chars for subject
- No trailing period

Report only the commit hash and push result after completion.

$ARGUMENTS
