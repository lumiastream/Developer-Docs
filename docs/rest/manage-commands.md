---
sidebar_position: 20
description: Create, update, and delete chatbot commands, and enable or disable any kind of command, through the local REST API.
---

# Managing Commands

Up-to-date versions of Lumia Stream let you manage commands through the API, not just trigger them. Chatbot commands are the create/update/delete target because they're **unlimited on every plan**.

All requests go to the usual endpoint:

```bash
POST http://localhost:39231/api/send?token=your_token
```

## Create a chatbot command

```json
{
	"type": "create-chatbot-command",
	"params": {
		"name": "socials",
		"message": "Follow me everywhere: lumiastream.com/socials"
	}
}
```

The name is stored without your chat prefix and gets slugified (lowercase, spaces become dashes) — the response returns the final name. Creating a name that already exists returns a `409` with code `already_exists`.

Optional params: `description`, `alias` (array of alternate trigger names), `showInCommandsList` (show on your public commands page, default `false`), `on` (default `true`), and `cooldownDuration` (milliseconds, default `5000`). The reply text supports the same `{{variables}}` as any chatbot message.

## Update a chatbot command

```json
{
	"type": "update-chatbot-command",
	"params": {
		"name": "socials",
		"message": "New links: lumiastream.com/links",
		"newName": "links"
	}
}
```

Only the fields you pass change. Renaming checks for collisions (`409`) and is refused for Lumia's built-in system commands (`403`, code `system_command`). Unknown names return `404`.

## Delete a chatbot command

```json
{
	"type": "delete-chatbot-command",
	"params": {
		"value": "links"
	}
}
```

`params.name` works too. Built-in system commands (like `so`, `uptime`, `command`) cannot be deleted.

## Enable or disable any command kind

`set-command-state` now takes a `kind` so it works across every command list, not just chat commands:

```json
{
	"type": "set-command-state",
	"params": {
		"name": "blue",
		"value": false,
		"kind": "twitch-points"
	}
}
```

Valid kinds: `chat` (default), `chatbot`, `twitch-points`, `kick-points`, `twitch-extension`.

Kinds with platform-side state also sync it: `twitch-points` pauses/enables the reward on Twitch, `kick-points` updates the Kick reward, and `twitch-extension` recompiles your extension config. Unknown names return a `404`.

:::tip

Everything on this page requires an up-to-date Lumia Stream — check the [meta endpoint](./get-settings.md#api-capabilities) for the `name-validation` feature. On older versions these types return `400 unknown_type`, and `set-command-state` only handles chat commands.

:::
