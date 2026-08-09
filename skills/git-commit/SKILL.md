---
name: git-commit
description: Use when the user asks to commit, /commit, or wants to create a git commit. Handles git add, generating concise English commit messages based on staged changes, and committing.
---

# Git Commit

Use this skill when the user invokes `/commit` or asks to commit changes to git.

## Workflow

1. Run `git status` to see current state (staged, unstaged, untracked).
2. Run `git diff --staged` to understand what is already staged.
3. If nothing is staged but there are changes, run `git diff` to understand unstaged changes.
4. Generate a concise, descriptive commit message in English following [Conventional Commits](https://www.conventionalcommits.org/).

## Commit Message Format

```
<type>(<scope>): <short description>

<optional body>
```

### Types

| Type       | When to use                                |
| ---------- | ------------------------------------------ |
| `feat`     | New feature                                |
| `fix`      | Bug fix                                    |
| `refactor` | Code restructuring, no behavior change     |
| `style`    | Formatting, whitespace, linting            |
| `docs`     | Documentation changes                      |
| `chore`    | Maintenance, deps, config, build           |
| `perf`     | Performance improvement                    |
| `test`     | Adding or updating tests                   |
| `ci`       | CI/CD changes                              |
| `revert`   | Reverting a previous commit                |

### Rules

- Subject line max 72 characters, imperative mood ("add" not "added")
- No period at end of subject line
- If changes span multiple concerns, list the primary change as the type and mention others in the body

## Execution

1. Run `git add .` to stage all changes.
2. Run `git commit -m "<generated message>"`.
3. Confirm the commit hash to the user.
4. If the user specifies a message override (e.g. `/commit fix: resolve crash`), use their message directly.
