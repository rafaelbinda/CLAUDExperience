# MCP Playwright — Installation Guide

Step-by-step guide to install and configure **MCP Playwright** in Claude Code, enabling Claude to browse, extract data, and interact with web pages using natural language.

---

## What was built in this project

As a proof of concept for MCP Playwright, Claude autonomously navigated [books.toscrape.com](https://books.toscrape.com/) — a public sandbox for practicing web scraping — and collected data from **50 books** across 3 pages.

For each book the following fields were extracted: title, price, availability, star rating, and a direct link to the product page. From that data, Claude generated [`index.html`](index.html): a dark-themed table with clickable links and HTML-rendered star ratings.

The entire process — navigation, data extraction, and HTML generation — was driven by natural language, with no scripts written manually.

---

## What is MCP Playwright?

**MCP** (Model Context Protocol) is a protocol that allows Claude to interact with external tools in real time. **MCP Playwright** exposes [Playwright](https://playwright.dev/) capabilities as tools Claude can call directly, without you writing any scripts.

With it you can ask Claude things like:
- _"Go to this site and collect the data from the table"_
- _"Take a screenshot of this page"_
- _"Fill out this form and submit it"_

---

## Step 1 — Install Node.js

MCP Playwright runs on Node.js. Download and install the **LTS** version at:

**https://nodejs.org/**

> On Windows, use the `.msi` installer. Check the **"Add to PATH"** option during installation.

---

## Step 2 — Verify the Node.js installation

Open a terminal (PowerShell or CMD) and run:

```powershell
node --version
npm --version
npx --version
```

You should see the installed versions, for example:

```
v22.13.1
10.9.2
10.9.2
```

If any command is not recognized, close and reopen the terminal to reload the PATH.

---

## Step 3 — Verify the Claude Code installation

Confirm Claude Code is installed:

```powershell
claude --version
```

If it is not installed, run:

```powershell
irm https://claude.ai/install.ps1 | iex
```

---

## Step 4 — Create the MCP configuration file

Inside your project folder, create a `.mcp.json` file with the following content:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

> `npx` will download and run the MCP Playwright server automatically the first time Claude Code starts. No global installation required.

---

## Step 5 — Start Claude Code in the project

Navigate to the project folder and start Claude Code:

```powershell
cd my-project
claude
```

On the first run with `.mcp.json` present, Claude Code detects the file and loads MCP Playwright automatically.

---

## Step 6 — Confirm the MCP is active

Inside the Claude Code session, check the loaded MCPs with:

```
/mcp
```

You should see `playwright` listed as an active server.

---

## Step 7 — Test the MCP

Ask Claude something simple to confirm it is working:

> _"Go to https://example.com and tell me the page title"_

Claude will invoke `browser_navigate` and return the result. If it works, the MCP is correctly configured.

---

## Available tools

After setup, Claude has access to the following tools:

| Tool | What it does |
|---|---|
| `browser_navigate` | Navigates to a URL |
| `browser_evaluate` | Executes JavaScript on the page and returns the result |
| `browser_snapshot` | Captures the accessibility tree of the page |
| `browser_take_screenshot` | Captures a screenshot of the viewport |
| `browser_click` | Clicks an element |
| `browser_type` | Types text into a field |
| `browser_fill_form` | Fills out forms |
| `browser_select_option` | Selects an option in a `<select>` element |
| `browser_hover` | Hovers over an element |
| `browser_press_key` | Presses a keyboard key |
| `browser_wait_for` | Waits for a selector or condition |
| `browser_network_requests` | Lists the network requests made by the page |
| `browser_console_messages` | Returns the browser console logs |
| `browser_tabs` | Lists open tabs |
| `browser_close` | Closes the browser |

---

## Troubleshooting

**`node` is not recognized after installation**
Close and reopen the terminal. If it persists, add it to PATH manually:
```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs", "User")
```

**The MCP does not appear in `/mcp`**
Make sure `.mcp.json` is in the root of the folder where Claude Code was started.

**Error running `npx @playwright/mcp@latest`**
Run the command manually in the terminal to see the full error:
```powershell
npx @playwright/mcp@latest
```
If it fails due to missing browsers, install them:
```powershell
npx playwright install
```

---

## References

- [Playwright MCP — official repository](https://github.com/microsoft/playwright-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Code — documentation](https://docs.claude.com/en/docs/claude-code/overview)
