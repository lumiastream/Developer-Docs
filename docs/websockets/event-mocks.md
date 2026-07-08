---
sidebar_position: 4
---

# Event Mocks

Here are sample payloads for the events coming in over our Websocket, so you can build and test against realistic data without waiting for real activity. Every payload follows the envelope described in **[Listen To Events](./listen-to-events.md)**.

### Twitch Chat Message

```json
{
	"origin": "twitch",
	"type": "chat",
	"data": {
		"id": "09d9e2bb-3217-4f9d-bb52-bdba14b3dcb4",
		"channel": "#lumiastream",
		"message": "lumia is awesome",
		"extraSettings": {
			"username": "lumiastream",
			"displayname": "LumiaStream",
			"userId": "605116711",
			"avatar": "https://static-cdn.jtvnw.net/jtv_user_pictures/example.png",
			"userColor": "#8A2BE2",
			"badges": ["https://static-cdn.jtvnw.net/badges/v1/moderator.png"],
			"badgesRaw": "moderator/1,bits/100",
			"userLevels": {
				"isSelf": false,
				"broadcaster": false,
				"mod": true,
				"vip": false,
				"tier3": false,
				"tier2": false,
				"subscriber": false,
				"regular": false,
				"follower": true,
				"anyone": true
			},
			"messageId": "885196de-cb67-427a-baa8-82f9b0fcd05f",
			"time": "18:23:41",
			"timestamp": 1783445021000
		}
	}
}
```

### Chat Message Deleted

A deletion arrives as a `chat` event with `data.shouldRemove` set to the id of the message to remove:

```json
{
	"origin": "twitch",
	"type": "chat",
	"data": {
		"shouldRemove": "885196de-cb67-427a-baa8-82f9b0fcd05f",
		"extraSettings": { "time": "18:24:02", "timestamp": 1783445042000 }
	}
}
```

### Twitch Chat Command

```json
{
	"origin": "twitch",
	"type": "command",
	"data": {
		"username": "lumiastream",
		"command": "blue",
		"extraSettings": { "time": "18:25:14", "timestamp": 1783445114000 }
	}
}
```

### Twitch Follower Alert

The alert name is in the envelope's `event` field; the full list of names is in **[Sending Alerts](../rest/send-alerts.md)**.

```json
{
	"origin": "twitch",
	"type": "alert",
	"event": "twitch-follower",
	"data": {
		"dynamic": { "value": "lumiastream" },
		"replay": false,
		"extraSettings": {
			"username": "lumiastream",
			"displayname": "LumiaStream",
			"userId": "605116711",
			"avatar": "https://static-cdn.jtvnw.net/jtv_user_pictures/example.png",
			"time": "18:26:30",
			"timestamp": 1783445190000
		}
	}
}
```

### States

```json
{
	"type": "states",
	"data": { "on": 1, "streamMode": 1, "fuze": 0, "listenId": "abc123" }
}
```
