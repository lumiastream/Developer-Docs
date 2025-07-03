---
sidebar_position: 19
---

# Chat Mod Commands

Lumia Stream has various Chat Mod Commands for each of our platforms that can be used.

---

## Translate any message

You can translate a message and post it directly to chat.
The language is the language code: `en,es,ar,zh,de,fr,etc.`

```bash
POST http://localhost:39231/api/send?token=your_token
```

```json
{
	"type": "translate-message",
	"params": {
		"value": "我非常喜欢 Lumia Stream",
		"username": "anyusername",
		"language": "en",
		"platform": "twitch"
	}
}
```

---

## Shoutout a user

Shoutout will find a clip of a user if possible, display it on the overlays and message in Chatbot

```bash
POST http://localhost:39231/api/send?token=your_token
```

```json
{
	"type": "shoutout",
	"params": {
		"value": "anyusername",
		"platform": "twitch"
	}
}
```

---

## Add VIP (Twitch Only)

Add a user as a VIP of the channel

```bash
POST http://localhost:39231/api/send?token=your_token
```

```json
{
	"type": "add-vip",
	"params": {
		"value": "anyusername",
		"platform": "twitch"
	}
}
```

---

## Remove VIP (Twitch Only)

Remove a user as a VIP of the channel

```bash
POST http://localhost:39231/api/send?token=your_token
```

```json
{
	"type": "remove-vip",
	"params": {
		"value": "anyusername",
		"platform": "twitch"
	}
}
```

---

## Ban User (Twitch and Youtube)

Ban a user from the channel

```bash
POST http://localhost:39231/api/send?token=your_token
```

```json
{
	"type": "ban-user",
	"params": {
		"value": "anyusername",
		"platform": "twitch"
	}
}
```

---

## Unban User (Twitch and Youtube)

Unban a user on the channel

```bash
POST http://localhost:39231/api/send?token=your_token
```

```json
{
	"type": "unban-user",
	"params": {
		"value": "anyusername",
		"platform": "twitch"
	}
}
```

---

## Timeout User (Twitch and Youtube)

Timeout a user on the channel

`duration` is how many minutes they should be timed out for
`name` is the reason of why they were timed out

```bash
POST http://localhost:39231/api/send?token=your_token
```

```json
{
	"type": "timeout-user",
	"params": {
		"value": "anyusername",
		"platform": "twitch",
		"duration": 10,
		"name": "For being very bad"
	}
}
```

---

## Delete Message from Chat

You can delete a message from chat by grabbing the message ID and passing it into value using:

```bash
POST http://localhost:39231/api/send?token=your_token
```

```json
{
	"type": "delete-message",
	"params": {
		"value": "12345",
		"platform": "twitch"
	}
}
```
