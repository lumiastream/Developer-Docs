---
sidebar_position: 21
description: Change stream info, run ads, create clips and markers, control chat modes, run polls and predictions, and manage moderators through the local REST API.
---

# Stream Commands

Lumia Stream can drive the stream itself — title, category, ads, clips, chat modes, polls, predictions, and moderators. These commands call the platform's own API using the account you connected to Lumia.

All requests go to the usual endpoint:

```bash
POST http://localhost:39231/api/send?token=your_token
```

:::tip

Always pass `platform`. These commands respond with success even when the platform is missing or unsupported, and platform-side failures (offline channel, missing permissions, out-of-range durations) don't show up in the response either. If a command silently does nothing, reconnect the platform inside Lumia so the connection has the newest permissions.

:::

---

## Stream info

### Change the stream title (Twitch, Youtube, and Kick)

Updates the stream title. The title supports `{{variables}}`. On YouTube this updates the live broadcast title and leaves the description untouched.

```json
{
	"type": "change-stream-title",
	"params": {
		"value": "Chill ranked grind",
		"platform": "twitch"
	}
}
```

### Change the category (Twitch and Kick)

Sets the current category / game. `value` is a category name that gets searched on the platform. YouTube is not supported here.

```json
{
	"type": "change-current-category",
	"params": {
		"value": "Just Chatting",
		"platform": "twitch"
	}
}
```

### Run a commercial (Twitch Only)

Starts an ad break. `duration` is the length in **seconds** (Twitch accepts 30–180) and is required — without it Twitch rejects the ad while the API still responds with success. `value` is accepted as a fallback when `duration` is absent.

```json
{
	"type": "run-commercial",
	"params": {
		"duration": 60,
		"platform": "twitch"
	}
}
```

---

## Clips & markers (Twitch Only)

### Create a clip

Creates a clip with default settings — a title or length can't be passed through the API. The response carries nothing back: the clip lands in the `twitch_last_clip_id`, `twitch_last_clip_url` and `twitch_last_clip_thumbnail_url` variables, so read those with [`get-variable-value`](./variables.md) after clipping.

```json
{
	"type": "clip",
	"params": {
		"platform": "twitch"
	}
}
```

### Create a stream marker

Drops a marker at the current point of the broadcast. `value` is the marker description. Twitch rejects markers while the channel is offline, so only send this mid-stream.

```json
{
	"type": "create-stream-marker",
	"params": {
		"value": "Epic clutch",
		"platform": "twitch"
	}
}
```

---

## Chat controls (Twitch Only)

The four chat-mode commands (`set-slow-mode`, `set-subscriber-mode`, `set-follow-mode`, `set-emotes-mode`) share the same `value` param that turns the mode on or off. They're the only send types that parse the strings `"false"`, `"off"` and `"0"` as false — and omitting `value` also counts as off, so send `"value": true` explicitly to enable a mode.

### Slow mode

`duration` is the wait between messages in **seconds** (Twitch accepts 3–120). Omit it and Lumia uses 30.

```json
{
	"type": "set-slow-mode",
	"params": {
		"value": true,
		"duration": 10,
		"platform": "twitch"
	}
}
```

### Subscriber-only mode

```json
{
	"type": "set-subscriber-mode",
	"params": {
		"value": true,
		"platform": "twitch"
	}
}
```

### Follower-only mode

`duration` is the minimum follow age in **minutes** (Twitch accepts 0–129600) — note the unit difference from slow mode's seconds. Omit it and Twitch uses 0, meaning any follower can chat.

```json
{
	"type": "set-follow-mode",
	"params": {
		"value": true,
		"duration": 10,
		"platform": "twitch"
	}
}
```

### Emote-only mode

```json
{
	"type": "set-emotes-mode",
	"params": {
		"value": true,
		"platform": "twitch"
	}
}
```

### Send an announcement

Posts a highlighted announcement in chat. The text supports `{{variables}}`. Announcements always go out in the primary color — the API can't pick another.

```json
{
	"type": "send-announcement",
	"params": {
		"value": "Drops are live for the next hour!",
		"platform": "twitch"
	}
}
```

### Clear chat

Deletes every message in chat.

```json
{
	"type": "clear-chat",
	"params": {
		"platform": "twitch"
	}
}
```

### Pin a message

`value` is the message id to pin — the same id you'd use for `delete-message`. A missing id does nothing (Lumia warns in-app while the API still responds with success).

```json
{
	"type": "pin-message",
	"params": {
		"value": "12345",
		"platform": "twitch"
	}
}
```

`pin-message` and `unpin-message` are the only send types that respond `false` (still HTTP 200) when `platform` isn't `twitch`.

### Unpin a message

Pass a message id in `value`, or omit it to unpin whatever message is currently pinned.

```json
{
	"type": "unpin-message",
	"params": {
		"platform": "twitch"
	}
}
```

---

## Polls & predictions (Twitch Only)

Lumia tracks the ids for you: creating a poll or prediction stores its id in the `twitch_current_poll_id` / `twitch_current_prediction_id` variable, and the end commands act on that stored id. In other words, `end-poll` and `end-prediction` always target the last one created through Lumia.

### Create a poll

`name` is the poll title, `value` is the comma-separated list of choices, and `duration` is how long the poll runs in **seconds** (Twitch accepts 15–1800). All three are needed — Twitch rejects a poll without a title, choices, or duration. Choices are split on commas without trimming, so a space after a comma becomes part of the next choice.

```json
{
	"type": "create-poll",
	"params": {
		"name": "Which game next?",
		"value": "Elden Ring,Valorant,Minecraft",
		"duration": 120,
		"platform": "twitch"
	}
}
```

### End a poll

Ends the current poll. `name` is the status to end it with — `ARCHIVED` (the default) or `TERMINATED` — not the poll title.

```json
{
	"type": "end-poll",
	"params": {
		"name": "TERMINATED",
		"platform": "twitch"
	}
}
```

### Create a prediction

`name` is the prediction title, `value` is the comma-separated list of outcomes (trimmed — spaces after commas are fine here, unlike poll choices), and `duration` is the prediction window in **seconds** (Twitch accepts 30–1800). All three are needed — Twitch rejects a prediction without a title, outcomes, or duration.

```json
{
	"type": "create-prediction",
	"params": {
		"name": "Do we win this one?",
		"value": "Yes, No",
		"duration": 300,
		"platform": "twitch"
	}
}
```

### End a prediction

`name` is the status: `RESOLVED` (the default) or `CANCELED`. When resolving, `value` is required — the title of the winning outcome, matched case-insensitively against the outcomes the prediction was created with. When canceling, `value` is ignored. An outcome title that doesn't match anything makes the request do nothing.

```json
{
	"type": "end-prediction",
	"params": {
		"name": "RESOLVED",
		"value": "Yes",
		"platform": "twitch"
	}
}
```

---

## Moderation extras (Twitch Only)

Grant and remove the moderator role. These pair with the VIP, ban, and timeout commands on [Chat Mod Commands](./chat-mod-commands.md).

### Add a moderator

The API responds before Twitch is even called on this one, so give it a moment before checking the result.

```json
{
	"type": "add-moderator",
	"params": {
		"value": "anyusername",
		"platform": "twitch"
	}
}
```

### Remove a moderator

```json
{
	"type": "remove-moderator",
	"params": {
		"value": "anyusername",
		"platform": "twitch"
	}
}
```
