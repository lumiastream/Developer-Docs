---
title: Tool Reference
sidebar_position: 4
description: Every Lumia Stream MCP tool with its parameters, defaults, and platform requirements.
---

# Tool Reference

These are the 43 tools your assistant can call. You never call them by hand — you ask in plain language and the assistant picks the tool. This page is here for when you want to know exactly what a tool can do, what it needs, and where it will fail.

:::tip The one rule that matters

Every streamer's setup is different. Your assistant should call `get_settings` **before** triggering anything by name — commands, alerts, studio scenes, voices, or lights. Names that don't exist in your setup fail.

:::

Both connection methods expose the same tools when they are on the same version. In the tables below, **Required** parameters must be supplied; everything else is optional.

## Discover and read state

Start here. These are all read-only and safe to call at any time.

### `get_settings`

Discovers what you actually have set up. The default summary returns states, counts, and studio scene/theme/animation names; large lists come back as counts only.

| Parameter | Type | Notes |
| --- | --- | --- |
| `section` | `summary` \| `commands` \| `alerts` \| `lights` \| `voices` \| `all` | Which slice to return. `summary` gives counts, studio names, and states. The others return one full list. |

Clients that read MCP resources can use `lumia://settings` instead.

### `get_state`

A snapshot of the current stream: streamer name, live status, now-playing song, and heart rate, plus a per-platform breakdown (followers, subscribers, viewers, latest follower/subscriber, live) for every connected platform, alongside cross-platform `totals`. Platforms with no data are omitted. Takes no parameters.

Lumia's own Stream Mode on/off is not a variable, so the per-platform `live` flag is the closest live indicator.

### `get_variable`

| Parameter | Type | Notes |
| --- | --- | --- |
| `name` **Required** | string | The variable name, e.g. `twitch_username`. |

### `get_variables`

| Parameter | Type | Notes |
| --- | --- | --- |
| `names` **Required** | string[] | Variable names to read at once. Returns a name-to-value map. |

### `set_variable`

Creates or updates a custom variable that overlays, commands, and custom code can read.

| Parameter | Type | Notes |
| --- | --- | --- |
| `name` **Required** | string | The variable name, e.g. `customVar`. |
| `value` **Required** | string \| number \| boolean | The new value. |

### `set_counter`

Sets a counter to an exact number. Creates it if it doesn't exist.

| Parameter | Type | Notes |
| --- | --- | --- |
| `name` **Required** | string | The counter name, e.g. `deaths`. |
| `value` **Required** | number | The exact value to set. |

## Lights and studio

### `set_color`

Provide **exactly one** of `hex`, `rgb`, or `ct`.

| Parameter | Type | Notes |
| --- | --- | --- |
| `hex` | string | Hex color like `#FF4076`. |
| `rgb` | `{ r, g, b }` | Each channel 0-255. |
| `ct` | number | Color temperature in kelvin, 2900-7000. |
| `brightness` | number | 0-100. Defaults to 100. |
| `transition` | number | Fade time in ms. Defaults to 0. |
| `duration` | number | How long the color holds, in ms. Defaults to 4000. |
| `hold` | boolean | Keep this color as the new default state. |

### `set_studio`

| Parameter | Type | Notes |
| --- | --- | --- |
| `kind` **Required** | `scene` \| `theme` \| `animation` | Which studio item to trigger. |
| `name` **Required** | string | The item name, e.g. `snow` or `breathe`. |
| `duration` | number | Milliseconds, for scenes and themes. Animations currently ignore it. |

### `set_lumia_state`

| Parameter | Type | Notes |
| --- | --- | --- |
| `action` **Required** | `on` \| `off` \| `toggle` \| `default` | `on` starts Lumia's light control, `off` stops it, `default` resets lights to their default state. |

## Commands and alerts

### `trigger_command`

| Parameter | Type | Notes |
| --- | --- | --- |
| `name` **Required** | string | Must match a name returned by `get_settings`. |
| `kind` | `chat-command` \| `chatbot-command` \| `twitch-points` \| `twitch-extension` | Which command list the name belongs to. |
| `hold` | boolean | Set this command as the new persistent default state. |
| `extraSettings` | object | Variables used inside the command's TTS/chatbot templates, e.g. `{ "username": "lumia" }`. |

### `trigger_alert`

Simulates a platform alert, so you can test overlays without waiting for a real event.

| Parameter | Type | Notes |
| --- | --- | --- |
| `name` **Required** | string | The alert type, e.g. `twitch-follower`, `youtube-superchat`, `kofi-donation`. |
| `extraSettings` | object | Variables for the alert variation and TTS, e.g. `{ "username": "lumia", "bits": 1000 }`. |

Every alert's payload shape is documented in the [Alerts reference](/docs/alerts).

### `manage_chatbot_command`

