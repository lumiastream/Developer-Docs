---
sidebar_position: 2
---

# Sending Commands

If you've been following along in our last chapter we showed you how to send commands using our Rest API. You can send those same commands over the Websocket; the body is exactly the same as the **[Send API](../rest/intro-to-send-api.md)**, sent as a stringified JSON message after connecting:

```json
{
	"type": "chat-command",
	"params": {
		"value": "blue"
	}
}
```

## Command responses

Each command you send gets one reply on your socket. Include your own `context` value in the command and it is echoed back so you can match responses to requests:

```json
{
	"type": "get-variable-value",
	"params": {
		"name": "streamer"
	},
	"context": 42
}
```

The reply arrives as:

```json
{
	"event": "socketapi:response",
	"context": 42,
	"status": 200,
	"message": "your_username"
}
```

On failure, `status` carries the error code and an `error` field replaces `message`:

```json
{
	"event": "socketapi:response",
	"context": 42,
	"status": 400,
	"error": "type is invalid"
}
```

:::tip

Command responses require an up-to-date Lumia Stream. On older versions, commands sent over the Websocket are fire-and-forget, no reply is sent, so treat a missing response as "unknown", not as failure, if you need to support older installs. The REST `/api/send` endpoint returns results on every version.

:::

:::warning

Every JSON message you send on the socket is treated as a command. Anything that isn't a valid command body (a ping, an ack, a subscribe message) is logged as a **Bad API request** error in Lumia. If you only want to listen to events, don't send anything at all.

:::

---

## Retrieving settings

The one message that isn't treated as a command is `{"retrieve": true}`. Send it and Lumia replies once on your socket with the same settings payload as the REST retrieve endpoint described in **[Getting Settings](../rest/get-settings.md)**:

```json
{ "retrieve": true }
```

The reply arrives as:

```json
{
	"event": "socketapi:retrieve",
	"data": {
		"types": ["..."],
		"options": { "...": "..." },
		"states": { "...": "..." },
		"lights": ["..."],
		"premium": true
	}
}
```

If you include a `context` value in the retrieve message, it is echoed back in the reply so you can match it to your request.
