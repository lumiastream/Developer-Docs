---
sidebar_position: 2
description: Client-specific Lumia Stream MCP setup for Claude, Cursor, Codex, VS Code, Windsurf, Gemini CLI, and generic MCP clients.
---

# Client Setup

Start with the [quickstart](./setup.mdx), then use the section for your client. Prefer the embedded HTTP config when your client supports Streamable HTTP MCP servers with headers. Use `npx` stdio everywhere else.

## Claude Desktop

Claude Desktop commonly uses the stdio `mcpServers` config.

1. Open **Settings -> Developer -> Edit Config**.
2. Paste the copied `mcpServers` block into `claude_desktop_config.json`.
3. If the file already has an `mcpServers` object, add `lumia-stream` inside it instead of pasting a second `mcpServers` key.
4. Restart Claude Desktop.

Default config paths:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

## Claude Code

Embedded HTTP:

```bash
claude mcp add --transport http lumia-stream http://localhost:39231/api/mcp --header "Authorization: Bearer your_token_here"
```

Stdio:

```bash
claude mcp add lumia-stream --env LUMIA_TOKEN=your_token_here -- npx -y @lumiastream/mcp
```

By default, Claude Code registers the server for the current project. Add `--scope user` to make it available everywhere.

You can also paste JSON:

```bash
claude mcp add-json lumia-stream '{"command":"npx","args":["-y","@lumiastream/mcp"],"env":{"LUMIA_TOKEN":"your_token_here"}}'
```

Verify with:

```bash
claude mcp list
```

:::warning

Only commit `.mcp.json` to a project if it contains placeholders or environment-variable references. Do not commit your real Lumia token.

:::

## Cursor

1. Open **Cursor Settings -> MCP**. In newer builds this may be under **Tools & Integrations**.
2. Choose **New MCP Server**. Cursor opens `~/.cursor/mcp.json`.
3. Paste the copied stdio `mcpServers` block and save.
4. Return to MCP settings and refresh. The server shows a green dot once it starts.

For a project-only server, create `.cursor/mcp.json` in the project instead.

## Codex

Codex stores MCP configuration in `~/.codex/config.toml`. The CLI and IDE extension share this config; the desktop app can also configure custom MCP servers from its MCP settings.

### Codex app

Open MCP settings and choose **Connect to a custom MCP**. If your Codex build offers HTTP transport, use:

| Field | Value |
| --- | --- |
| Name | `Lumia MCP` |
| Transport tab | **HTTP** |
| URL | `http://localhost:39231/api/mcp` |
| Header | `Authorization` = `Bearer your_token_here` |

Otherwise use stdio:

| Field | Value |
| --- | --- |
| Name | `Lumia MCP` |
| Transport tab | **STDIO** |
| Command to launch | `npx` |
| Arguments | Add two arguments: `-y`, then `@lumiastream/mcp` |
| Environment variables | `LUMIA_TOKEN` = your token |
| Environment variable passthrough | Leave empty |
| Working directory | Leave empty |

If the app reports `command not found`, it did not inherit your shell PATH. Replace `npx` with the full path from:

```bash
which npx
```

### Codex CLI

HTTP via `config.toml`:

```toml
[mcp_servers.lumia-stream]
url = "http://localhost:39231/api/mcp"
bearer_token_env_var = "LUMIA_TOKEN"
```

Start Codex with `LUMIA_TOKEN` set in the environment. If this is a private local config, Codex also supports static headers:

```toml
[mcp_servers.lumia-stream]
url = "http://localhost:39231/api/mcp"
http_headers = { "Authorization" = "Bearer your_token_here" }
```

Stdio:

```bash
codex mcp add lumia-stream --env LUMIA_TOKEN=your_token_here -- npx -y @lumiastream/mcp
```

Or edit `~/.codex/config.toml`:

```toml
[mcp_servers.lumia-stream]
command = "npx"
args = ["-y", "@lumiastream/mcp"]

[mcp_servers.lumia-stream.env]
LUMIA_TOKEN = "your_token_here"
```

Verify with:

```bash
codex mcp list
```

## VS Code Copilot Agent Mode

Create `.vscode/mcp.json` in your workspace, or run **MCP: Add Server** from the Command Palette.

VS Code uses `servers` as the root key:

Embedded HTTP with a secure prompt for the token:

```json
{
	"inputs": [
		{
			"type": "promptString",
			"id": "lumia-token",
			"description": "Lumia API token",
			"password": true
		}
	],
	"servers": {
		"lumia-stream": {
			"type": "http",
			"url": "http://localhost:39231/api/mcp",
			"headers": {
				"Authorization": "Bearer ${input:lumia-token}"
			}
		}
	}
}
```

Stdio:

```json
{
	"servers": {
		"lumia-stream": {
			"type": "stdio",
			"command": "npx",
			"args": ["-y", "@lumiastream/mcp"],
			"env": {
				"LUMIA_TOKEN": "your_token_here"
			}
		}
	}
}
```

Start the server from the inline **Start** action in the file or the trust prompt. The tools appear in Copilot Chat agent mode. Avoid hardcoding real tokens in workspace files that may be committed.

## Windsurf

Open **Windsurf Settings -> Cascade -> MCP** and view the raw config, or edit the file directly:

- macOS/Linux: `~/.codeium/windsurf/mcp_config.json`
- Windows: `%USERPROFILE%\.codeium\windsurf\mcp_config.json`

Paste the copied stdio `mcpServers` block, save, and refresh the MCP list in Cascade.

## Gemini CLI

Add the copied stdio `mcpServers` block to:

- user config: `~/.gemini/settings.json`
- project config: `.gemini/settings.json`

Run `/mcp` inside Gemini CLI to confirm the server connected and to list tools.

## Any other MCP client

For embedded HTTP, provide:

- type/transport: `http` or Streamable HTTP
- URL: `http://localhost:39231/api/mcp`
- header: `Authorization: Bearer your_token_here`

For stdio, provide:

- command: `npx`
- arguments: `-y`, `@lumiastream/mcp`
- environment variable: `LUMIA_TOKEN=your_token_here`

If the client cannot launch `npx` directly on Windows, set:

- command: `cmd`
- arguments: `/c`, `npx`, `-y`, `@lumiastream/mcp`

## After connecting

Ask your assistant:

> "Call `get_settings` and summarize what Lumia tools are available."

Then try a read-only status check:

> "Call `get_state` and tell me whether any platforms are live."
