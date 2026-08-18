---
sidebar_position: 23
description: Run any Lumia, overlay, integration, or plugin action directly through the local REST API.
---

# Running Actions

Up-to-date versions of Lumia Stream let you run **actions** through the API — the same building blocks your commands and alerts are made of. Instead of a separate API type per feature, one type runs any action in the catalog, in order.

```bash
POST http://localhost:39231/api/send?token=your_token
```

```json
{
	"type": "run-actions",
	"params": {
		"actions": [
			{ "base": "lumia", "type": "chatbot", "value": { "message": "Starting in 5!" } },
			{ "type": "delay", "delay": 5000 },
			{ "base": "lumia", "type": "setColor", "value": { "rgb": { "r": 255, "g": 0, "b": 0 }, "lights": {} } }
		]
	}
}
```

Actions run sequentially and the response resolves once the list finishes. `params.extraSettings` passes template variables the actions can read:

```json
{
	"type": "run-actions",
	"params": {
		"actions": [{ "base": "lumia", "type": "tts", "value": { "message": "Thanks {{username}}!" } }],
		"extraSettings": { "username": "lumia" }
	}
}
```

## What you can run

Every action has a `base` that selects the system running it, and a `type` naming the action:

| Base | Covers |
| --- | --- |
| `lumia` | Core actions: chatbot, TTS, colors, variables, counters, loyalty, raffles, queue, song requests |
| `overlay` | Overlay and layer control: visibility, position, size, text, media, timers, HFX |
| `api` | Outbound HTTP requests (`get`, `put`, `post`, `patch`, `delete`) |
| integration key | Any connected integration, such as `twitch`, `youtube`, `kick`, `obs`, `spotify` |
| plugin key | Any installed plugin that declares actions |

Control-flow steps are type-driven and need no `base`: `delay`, `conditional`, `loop`, `randomGroup`, and `stop`.

## Discovering action shapes

Each action's `value` shape differs. Fetch the catalog rather than guessing:

```json
{ "type": "get-action-catalog" }
```

The response lists every action with the `value` shape it expects. Note the convention across `lumia` and `overlay` actions: **`value.value` is the target or name, and `value.message` is the content or payload.**

## Limits and restrictions

A request runs at most 50 actions and nests at most 5 levels deep.

These actions are rejected with a `403` and code `action_not_allowed`, because they would execute arbitrary code or synthetic input on the machine running Lumia Stream:

- `code` (custom JavaScript)
- `writeToFile`
- anything under the `commandRunner` base (shell commands, launching apps)
- anything under the `inputEvents` base (synthetic keyboard and mouse)

Nested branches inside `conditional`, `loop`, and `randomGroup` are checked with the same rules, so a blocked action cannot be smuggled in through a branch. To run those actions, put them in a command in Lumia Stream and trigger that command instead.

Integration and plugin actions are skipped when the integration is disconnected or disabled.