Chatbot commands are unlimited on every plan, so an assistant can create them mid-stream. Names are slugified (lowercase, spaces become dashes). `update` merges only the fields you pass. `delete` refuses built-in system commands.

| Parameter | Type | Notes |
| --- | --- | --- |
| `action` **Required** | `create` \| `update` \| `delete` | What to do. |
| `name` **Required** | string | The command name without the chat prefix, e.g. `socials`. |
| `message` | string | The chat reply. Required for `create`. Supports template variables. |
| `description` | string | Internal description shown in the commands list. |
| `aliases` | string[] | Alternate names that also trigger the command. |
| `new_name` | string | For `update`: rename the command. |
| `show_in_commands_list` | boolean | Show it on your public lumiastream.com commands page. |
| `enabled` | boolean | Defaults to `true` on create. |
| `cooldown_seconds` | number | Cooldown between uses. |

### `set_command_state`

| Parameter | Type | Notes |
| --- | --- | --- |
| `name` **Required** | string | The command or folder name. |
| `enabled` **Required** | boolean | `true` to enable, `false` to disable. |
| `target` | `command` \| `folder` | What `name` refers to. |
| `kind` | `chat` \| `chatbot` \| `twitch-points` \| `kick-points` \| `twitch-extension` | For `target: command`: which list the name belongs to. |

Points and extension kinds also sync the platform-side reward state, so disabling a channel-point reward here pauses it on Twitch too.

## Actions: the escape hatch

The tools above cover the common cases. `run_actions` covers everything else.

### `get_action_catalog`

Lists every action `run_actions` can execute and the exact `value` shape each expects. Takes no parameters. Call it before building an action list — payloads differ per action and a wrong shape fails silently.

Clients that read MCP resources can use `lumia://actions/catalog` instead.

### `run_actions`

| Parameter | Type | Notes |
| --- | --- | --- |
| `actions` **Required** | array of `{ base, type, value, delay }` | The actions to run, in order. |
| `extraSettings` | object | Template variables available to the actions, e.g. `{ "username": "lumia" }` for `{{username}}`. |

This reaches far more of Lumia than the individual tools: every core Lumia action, every overlay action, outbound HTTP requests, and every connected integration or plugin (Twitch, OBS, Spotify, and so on), plus control-flow steps (`delay`, `conditional`, `loop`, `randomGroup`, `stop`).

Each action needs a `base` naming the system that runs it and a `type` naming the action. Control-flow steps are type-driven and need no `base`.

```json
{
	"actions": [
		{ "base": "lumia", "type": "chatbot", "value": { "message": "Starting in 5!" } },
		{ "type": "delay", "delay": 5000 },
		{ "base": "lumia", "type": "setColor", "value": { "rgb": { "r": 255, "g": 0, "b": 0 }, "lights": {} } }
	]
}
```

:::warning Watch the value convention

Across `lumia` and `overlay` actions, `value.value` is the **target or name** and `value.message` is the **content or payload** — the opposite of what the names suggest. Read the catalog rather than guessing.

:::

`run_actions` rejects `code`, `writeToFile`, and anything under the `commandRunner` or `inputEvents` bases, including inside nested branches. To run those, put them in a Lumia command and call `trigger_command`.

## Chat, voice, and moderation

Everything in this group is visible or audible to your viewers.

### `send_chat_message`

| Parameter | Type | Notes |
| --- | --- | --- |
| `message` **Required** | string | The message text. |
| `platform` | `twitch` \| `youtube` \| `facebook` | Which chat to post to. |
| `as_streamer` | boolean | Post as yourself instead of the bot account. |

Requires the platform to be connected and the Lumia chat bot to be enabled.

### `speak`

| Parameter | Type | Notes |
| --- | --- | --- |
| `text` **Required** | string | The text to speak. |
| `voice` | string | A voice id from `get_settings` (`voices` section), e.g. `Brian`. |
| `volume` | number | 0-100. **Windows only.** |

Speaks through Lumia's TTS engine on your machine. See the [TTS docs](/docs/tts) for voices and queue behavior.

### `shoutout`

| Parameter | Type | Notes |
| --- | --- | --- |
| `username` **Required** | string | The user to shout out. |
| `platform` | `twitch` \| `youtube` \| `kick` | The platform they're on. |

Finds a clip of them if possible, shows it on your overlays, and posts a shoutout in chat.

### `translate_message`

| Parameter | Type | Notes |
| --- | --- | --- |
| `message` **Required** | string | The message to translate. |
| `language` **Required** | string | Target language code, e.g. `en`, `es`, `fr`. |
| `platform` | `twitch` \| `youtube` \| `facebook` | Where to post it. |
| `username` | string | Attribute the message to this user. |

### `moderate_user`

