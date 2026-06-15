# Claude Code — Quick Reference

![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20VS%20Code-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Language](https://img.shields.io/badge/language-EN-yellow)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

> For experienced developers getting started with Claude Code. No fluff.

---

## Table of Contents

- [1. Installation on Windows](#1-installation-on-windows)
- [2. VS Code Integration](#2-vs-code-integration)
- [3. Project Structure](#3-project-structure)
- [4. CLAUDE.md — The Project Brief](#4-claudemd--the-project-brief)
- [5. Essential Slash Commands](#5-essential-slash-commands)
- [6. Terminal Keyboard Shortcuts](#6-terminal-keyboard-shortcuts)
- [7. Execution Modes](#7-execution-modes-autonomy-levels)
- [8. Special Chat Prefixes](#8-special-chat-prefixes)
- [9. Common Mistakes](#9-common-mistakes-and-how-to-avoid-them)
- [10. Recommended Workflow](#10-recommended-workflow)
- [11. Tips for Developers Coming from Traditional Development](#11-tips-for-developers-coming-from-traditional-development)
- [12. References](#12-references)

---

## 1. Installation on Windows

### Option A — Native installer (recommended)

**Zero dependencies. Auto-updates in the background. One single command.**

Open **PowerShell** and run:

```powershell
irm https://claude.ai/install.ps1 | iex
```

> No Node.js, npm, or PATH configuration needed. This is the official Anthropic method since 2026.

### ⚠️ PATH error after installation (common case)

The installer may warn that `C:\Users\YOUR_USER\.local\bin` is not in the PATH, causing `claude` to be unrecognized in the terminal.

**Fix via PowerShell:**

```powershell
[Environment]::SetEnvironmentVariable(
  "Path",
  [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Users\YOUR_USER\.local\bin",
  "User"
)
```

> Replace `YOUR_USER` with your Windows username. Then **close and reopen the terminal** — required to reload the PATH.

**Fix via GUI:**

1. `Win + R` → type `sysdm.cpl` → Enter
2. **Advanced** tab → **Environment Variables** button
3. Under **User variables**, click **Path** → **Edit**
4. Click **New** → paste `C:\Users\YOUR_USER\.local\bin`
5. OK everything → close and reopen the terminal

**Confirm the installation:**

```powershell
claude --version
```

**Diagnostics (if it still doesn't work):**

```powershell
$env:PATH  # check if the path appears in the list
```

---

### Option B — Via npm (if you prefer to pin a version)

Requires Node.js 18+. Use **nvm** to manage Node versions:

```powershell
# Install nvm for Windows at: github.com/coreybutler/nvm-windows
nvm install 20
nvm use 20

# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Confirm
claude --version
```

> ⚠️ Never run `npm install` as Administrator. If you get a permission error, install Node via nvm (which installs in the user directory).

---

### Authentication

On first run, a browser window opens automatically for authentication:

```bash
claude
```

Or authenticate via API key (useful in headless environments):

```bash
export ANTHROPIC_API_KEY=sk-ant-...
claude
```

---

## 2. VS Code Integration

### Integrated terminal

Claude Code runs directly in the VS Code integrated terminal (`` Ctrl + ` ``). No extension required — just open the terminal and call `claude`.

### Official extension

Install the **Claude Code** extension from the VS Code marketplace to have the agent available as a side panel, with visual diff support and edit approval inside the editor.

### Useful shortcuts in VS Code + Claude Code

| Action | How |
|---|---|
| Open integrated terminal | `` Ctrl + ` `` |
| Open new terminal tab | `` Ctrl + Shift + ` `` |
| Navigate between terminals | `Ctrl + PageUp / PageDown` |
| Full screen terminal | `Ctrl + Shift + P` → "Toggle Terminal Full Screen" |

---

## 3. Project Structure

```
my-project/
├── CLAUDE.md                  # permanent project instructions ← ESSENTIAL
├── .claude/
│   ├── settings.json          # team config (versioned in Git)
│   ├── settings.local.json    # personal config (gitignored)
│   ├── commands/              # your custom slash commands
│   │   └── deploy.md          # becomes the /deploy command
│   ├── agents/                # specialized subagents
│   └── hooks/                 # scripts triggered on agent events
└── ~/.claude/
    └── CLAUDE.md              # global preferences (all projects)
```

**Golden rule:** version `CLAUDE.md`, `commands/`, `agents/` in Git. Put `settings.local.json` in `.gitignore`.

---

## 4. CLAUDE.md — The Project Brief

Loaded automatically every session. It is the "onboarding" you would give a new developer. **Keep it under 200 lines.**

### Minimal template

```markdown
# Project
Order management app in Node.js + PostgreSQL.

# Commands
- `npm run dev` — starts locally on :3000
- `npm test` — Jest (run before committing)
- `npm run migrate` — applies migrations

# Conventions
- TypeScript strict mode
- Conventional commits (feat:, fix:, chore:)
- Folders: src/controllers/, src/services/, src/models/

# Do not
- Do not install dependencies without asking
- Do not touch /migrations (auto-generated)
- Do not use `any` in TypeScript

# When stuck
Ask before assuming. Silent assumptions are costly.
```

### Best practices

- **Imperative > descriptive:** "Use TypeScript strict" beats "this project uses TypeScript strict"
- **Show, don't tell:** exact commands, exact paths, short examples
- **List what NOT to do:** generated folders, banned libs, deprecated patterns
- **Update in real time:** in chat, prefix with `#` → Claude proposes adding it to CLAUDE.md

---

## 5. Essential Slash Commands

### Session management

| Command | What it does |
|---|---|
| `/init` | Generates the initial CLAUDE.md by reading your repo. **Always the first command in a new project.** |
| `/clear` | Clears the context and starts from scratch. Use between unrelated tasks. |
| `/compact` | Summarizes the conversation keeping what matters. For long sessions that need to continue. |
| `/resume` | Resumes the previous session. Useful when the terminal closes unexpectedly. |
| `/help` | Lists everything available, including your custom commands. |

### Cost and model control

| Command | What it does |
|---|---|
| `/cost` | **Shows how many tokens were used and how much the session has cost so far.** Use to decide when to switch models. |
| `/model` | Switches the active model (Opus / Sonnet / Haiku). Calibrate by task complexity. |

> 💡 **Cost tip:** Sonnet handles ~90% of cases. Reserve Opus for architecture and complex problems. Run `/cost` regularly to avoid surprises.

### Git and code

| Command | What it does |
|---|---|
| `/review` | Code review of modified files. **Always run before creating a PR.** |
| `/pr` | Creates a pull request with title and description generated from the diff. |

### Extensibility

| Command | What it does |
|---|---|
| `/mcp` | Manages connected MCP servers (GitHub, Postgres, Linear, Sentry…). |
| `/agents` | Lists available subagents for the project and globally. |

---

## 6. Terminal Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Shift + Tab` | Toggle auto-accept (accepts edits automatically without asking for confirmation) |
| `Esc` | Interrupts the current task |
| `Esc Esc` | Edits the last sent message |
| `Ctrl + R` | Searches the terminal command history |
| `!command` | Runs a shell command directly without leaving Claude (e.g. `!git status`) |
| `#instruction` | Updates CLAUDE.md with the typed instruction |

---

## 7. Execution Modes (Autonomy Levels)

| Mode | What it does | When to use |
|---|---|---|
| **Read-only** | Only reads, proposes diffs. Touches nothing. | Exploring an unfamiliar codebase or auditing. |
| **Suggest** | Proposes changes and asks for confirmation at each step. | **Default mode to start.** You approve everything. |
| **Auto-edit** | Edits files on its own, asks before running commands. | Good balance between speed and control. |
| **Full-auto** | Executes everything in a sandbox without asking for confirmation. | Long and parallel tasks in an isolated environment. |

> 🔰 **For beginners:** start in `suggest` mode, observe what the agent does, and increase autonomy gradually as you gain confidence.

---

## 8. Special Chat Prefixes

| Prefix | Effect |
|---|---|
| `# instruction` | Adds the instruction directly to the project's CLAUDE.md |
| `! command` | Executes a shell command without leaving the session |
| `@file` | References a specific file for context |

---

## 9. Common Mistakes (and How to Avoid Them)

| Mistake | Why it happens | How to avoid |
|---|---|---|
| Skipping `/init` | Without CLAUDE.md, it guesses conventions and gets them wrong | Always start with `/init` in a new project |
| Bloated CLAUDE.md | Too much detail pollutes the session context | Keep it under 200 lines. Split into sub-CLAUDE.md per folder |
| Not running `/review` before a PR | Trivial issues slip through | Always run `/review` before creating a PR |
| Writing descriptive CLAUDE.md | "This project uses X" is less effective | Use imperatives: "Use X", "Do not do Y" |
| Letting Claude decide architecture | Implementation ≠ architectural decision | Use it to implement. Architecture requires human review |
| Ignoring `/compact` | Long session = expensive tokens + polluted context | Compact between unrelated tasks |
| Long session without `/cost` | Accumulated spend goes unnoticed | Run `/cost` regularly to monitor |
| `claude` not recognized after install | `.local\bin` directory not in PATH | Add to PATH and reopen the terminal (see section 1) |

---

## 10. Recommended Workflow

```
1. Open the VS Code integrated terminal (Ctrl + `)
2. Navigate to the project: cd my-project
3. Start Claude: claude
4. First use in the project: /init → edit the generated CLAUDE.md
5. Describe the task in natural language
6. Review the proposed changes before accepting
7. Before the PR: /review
8. To check spending: /cost
9. Between different tasks: /clear or /compact
```

---

## 11. Tips for Developers Coming from Traditional Development

- **It is not autocomplete** — it is an agent that reads the entire project and makes decisions. Treat it like a junior developer who needs context.
- **Context is everything** — the more specific the CLAUDE.md, the better the responses. Invest 10 minutes configuring it before you start.
- **Iterate** — the second and third response are almost always better than the first. Ask for adjustments in the same session.
- **Monitor tokens** — use `/cost` to understand how much each type of task consumes. This guides your model choice.
- **Human approval** — for consequential actions (PR, deploy, database query), ask for the plan first, then authorize.

---

## 12. References

| Resource | Link |
|---|---|
| Official Claude Code documentation | https://docs.claude.com/en/docs/claude-code/overview |
| npm package | https://www.npmjs.com/package/@anthropic-ai/claude-code |
| Claude.ai support | https://support.claude.com |
| Anthropic Skills repository | https://github.com/anthropics/skills |
| This repository | https://github.com/rafaelbinda/CLAUDExperience |

---

## Contributing

Found something outdated or want to add a command you use daily? Open an [issue](https://github.com/rafaelbinda/CLAUDExperience/issues) or a [pull request](https://github.com/rafaelbinda/CLAUDExperience/pulls). This is a living guide — it grows with use.

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<p align="center">
  Made with ☕ and plenty of <code>/cost</code> to keep the bill in check &nbsp;·&nbsp;
  <a href="https://github.com/rafaelbinda/CLAUDExperience">rafaelbinda/CLAUDExperience</a>
</p>
