---
sidebar_position: 4
---

# Sending Commands

In Lumia Stream a command is considered a Chat command, a Twitch Points command, a Twitch Extension command, and a Trovo Spell command.

Sending a command is the easiest thing you can do in our API because it doesn't take in any extra parameter other than the ability to set it as your default.

To send a command you will just send a POST request to:

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "chat-command",
	"params": {
		"value": "blue"
	}
}
```

_Make sure you replace **your_token** with your actual token_

The users commands may vary so you will want to retrieve their settings first as mentioned in the last tutorial **[Getting Settings](./get-settings.md)** to make sure you're triggering the correct command.

The valid types for sending a command are:

-   chat-command
-   twitch-points
-   twitch-extension
-   trovo-spells

---

## Setting Default State

You will also have the ability to set that command as your new default by adding the parameter hold inside the post request:

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "chat-command",
	"params": {
		"value": "blue",
		"hold": true
	}
}
```

---

## Extra Settings

Certain commands normally take in extra variables to determine the TTS, as well as what the Chat Bot will say. You can pass in Extra Settings by adding it to params in the POST request:

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "alert",
	"params": {
			"value": "twitch-follower",
			"extraSettings": {
				"username": "lumia"
			}
	}
}
```