| Parameter | Type | Notes |
| --- | --- | --- |
| `action` **Required** | `ban` \| `unban` \| `timeout` \| `vip` \| `unvip` | Ban/unban/timeout work on Twitch and YouTube. VIP is Twitch only. |
| `username` **Required** | string | The target user. |
| `platform` | `twitch` \| `youtube` | Platform. |
| `duration_seconds` | integer | For `timeout`. 600 is 10 minutes. Defaults to 10. |
| `reason` | string | For `timeout`: the reason shown to the user. |

### `delete_message`

| Parameter | Type | Notes |
| --- | --- | --- |
| `message_id` **Required** | string | The id of the message to delete. |
| `platform` | `twitch` \| `youtube` | Platform. |

### `clear_chat`

Clears the entire Twitch chat for all viewers. Takes no parameters, and **cannot be undone**.

### `pin_message`

| Parameter | Type | Notes |
| --- | --- | --- |
| `action` **Required** | `pin` \| `unpin` | Pin or unpin. |
| `message_id` | string | Required for `pin`. Omit on `unpin` to unpin whatever is currently pinned. |

### `manage_moderator`

| Parameter | Type | Notes |
| --- | --- | --- |
| `action` **Required** | `add` \| `remove` | Grant or revoke. |
| `username` **Required** | string | The target user. |

Twitch only.

## Stream management

Most of this group is Twitch-only and requires the channel to be live.

### `set_stream_info`

| Parameter | Type | Notes |
| --- | --- | --- |
| `title` | string | The new stream title. |
| `category` | string | The new category, e.g. `Just Chatting`. Matched by name search on the platform. |
| `platform` | `twitch` \| `kick` | YouTube is not supported by this tool. |

Provide `title`, `category`, or both.

### `create_clip`

Clips the last moments of the live stream. Takes no parameters. The result lands in the `twitch_last_clip_id` and `twitch_last_clip_url` variables — read them with `get_variable` afterwards. Twitch only, while live.

### `create_stream_marker`

| Parameter | Type | Notes |
| --- | --- | --- |
| `description` | string | Optional marker label, e.g. `funny moment`. |

Marks the current broadcast moment for the Twitch Highlighter. Twitch only, while live.

### `send_announcement`

| Parameter | Type | Notes |
| --- | --- | --- |
| `message` **Required** | string | The announcement text. |

Posts a highlighted announcement to Twitch chat.

### `run_commercial`

| Parameter | Type | Notes |
| --- | --- | --- |
| `duration` | integer | Ad length in seconds, 30-180. |

Twitch serves an ad as close to the requested length as possible. Twitch only, while live, and it respects the channel's ad cooldown.

### `set_chat_mode`

| Parameter | Type | Notes |
| --- | --- | --- |
| `mode` **Required** | `slow` \| `subscriber` \| `follower` \| `emote` | Which Twitch chat mode to change. |
| `enabled` **Required** | boolean | Turn it on or off. |
| `duration` | integer | Slow mode: seconds between messages (3-120, default 30). Follower mode: minimum follow age in minutes (0-129600, default 0). Ignored otherwise. |

### `create_poll` / `end_poll`

`create_poll`:

| Parameter | Type | Notes |
| --- | --- | --- |
| `title` **Required** | string | The poll question. |
| `choices` **Required** | string[] | 2-5 choices, 25 characters max each. Titles must not contain commas. |
| `duration` | integer | Seconds, 15-1800. |

The poll id lands in `twitch_current_poll_id`.

`end_poll`:

| Parameter | Type | Notes |
| --- | --- | --- |
| `status` | `ARCHIVED` \| `TERMINATED` | `ARCHIVED` ends the poll and hides it. `TERMINATED` ends it early but leaves the result publicly visible. |

`end_poll` only finds polls that Lumia created.

### `create_prediction` / `end_prediction`

`create_prediction`:

| Parameter | Type | Notes |
| --- | --- | --- |
| `title` **Required** | string | The prediction question. |
| `outcomes` **Required** | string[] | 2-10 outcomes, 25 characters max each. Titles must not contain commas. |
| `duration` | integer | Voting window in seconds, 30-1800. |

`end_prediction`:

| Parameter | Type | Notes |
| --- | --- | --- |
| `winning_outcome` | string | The winning outcome title, matched case-insensitively. Required when resolving. |
| `status` | `RESOLVED` \| `CANCELED` | `RESOLVED` pays out. `CANCELED` refunds everyone. |

Only works for predictions Lumia created in the current app session.

### `control_song_request`

| Parameter | Type | Notes |
| --- | --- | --- |
| `action` **Required** | `add` \| `skip` \| `play` \| `pause` \| `remove` \| `clear` | What to do. |
| `query` | string | For `add`: a search query or a Spotify link. |
| `song_request_id` | string | For `remove`: a specific request. Omit to remove the most recent. |
| `username` | string | For `add`: who to attribute the song to. |
| `platform` | string | For `add`: the requester's platform, e.g. `twitch`. |

