---
sidebar_position: 1
description: Connect Claude, Cursor, Codex, VS Code, or any Model Context Protocol client to Lumia Stream so an AI assistant can control your lights, alerts, commands, TTS, and variables.
---

# Lumia Stream MCP Server

The Lumia Stream MCP server lets an AI assistant ([Claude Desktop](https://claude.ai/download), [Claude Code](https://claude.com/claude-code), [Cursor](https://cursor.com), [Codex](https://developers.openai.com/codex), or any [Model Context Protocol](https://modelcontextprotocol.io) client) control Lumia Stream with natural language.

It is a thin wrapper over the same local [Send API](../rest/intro-to-send-api.md) you already use, so it needs nothing new from Lumia beyond the API being enabled. Your assistant can then do things like:

> "Set my lights to a warm sunset, then trigger the follower alert."

> "What chat commands do I have? Run the one that turns everything blue."

## Prerequisites

- [Node.js](https://nodejs.org) 20 or newer
- Lumia Stream running on the same machine
- The Developers API enabled in **Settings → API**

## Get your token

1. Open **Settings → API** in Lumia Stream.
2. Check **Enable Developers API**.
3. Click **Copy MCP Config**; this copies a ready-to-paste configuration block with your token already filled in.

:::tip

The MCP server uses the **same token** as the REST API. If you reset the token, update it in your MCP client config too.

:::

## Add it to your client

There are two ways to connect. **Up-to-date versions of Lumia Stream embed the MCP server directly in the app** — no Node.js or npx needed. Click **Copy MCP Config (No Install)** for a ready-made HTTP block:

```json
{
	"mcpServers": {
		"lumia-stream": {
			"type": "http",
			"url": "http://localhost:39231/api/mcp",
			"headers": {
				"Authorization": "Bearer your_token_here"
			}
		}
	}
}
```

With Claude Code that's one command:

```bash
claude mcp add --transport http lumia-stream http://localhost:39231/api/mcp --header "Authorization: Bearer your_token_here"
```

The embedded endpoint is always the same version as your app, updates with it, and only works while Lumia is running with the API enabled. If your client only supports **stdio** servers (or you're on an older Lumia), use the npx setup below — both expose exactly the same tools.

**Copy MCP Config** gives you the standard stdio `mcpServers` JSON block with your token filled in:

```json
{
	"mcpServers": {
		"lumia-stream": {
			"command": "npx",
			"args": ["-y", "@lumiastream/mcp"],
			"env": {
				"LUMIA_TOKEN": "your_token_here",
				"LUMIA_PORT": "39231"
			}
		}
	}
}
```

Claude Desktop, Cursor, Windsurf, and Gemini CLI accept that block as-is. Codex and VS Code use the same values in a slightly different shape. Every client boils down to the same three facts: launch `npx` with arguments `-y @lumiastream/mcp` over **stdio**, with your token in a `LUMIA_TOKEN` environment variable.

### Claude Desktop

1. Open **Settings → Developer → Edit Config**. This opens `claude_desktop_config.json` (macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`, Windows: `%APPDATA%\Claude\claude_desktop_config.json`).
2. Paste the copied block. If the file already has an `mcpServers` object, add the `lumia-stream` entry inside it rather than pasting a second `mcpServers` key.
3. Restart Claude Desktop. The Lumia tools appear under the search-and-tools icon in the chat box.

### Claude Code

One command, no file editing:

```bash
claude mcp add lumia-stream --env LUMIA_TOKEN=your_token_here -- npx -y @lumiastream/mcp
```

By default the server is registered for the current project only; add `--scope user` to make it available everywhere. Alternatives: paste the JSON with `claude mcp add-json lumia-stream '{"command":"npx","args":["-y","@lumiastream/mcp"],"env":{"LUMIA_TOKEN":"your_token_here"}}'`, or commit a `.mcp.json` file (the `mcpServers` shape above) at the project root to share it with a team. Verify with `claude mcp list`.

### Cursor

1. Open **Cursor Settings → MCP** (called **Tools & Integrations** in newer builds) and choose **New MCP Server**; this opens `~/.cursor/mcp.json`. For a per-project server, create `.cursor/mcp.json` in the project instead.
2. Paste the copied block and save.
3. Back in the MCP settings, the server shows a green dot once it starts; the tools are available in Agent chat.

### Codex

The Codex app and the Codex CLI share the same server list, stored in `~/.codex/config.toml`.

**In the app**, open the MCP settings and choose **Connect to a custom MCP**. The form doesn't take JSON. Spread the values across its fields:

| Field | Value |
| --- | --- |
| Name | `Lumia MCP` (anything you like) |
| Transport tab | **STDIO** |
| Command to launch | `npx` |
| Arguments | two entries via **+ Add argument**: `-y`, then `@lumiastream/mcp` |
| Environment variables | key `LUMIA_TOKEN`, value your token |
| Environment variable passthrough | leave empty |
| Working directory | leave empty |

Save, and the Lumia tools appear in the tools list. If the server fails to start with a "command not found" error, the app didn't inherit your shell's PATH; replace `npx` in **Command to launch** with its full path (run `which npx` in a terminal).

**With the CLI**:

```bash
codex mcp add lumia-stream --env LUMIA_TOKEN=your_token_here -- npx -y @lumiastream/mcp
```

or edit `~/.codex/config.toml` directly. Note the snake_case `mcp_servers` key:

```toml
[mcp_servers.lumia-stream]
command = "npx"
args = ["-y", "@lumiastream/mcp"]

[mcp_servers.lumia-stream.env]
LUMIA_TOKEN = "your_token_here"
```

Verify with `codex mcp list`.

### VS Code (Copilot agent mode)

Create `.vscode/mcp.json` in your workspace (or run **MCP: Add Server** from the Command Palette). VS Code's root key is `servers`, not `mcpServers`, and each entry declares its transport:

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

Start the server from the inline **Start** action in the file (or trust prompt) and the tools show up in Copilot Chat's agent mode.

### Windsurf

Open **Windsurf Settings → Cascade → MCP** and view the raw config, or edit `~/.codeium/windsurf/mcp_config.json` directly (Windows: `%USERPROFILE%\.codeium\windsurf\mcp_config.json`; create the file if it doesn't exist). Paste the copied `mcpServers` block, save, and refresh the MCP list in Cascade.

### Gemini CLI

Add the copied `mcpServers` block to `~/.gemini/settings.json` (or `.gemini/settings.json` inside a project for a per-project server). Run `/mcp` inside Gemini CLI to confirm the server connected and list its tools.

### Any other client

Any client that can launch local **stdio** MCP servers works. Wherever its config lives, supply:

- command `npx`, arguments `-y @lumiastream/mcp`
- environment variable `LUMIA_TOKEN` set to your token, plus any of the optional variables from the [Configuration](#configuration) table

:::note[Windows]

If a client fails to launch `npx` directly, set the command to `cmd` and the arguments to `/c npx -y @lumiastream/mcp`.

:::

## Configuration

| Variable | Default | Notes |
| --- | --- | --- |
| `LUMIA_TOKEN` |  | **Required.** From Settings → API. |
| `LUMIA_HOST` | `127.0.0.1` | Change only if Lumia runs on another machine reachable from the client. |
| `LUMIA_PORT` | `39231` | The REST API port shown on the API settings page. |
| `LUMIA_SECURE` | `false` | Set `true` to use the HTTPS port. |

## Tools

**Discover & read state**
- `get_settings`: your commands, alerts, connected lights, studio scenes/themes/animations, and TTS voices. Assistants call this first to discover valid values.
- `get_state`: a snapshot: live status, now-playing song, heart rate, cross-platform totals, and a per-platform breakdown (followers, subscribers, viewers, latest names, live) for every connected platform.
- `get_variable` / `get_variables` / `set_variable`: read one or many Lumia variables, or write one.

**Lights & studio**
- `set_color`: set light color by hex, RGB, or color temperature, with brightness, transition, and duration.
- `set_studio`: trigger a studio scene, theme, or animation.
- `set_lumia_state`: start, stop, or toggle Lumia, or reset lights to default.

**Trigger commands & alerts**
- `trigger_command`: run a chat, chatbot, Twitch channel-points, or Twitch extension command by name.
- `trigger_alert`: simulate a platform alert such as `twitch-follower` or `kofi-donation`.

**Chat, voice & moderation**
- `send_chat_message`: post to your chat as the bot or as yourself.
- `speak`: text-to-speech through Lumia's engine.
- `shoutout`: clip-and-chat shoutout for a user.
- `moderate_user`: ban, unban, timeout, or grant/remove VIP.
- `delete_message`: delete a chat message by id.
- `translate_message`: translate a message and post it to chat.

**Stream management**
- `set_stream_info`: change the stream title and/or category (Twitch, Kick).
- `create_clip`: create a Twitch clip; its id/url land in the `twitch_last_clip_*` variables.
- `create_stream_marker`: mark the current moment of the Twitch broadcast.
- `send_announcement`: send a highlighted announcement to Twitch chat.
- `end_poll` / `end_prediction`: end the running Twitch poll, or resolve the prediction with its winning outcome.
- `clear_chat`: clear Twitch chat for everyone.
- `pin_message`: pin or unpin a Twitch chat message.
- `manage_moderator`: grant or revoke a user's Twitch moderator role.
- `control_song_request`: add, skip, play/pause, remove, or clear song requests.
- `get_loyalty_points`: read a viewer's loyalty points balance.
- `set_counter`: set a counter variable to an exact value.
- `manage_chatbot_command`: create, update, or delete a chatbot command (unlimited on every plan).

**Overlays, session & economy**
- `control_overlay`: show/hide overlays and layers, move and resize layers, set content.
- `set_stream_mode`: turn stream mode on, off, or toggle.
- `control_queue`: pause, resume, or clear the queue, or clear cooldowns.
- `set_command_state`: enable or disable a command or folder.
- `control_fuze`: start, stop, or toggle Fuze, or set audio sensitivity.
- `loyalty_points`: add or remove a viewer's loyalty points.

**React in real time**
- `get_recent_events`: live events (chat, follows, subs, bits, raids, donations, heart-rate) the server has buffered since it started.
- `wait_for_event`: block until the next matching event, then act on it.

A `lumia://settings` resource mirrors `get_settings` for clients that read resources as context, and the server ships **prompts** (slash-commands in most clients): `start_stream`, `brb`, `hype`, `wind_down`, and `thank_new_followers`.

Because every streamer's setup is different, assistants should call `get_settings` before triggering anything, exactly as described in [Getting Settings](../rest/get-settings.md).

## Run from source

```bash
git clone https://github.com/lumiastream/mcp
cd mcp
npm install
npm run build
LUMIA_TOKEN=your_token_here npm run smoke
```

Then point your client's `command`/`args` at the built entry instead of `npx`:

```json
{
	"command": "node",
	"args": ["/absolute/path/to/mcp/dist/index.js"],
	"env": { "LUMIA_TOKEN": "your_token_here" }
}
```

## How it relates to the REST API

Every MCP tool maps to a `type` in the [Send API](../rest/intro-to-send-api.md). The server runs locally and talks to `http://localhost:39231/api`, so it works offline and never sends your token anywhere but Lumia. If you can do it with the REST API, it can be exposed as a tool; see the project README for how to add one.
