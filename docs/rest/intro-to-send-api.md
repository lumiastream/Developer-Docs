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

Check next how to use each type and what are the required values to be sent
