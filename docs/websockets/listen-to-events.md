---
sidebar_position: 3
description: Connect to the Lumia Stream Websocket and listen to chat messages, chat commands, alerts, and state changes in real time
---

# Listen To Events

Using our Websockets you will be able to listen to incoming events in real time.
This could be chat messages, chat commands, alerts, state changes, and more.

There is no subscribe step and no handshake message. As soon as you connect with a valid token, Lumia automatically pushes every event to your socket.

## Connecting

Connect to:

```bash
ws://127.0.0.1:39231/api?token=your_token
```

If you have HTTPS enabled in Lumia there is also a secure variant:

```bash
wss://127.0.0.1:39232/api?token=your_token
```

The token goes in the `?token=` query parameter. Clients that can set headers may send an `Authorization: Bearer your_token` header instead.

You can also append an optional `&name=myapp` parameter. Lumia will show a toast in the app letting the streamer know your app has connected, and another when it disconnects.

:::tip

Make sure you replace **your_token** with your actual token from the **[Get a token](../get-a-token.md)** page

:::

If the token is invalid or the API is turned off in Lumia's settings, the connection upgrade is rejected; your client sees an immediate error / close (code 1006) before the socket ever opens.

:::warning

Any JSON you send on this socket is executed as a command, exactly like the body of the REST `/api/send` endpoint. If you only want everything, **you don't need to send anything at all**. The safe non-command messages are `{"retrieve": true}` (covered in **[Sending Commands](./send-rest-commands.md)**) and `{"subscribe": [...]}` (below, up-to-date Lumia only).

:::

---

## The event envelope

Every event arrives as a JSON message with the same envelope:

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

| Field | Description |
| --- | --- |
| `origin` | The integration the event came from, e.g. `twitch`, `youtube`, `kick`, `tiktok`, `facebook`, `lumiastream` |
| `subOrigin` | Optional. A more specific source within the origin, only present when one applies |
| `type` | The kind of event, see the list below |
| `event` | Only present when `type` is `alert`. The specific alert name, e.g. `twitch-follower` |
| `data` | The event payload. Its shape depends on `type` |

`data.extraSettings` always includes `time` (an `HH:MM:SS` string) and `timestamp` (milliseconds since epoch) telling you when the event fired.

:::tip

If you used our Websockets in the past you may remember slash-style types such as `chat/twitch` or `alerts/twitch/followers`. Those came from an older version of Lumia and are **no longer emitted**; use the `type` + `event` model on this page instead.

:::

---

## Event types

| `type` | When it fires |
| --- | --- |
| `chat` | A chat message was received or deleted on any connected platform |
| `command` | A viewer triggered one of your chat commands |
| `alert` | An alert fired (the alert name is in `event`) |
| `states` | One of Lumia's core states changed |
| `modqueue_list` | The moderation queue was updated |
| `chat_platform_register` | A plugin registered a custom chat platform |

