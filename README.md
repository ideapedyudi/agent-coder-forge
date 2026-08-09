# OpenCode Global Configuration

Personal global configuration for OpenCode. It provides reusable commands, skills, references, and plugins across all projects.

## Location

This configuration is loaded from:

```text
~/.config/opencode
```

The main configuration is defined in `opencode.jsonc`. Custom commands, skills, and plugins are organized in their respective directories.

## Structure

```text
.
├── commands/       Custom slash commands
├── plugins/        OpenCode plugins
├── skills/         Reusable agent skills and references
├── opencode.jsonc  Global OpenCode configuration
├── package.json    Plugin dependencies
└── package-lock.json
```

## Setup

Install the JavaScript dependencies from this directory:

```bash
npm install
```

Some configured workflows also expect `yt-dlp` and `rtk` to be available in `PATH`.

## Notes

- OpenCode loads configuration files at startup. Restart OpenCode after changing this directory.
- The current configuration uses broad global permissions through `permission: "allow"`.
- The RTK integration is optional and is skipped when `rtk` is not installed.
