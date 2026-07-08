---
sidebar_position: 5
description: Troubleshoot Lumia Stream MCP connection, authentication, tool visibility, launch, and platform-permission issues.
---

# Troubleshooting

Start with a read-only check:

> "Call `get_settings` and summarize the result."

If that fails, use the table below.

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Tools do not appear in the client | Client has not restarted, config was saved in the wrong file, or the server failed to launch. | Restart or refresh the client. Confirm the config path for that client in [Client setup](./clients.md). |
| `npx` or `command not found` | The MCP client did not inherit your shell PATH. | Replace `npx` with its full path from `which npx`. On Windows, use `cmd` with args `/c`, `npx`, `-y`, `@lumiastream/mcp`. |
| `npx` starts but exits immediately | Node.js is older than 20, or the first `npx` package download failed because of network/proxy restrictions. | Install Node.js 20 or newer. If the client supports HTTP, use **Copy MCP Config (No Install)**. Otherwise run `npx -y @lumiastream/mcp` once in a terminal to warm the cache or configure npm proxy settings. |
| `npx -y @lumiastream/mcp` does not launch in a client | The client has trouble resolving the package binary. | Try command `npx` with args `-y`, `-p`, `@lumiastream/mcp`, `lumia-mcp`. |
| `401` or unauthorized | API disabled, wrong token, or old token after reset. | Enable **Settings -> API**, copy the current token, and update the MCP config. |
| HTTP `/api/mcp` returns `405` in a browser | Browsers send GET. The MCP endpoint expects POST. | This is expected. Verify through an MCP client, not by opening the URL directly. |
| Stdio tools are visible but every call fails with a token error | `LUMIA_TOKEN` is missing from the MCP server environment. | Add `LUMIA_TOKEN` to the client config or set it in the environment that launches the client. |
| Server launches but tool calls fail | Lumia Stream is closed, API is disabled, the port is wrong, or the token cannot reach the API. | Open Lumia, enable the Developers API, confirm the port shown in **Settings -> API**, update the HTTP URL or `LUMIA_PORT`, and call `get_state` again. |
| `get_settings` works but a command or scene fails | The name does not match the user's setup. | Call `get_settings` with the relevant section, then use an exact returned name. |
| Chat messages do not post | Platform is disconnected, chat bot is disabled, or the account lacks permission. | Connect the platform, enable the Lumia chat bot, and try a short bot message first. |
| Twitch stream tools fail | The channel is offline, Twitch is disconnected, or the account lacks scope/permission. | Confirm Twitch is connected and live where the tool requires it. |
| Real-time event tools return no events | The MCP event stream started after the event happened, or it is not connected. | Trigger a new event and check `get_recent_events` again. Inspect the returned `status.connected`. |
| Remote host cannot connect | `LUMIA_HOST`/`LUMIA_PORT` is wrong, firewall blocks the port, or LAN access is disabled. | Confirm the host and port, allow the port through the firewall, enable Lumia API LAN access where appropriate, then restart Lumia. |

## Check the API without MCP

Use the REST meta endpoint to confirm Lumia's local API is reachable:

```bash
curl -sS http://localhost:39231/api/meta -H "Authorization: Bearer your_token_here"
```

The response should include `features` with `mcp`.

## Reduce the problem

1. Confirm Lumia is open and **Settings -> API** is enabled.
2. Confirm the token in your MCP client matches the current API token.
3. Use `get_settings` before triggering anything by name.
4. Use `get_state` to verify the assistant can read live state.
5. Test one low-risk action, such as `set_variable`, before public chat, moderation, or stream-management actions.

## When to switch transports

Switch from embedded HTTP to stdio if your client cannot send authorization headers or does not support Streamable HTTP MCP servers.

Switch from stdio to embedded HTTP if `npx`, Node, npm cache, or proxy issues are the only problem and your client supports HTTP MCP with headers.
