---
sidebar_position: 3
description: Lumia Stream MCP configuration, environment variables, HTTP headers, token handling, and remote-host setup.
---

# Configuration

The MCP server talks to Lumia's local Developers API. Embedded HTTP clients authenticate with an `Authorization` header. Stdio clients authenticate through environment variables.

The published `@lumiastream/mcp` package is a stdio server. The HTTP endpoint exists inside the Lumia Stream app at `/api/mcp`.

## HTTP configuration

Use this shape when your client supports embedded HTTP MCP servers:

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

The HTTP endpoint is available only while Lumia Stream is running and the Developers API is enabled. It accepts MCP POST requests. A browser GET request to `/api/mcp` returns `405`.

The default API port is `39231`. If you changed the API port in Lumia settings, update the URL to match.

## Stdio environment variables

| Variable | Default | Notes |
| --- | --- | --- |
| `LUMIA_TOKEN` |  | Required. Copy it from **Settings -> API**. |
| `LUMIA_HOST` | `127.0.0.1` | Change only if Lumia runs on another reachable machine. |
| `LUMIA_PORT` | `39231` | The API port shown on the API settings page. |
| `LUMIA_SECURE` | `false` | Keep `false` for normal local MCP usage. Only set `true` if you have explicitly configured and trusted Lumia's local HTTPS endpoint. |

Example:

```json
{
	"mcpServers": {
		"lumia-stream": {
			"command": "npx",
			"args": ["-y", "@lumiastream/mcp"],
			"env": {
				"LUMIA_TOKEN": "your_token_here",
				"LUMIA_HOST": "127.0.0.1",
				"LUMIA_PORT": "39231",
				"LUMIA_SECURE": "false"
			}
		}
	}
}
```

## Token handling

- The MCP server uses the same token as the REST API.
- HTTP MCP uses `Authorization: Bearer your_token_here`.
- Stdio MCP uses `LUMIA_TOKEN`.
- Missing `LUMIA_TOKEN` may still let a client discover tools, but tool calls fail until the variable is set.
- Resetting the API token invalidates every HTTP header and stdio env config that still has the old token.
- Do not commit a real token to a project file.
- For shared examples, use `your_token_here` or an environment-variable placeholder.
- If an assistant posts to chat or changes stream state, it is acting with your Lumia and platform permissions.

## Remote Lumia host

The default setup assumes the MCP client and Lumia Stream are on the same machine. For stdio, you can point the MCP package at another host with `LUMIA_HOST` and `LUMIA_PORT`.

Remote access also depends on the Lumia API being reachable from that machine. If the request cannot connect, confirm the API is enabled, the port is correct, local firewall rules allow the connection, and Lumia's LAN access settings allow the client host. If you change LAN access, restart Lumia Stream so the API binds with the new setting.

The embedded HTTP endpoint is designed for the app's local API endpoint. Use stdio with `LUMIA_HOST` when you need to connect to a different machine.
