---
sidebar_position: 4
---

# Event Mocks

Here are a list of mocks that can be retrieved using our Websocket events

### Twitch Chat Command

```json
{
	"origin": "twitch",
	"type": "chat/commands/twitch",
	"data": { "username": "lumiastream", "command": "blue" }
}
```

### Twitch Chat Message

```json
{
  "origin": "twitch",
  "type": "chat/twitch",
  "data": {
    "channel": "#lumiacove",
    "user": {
      "badge-info": null,
      "badges": null,
      "color": "#8A2BE2",
      "display-name": "LumiaStream",
      "emotes": null,
      "flags": null,
      "id": "09d9e2bb-3217-4f9d-bb52-bdba14b3dcb4",
      "mod": true,
      "room-id": "12356",
      "subscriber": false,
      "turbo": false,
      "user-id": "605116711",
      "user-type": "mod",
      "emotes-raw": null,
      "badge-info-raw": null,
      "badges-raw": "moderator/1,bits/100",
      "username": "lumiastream",
      "message-type": "chat"
    },
    "ogMessage": "is here",
    "self": false
  }
```

### Twitch Follow

```json
{
  "origin": "twitch",
  "type": "alerts/twitch/followers",
  "data": {
    "type": "follow",
    "provider": "twitch",
    "providerId": "123456",
    "data": {
      "username": "lumiastream",
      "displayName": "lumiastream",
      "userId": "1120345",
      "quantity": 1,
      "eventTime": "2021-09-30T20:39:37.865285933Z"
    }
  }
}
```
