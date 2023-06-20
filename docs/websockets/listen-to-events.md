---
sidebar_position: 3
---

# Listen To Events

Using our Websockets you will be able to listen to incoming events.
This could be chat messages, chat commands, alerts, and so much more. You'll find the full list of events below.

A sample event will look like this:

```json
{
  "origin": "twitch",
  "type": "chat/commands/twitch",
  "data": { "username": "lumiastream", "command": "blue" }
}
```

The event will contain the `origin` from where it came, a `type` that you can find below for valid events, as well as data that contains information pertaining to that event.

Using Websockets you can do things that are beyond the scope of Lumia or just trigger things inside of your own app/game. We have a broad range of connections so anything coming in can be tied to on your end.

---

## Valid Event Types

- chat/twitch
- chat/facebook
- chat/youtube
- chat/trovo
- chat/commands
- chat/commands/twitch
- chat/commands/facebook
- chat/commands/youtube
- chat/commands/trovo
- time-of-use
- live
- twitch/points
- twitch/extensions
- pulse/rate/max
- pulse/rate/min
- pulse/calories/max
- pulse/calories/min
- alerts/twitch/followers
- alerts/twitch/subscribers
- alerts/twitch/bits
- alerts/twitch/hosts
- alerts/twitch/raids
- alerts/youtube/subscribers
- alerts/youtube/members
- alerts/youtube/superchats
- alerts/youtube/superstickers
- alerts/facebook/followers
- alerts/facebook/reactions
- alerts/facebook/stars
- alerts/facebook/supports
- alerts/facebook/shares
- alerts/facebook/fans
- alerts/streamlabs/donations
- alerts/streamlabs/charity
- alerts/streamlabs/merch
- alerts/streamlabs/redemptions
- alerts/streamlabs/primegifts
- alerts/streamelements/donations
- alerts/streamelements/merch
- alerts/streamelements/redemptions
- alerts/extralife/donations
- alerts/donordrive/donations
- alerts/tipeestream/donations
- alerts/tiltify/campaigndonations
- alerts/patreon/campaignpledges
- alerts/treatstream/treats
- alerts/tipeeestream/donations
- alerts/pulse/rate
- alerts/pulse/calories
