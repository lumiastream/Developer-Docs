---
sidebar_position: 3
---

# Send API

The send api will allow you to do most of the control over Lumia Stream.

e.g. Trigger the chat command named **blue**

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to send:

```json
{
	"type": "chat-command",
	"params": {
		"value": "blue"
	}
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::

---

The valid types for using the send api:

- chat-command
- chatbot-command
- twitch-points
- twitch-extension
- alert
- chatbot-message
- rgb-color
- hex-color
- studio-scene
- studio-theme
- studio-animation
- start-fuze
- stop-fuze
- toggle-fuze
- fuze-audio-sensitivity
- to-default
- set-lumia
- start-lumia
- stop-lumia
- toggle-stream-mode
- resume-queue
- pause-queue
- clear-queue
- clear-cooldowns
- set-command-state
- set-folder-state
- tts
- update-variable-value
- get-variable-value
- overlay-set-visibility
- overlay-set-layer-visibility
- overlay-set-layer-position
- overlay-set-content

---

## Errors

On up-to-date versions of Lumia, requests that can be rejected upfront return a structured JSON error you can branch on:

```json
{
	"status": 404,
	"code": "not_found",
	"message": "No chat-command named \"blu\" exists. Call GET /api/retrieve to list valid values."
}
```

- `unknown_type` (400) — the `type` isn't a valid Send API type.
- `not_found` (404) — the named command, scene, theme, or animation doesn't exist in this user's setup. Checked before anything is queued, so a bad name never runs.

Other failures keep their existing plain-text messages with a 400 status. Older versions of Lumia return `{ "message": true, "status": 200 }` even for names that don't exist, so don't rely on these errors when supporting old installs — check the [meta endpoint](./get-settings.md#api-capabilities) for the `name-validation` feature.

Check next how to use each type and what are the required values to be sent