Plays through your configured source — Spotify or a song-source plugin. `play` and `pause` work where the source supports them.

### `get_loyalty_points` / `loyalty_points`

`get_loyalty_points` reads a balance; `loyalty_points` changes it.

| Parameter | Type | Notes |
| --- | --- | --- |
| `username` **Required** | string | The viewer. |
| `amount` **Required** (`loyalty_points` only) | number | Points to add. Use a negative number to remove. |
| `platform` | `twitch` \| `youtube` \| `facebook` \| `kick` \| `tiktok` | The viewer's platform. |

## Overlays, session, and effects

### `control_overlay`

| Parameter | Type | Notes |
| --- | --- | --- |
| `action` **Required** | `visibility` \| `layer-visibility` \| `layer-position` \| `layer-size` \| `content` | What to change. |
| `target` **Required** | string | Overlay name or uuid for `visibility`; layer id for the layer actions. Both are in Lumia's overlay settings. |
| `visible` | boolean | For `visibility` and `layer-visibility`. |
| `x`, `y` | number | For `layer-position`. |
| `width`, `height` | number | For `layer-size`, in pixels. |
| `content` | string | For `content`: the new value. |

### `set_stream_mode`

| Parameter | Type | Notes |
| --- | --- | --- |
| `mode` **Required** | `on` \| `off` \| `toggle` | Lumia Stream Mode. |

### `control_queue`

| Parameter | Type | Notes |
| --- | --- | --- |
| `action` **Required** | `pause` \| `resume` \| `clear` \| `clear-cooldowns` | Controls the alert/effect queue, or clears all command cooldowns. |

### `control_fuze`

| Parameter | Type | Notes |
| --- | --- | --- |
| `action` **Required** | `start` \| `stop` \| `toggle` \| `sensitivity` | Fuze action. |
| `sensitivity` | number | For `sensitivity`. Below 100 makes it less sensitive. |

## Real-time events

These are what let an assistant react to your stream instead of just controlling it.

### `get_recent_events`

| Parameter | Type | Notes |
| --- | --- | --- |
| `type` | string | Substring match on event type or alert name, e.g. `follow`, `chat`, `sub`, `bits`, `raid`, `donation`. |
| `origin` | string | Filter by platform, e.g. `twitch`. |
| `limit` | number | Max events, most recent last. Defaults to 20. |

### `wait_for_event`

Blocks until the next matching event arrives, then returns it.

| Parameter | Type | Notes |
| --- | --- | --- |
| `type` | string | Only resolve on this event type or alert name. |
| `origin` | string | Only resolve on this platform. |
| `timeout_seconds` | number | Defaults to 30, maximum 300. Returns a `timedOut` result if nothing arrives. |

:::note

Both tools only see events received **after** the MCP server's event stream starts. If nothing is buffered yet, check the returned `status.connected`.

:::

## Prompts

The server also ships ready-made routines. Most clients expose these as slash commands:

| Prompt | What it does |
| --- | --- |
| `start_stream` | Opening sequence: lights, scene, and a chat greeting. |
| `brb` | Switches to a break state. |
| `hype` | Celebration effects. |
| `wind_down` | End-of-stream sequence. |
| `thank_new_followers` | Reads recent follows and thanks them by name. |

## Safety and platform notes

Some tools have public or destructive effects. For production streams, tell your assistant to ask before using anything that posts publicly, moderates users, runs ads, ends polls or predictions, clears chat, or deletes messages.

| Area | What to know |
| --- | --- |
| Public chat and voice | `send_chat_message`, `speak`, `shoutout`, `translate_message`, and `send_announcement` are immediately visible or audible to viewers. |
| Moderation | `moderate_user`, `delete_message`, `clear_chat`, `pin_message`, and `manage_moderator` require the connected account to have permission. |
| Twitch-only, live-only | Clips, stream markers, commercials, polls, and predictions need the Twitch channel to be live. Announcements, chat modes, clear chat, pinned messages, and moderator management also target Twitch. |
| Stream info | `set_stream_info` supports Twitch and Kick. YouTube is not supported. |
| Arbitrary code | `run_actions` rejects `code`, `writeToFile`, `commandRunner`, and `inputEvents`, including inside nested branches. Wrap those in a Lumia command and use `trigger_command`. |
| Chat bot dependency | `send_chat_message` needs the platform connected and the Lumia chat bot enabled. |
| Session-scoped | `end_poll` and `end_prediction` only target polls and predictions Lumia created and can still identify this session. |

## Next steps

- [What you can do](./examples.md): plain-language prompts and the tool calls they produce.
- [Configuration](./configuration.md): environment variables, headers, and remote hosts.
- [Troubleshooting](./troubleshooting.md): when a tool call fails.