### chat

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
			"userLevels": { "mod": true, "subscriber": false, "vip": false, "follower": true, "anyone": true },
			"messageId": "885196de-cb67-427a-baa8-82f9b0fcd05f",
			"time": "18:23:41",
			"timestamp": 1783445021000
		}
	}
}
```

`extraSettings` carries everything known about the sender: `username`, `displayname`, `userId`, `avatar`, `userColor`, `badges`, `userLevels`, `messageId`, and more depending on the platform.

A deleted message arrives as another `chat` event where `data.shouldRemove` contains the id of the message to remove; there is no separate deletion type:

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

### command

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

### alert

For alerts, the envelope's `event` field carries the alert name. The names are the same values used for sending alerts through the REST API; you'll find the full list in **[Sending Alerts](../rest/send-alerts.md)** (e.g. `twitch-follower`, `twitch-bits`, `youtube-superchat`, `pulse-heartrate`).

`data` contains:

| Field | Description |
| --- | --- |
| `dynamic` | The values specific to that alert, e.g. `value` is the follower's name for `twitch-follower`, the bits amount for `twitch-bits` |
| `replay` | `true` when the alert was replayed from the event list rather than fired live |
| `extraSettings` | User info (`username`, `displayname`, `userId`, `avatar`) plus any alert-specific variables, `time`, and `timestamp` |

:::tip

Not seeing alert events? Alerts are only pushed to the socket when that alert is **enabled** in Lumia, and, unless the alert is set to ignore it, while **Stream Mode is on**.

:::

### states

Pushed whenever one of Lumia's core states changes:

```json
{
	"type": "states",
	"data": { "on": 1, "streamMode": 1, "fuze": 0, "listenId": "abc123" }
}
```

`on` (Lumia light control), `streamMode`, and `fuze` are `1` or `0`. `listenId` identifies the current Lumia account.

### modqueue_list

Sent whenever the moderation queue changes. `data.list` holds the commands currently waiting for approval, each with a `modQueueId`, `username`, `avatar`, `date`, and details about the queued command.

### chat_platform_register

Sent when a plugin registers a custom chat platform. `data` contains the `platform` key and its `icon`.

---

## Subscriptions

By default you receive every event. On up-to-date versions of Lumia you can narrow that to just the `type`s you care about:

```json
{ "subscribe": ["alert", "chat"] }
```

Lumia acks with:

```json
{ "event": "socketapi:subscribed", "channels": ["alert", "chat"] }
```

From then on only those envelope types are pushed to your socket. To go back to everything, send `{ "subscribe": [] }` — the ack replies with `"channels": "all"`. Include a `context` value to have it echoed back in the ack.

:::tip

On older versions of Lumia the subscribe message is treated as an unknown command (you'll still receive all events, and Lumia logs a bad-request error). Check the [meta endpoint](../rest/get-settings.md#api-capabilities) for the `ws-subscriptions` feature before sending it.

:::

---

## Staying connected

Up-to-date versions of Lumia ping your socket every 30 seconds and disconnect clients that stop answering; browsers and standard WebSocket libraries reply automatically, so there's nothing to implement. Older versions send nothing at all — a silent socket just means no events have fired. Either way, your client should watch for closes and reconnect with a backoff.

| Close code | Meaning | What to do |
| --- | --- | --- |
| `1000` | Lumia stopped the API on purpose (API turned off or the app is closing) | Stop, or retry slowly; the API won't be back until the streamer turns it on |
| `1012` | The API is restarting after a settings, port, or token change | Reconnect after a short delay |
| `1006` | Abnormal close. Lumia's process died or the network dropped. If it happens before the socket ever opens, your token was rejected or the API is off | Reconnect with a backoff; double-check your token if the connection never opened |

---

## Example

A minimal listener using the `WebSocket` global available in browsers and modern Node.js. Note that it never sends anything on the socket:

```js
const TOKEN = 'your_token';
let retryDelay = 1000;

function connect() {
	const socket = new WebSocket(`ws://127.0.0.1:39231/api?token=${TOKEN}&name=myapp`);

	socket.onopen = () => {
		retryDelay = 1000;
		console.log('Connected to Lumia Stream');
	};

	socket.onmessage = (raw) => {
		const msg = JSON.parse(raw.data);
		switch (msg.type) {
			case 'chat':
				if (msg.data.shouldRemove) {
					console.log(`[${msg.origin}] message deleted: ${msg.data.shouldRemove}`);
				} else {
					console.log(`[${msg.origin}] ${msg.data.extraSettings.username}: ${msg.data.message}`);
				}
				break;
			case 'command':
				console.log(`[${msg.origin}] ${msg.data.username} used the command ${msg.data.command}`);
				break;
			case 'alert':
				console.log(`[${msg.origin}] alert ${msg.event} fired`, msg.data.dynamic);
				break;
			case 'states':
				console.log('Lumia states changed', msg.data);
				break;
		}
	};

	socket.onclose = (event) => {
		if (event.code === 1000) return;
		const delay = event.code === 1012 ? 1000 : retryDelay;
		retryDelay = Math.min(retryDelay * 2, 30000);
		setTimeout(connect, delay);
	};
}

connect();
```
