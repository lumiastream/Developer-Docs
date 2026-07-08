---
sidebar_position: 22
description: Control the song request queue, set counters to exact values, and read loyalty point balances through the local REST API.
---

# Song Requests & Counters

The send API can also drive the song request queue, manage counter variables, and read loyalty point balances.

All requests go to the usual endpoint:

```bash
POST http://localhost:39231/api/send?token=your_token
```

---

## Song requests

One type, `song-request`, controls the whole queue. `action` picks what happens; it defaults to `add`, and an unrecognized action falls back to `add` as well.

### Add a request

`value` is the search query or URL to queue — it isn't validated, so an empty query still attempts an add. `username` and `platform` are recorded as the requester on the request; anything added through the API counts as a streamer request.

```json
{
	"type": "song-request",
	"params": {
		"action": "add",
		"value": "never gonna give you up",
		"username": "anyusername",
		"platform": "twitch"
	}
}
```

### Skip the current song

`next` works as an alias of `skip`.

```json
{
	"type": "song-request",
	"params": {
		"action": "skip"
	}
}
```

### Play and pause

`play`, `pause` and `playpause` drive Spotify playback. `playpause` toggles unless you pass an explicit `play` state:

```json
{
	"type": "song-request",
	"params": {
		"action": "play"
	}
}
```

```json
{
	"type": "song-request",
	"params": {
		"action": "playpause",
		"play": false
	}
}
```

### Remove a request

`songRequestId` picks the request to remove. Omit it to remove the most recent request.

```json
{
	"type": "song-request",
	"params": {
		"action": "remove",
		"songRequestId": "12345"
	}
}
```

### Clear the queue

```json
{
	"type": "song-request",
	"params": {
		"action": "clear"
	}
}
```

:::tip

When song requests run in Spotify's native queue mode, `remove` and `clear` can't touch songs that were already handed off to Spotify's own queue.

:::

---

## Counters

### Set a counter to an exact value

`set-counter-value` stores exactly the number you send — including `0`. If the variable doesn't exist yet, it's created and flagged as a counter.

```json
{
	"type": "set-counter-value",
	"params": {
		"name": "deaths",
		"value": 0
	}
}
```

:::tip

[`update-variable-value`](./variables.md) treats counters differently: the value runs through counter math (`"+5"` adds, `"-2"` subtracts, `"=10"` sets), and a counter whose current value is empty increments by 1 no matter what you send. Use `set-counter-value` whenever the number you send should be the number that's stored.

:::

---

## Loyalty points

### Get a user's balance

`get-loyalty-points` is one of the few send types that responds with a value instead of `true`. `username` and `platform` are both required; a user Lumia doesn't know yet comes back as `0`.

```json
{
	"type": "get-loyalty-points",
	"params": {
		"username": "anyusername",
		"platform": "twitch"
	}
}
```

Output will be

```json
{
	"message": 1500,
	"status": 200
}
```

To add or remove points, use [`add-loyalty-points`](./loyalty-points.md).
