---
sidebar_position: 4
description: Lumia Stream MCP tool reference, grouped by capability with safety and platform notes.
---

# Tools

Every streamer's setup is different. Assistants should call `get_settings` before triggering commands, alerts, studio scenes, voices, or lights by name.

The embedded HTTP endpoint and the `@lumiastream/mcp` stdio package expose the same tool set when they are on the same version.

## Discover and read state

- `get_settings`: discover command names, alerts, connected lights, studio scenes/themes/animations, and TTS voices. Pass a section such as `commands`, `alerts`, `lights`, or `voices` for full lists.
- `get_state`: current streamer name, live status, now-playing song, heart rate, cross-platform totals, and per-platform followers, subscribers, viewers, latest names, and live indicators.
- `get_variable`: read one Lumia variable.
- `get_variables`: read several Lumia variables at once.
- `set_variable`: create or update a custom variable that overlays, commands, and custom code can read.
- `set_counter`: set a numeric counter variable to an exact value.

The `lumia://settings` resource mirrors `get_settings` for clients that can read MCP resources.

## Lights and studio

- `set_color`: set light color by hex, RGB, or color temperature, with optional brightness, transition, duration, and hold.
- `set_studio`: trigger a Lumia Studio scene, theme, or animation by name.
- `set_lumia_state`: start, stop, or toggle Lumia light control, or reset lights to default.

## Commands and alerts

- `trigger_command`: run a configured chat command, chatbot command, Twitch channel-points reward, or Twitch extension command by name.
- `trigger_alert`: simulate a platform alert such as `twitch-follower`, `twitch-bits`, `youtube-superchat`, or `kofi-donation`.
- `manage_chatbot_command`: create, update, or delete a chatbot command. Chatbot commands are unlimited on every plan.
- `set_command_state`: enable or disable a command or folder. Platform reward state syncs where Lumia supports it.

## Chat, voice, and moderation

- `send_chat_message`: post to live chat as the bot or as the streamer.
- `speak`: speak text through Lumia's TTS engine. Optional volume control is Windows-only.
- `shoutout`: show a clip if possible and post a shoutout in chat.
- `translate_message`: translate a message and post it to chat.
- `moderate_user`: ban, unban, timeout, grant VIP, or remove VIP.
- `delete_message`: delete a chat message by id.
- `clear_chat`: clear Twitch chat for everyone.
- `pin_message`: pin or unpin a Twitch chat message.
- `manage_moderator`: grant or revoke a Twitch moderator role.

## Stream management

- `set_stream_info`: change title and/or category on Twitch or Kick.
- `create_clip`: create a Twitch clip. Lumia stores the result in `twitch_last_clip_id` and `twitch_last_clip_url`.
- `create_stream_marker`: mark the current Twitch broadcast moment.
- `send_announcement`: post a highlighted Twitch chat announcement.
- `run_commercial`: run a Twitch ad break between 30 and 180 seconds.
- `set_chat_mode`: turn Twitch slow, subscriber-only, follower-only, or emote-only mode on or off.
- `create_poll` / `end_poll`: start or end a Twitch poll created through Lumia.
- `create_prediction` / `end_prediction`: start, resolve, or cancel a Twitch channel-points prediction created through Lumia.
- `control_song_request`: add, skip, play, pause, remove, or clear song requests.
- `get_loyalty_points`: read a viewer's loyalty points balance.
- `loyalty_points`: add or remove loyalty points for a viewer.

## Overlays, session, and effects

- `control_overlay`: show/hide overlays and layers, move or resize layers, or set layer content.
- `set_stream_mode`: turn Lumia Stream Mode on, off, or toggle it.
- `control_queue`: pause, resume, or clear the alert/effect queue, or clear command cooldowns.
- `control_fuze`: start, stop, or toggle Fuze, or set audio sensitivity.

## Real-time events

- `get_recent_events`: return buffered live events since the MCP server started. It can filter by event type or origin.
- `wait_for_event`: wait for the next matching event, then return it or time out.

Real-time tools only see events received after the MCP server's event stream starts. If nothing is buffered yet, check the returned `status.connected`.

## Prompts

The server also ships ready-made prompts. Most clients expose these as slash commands:

- `start_stream`
- `brb`
- `hype`
- `wind_down`
- `thank_new_followers`

## Safety and platform notes

Some tools have public or destructive effects. For production streams, tell your assistant to ask before using tools that post publicly, moderate users, run ads, end polls or predictions, clear chat, or delete messages.

| Area | Notes |
| --- | --- |
| Public chat and voice | `send_chat_message`, `speak`, `shoutout`, `translate_message`, and `send_announcement` are visible or audible to viewers. |
| Moderation | `moderate_user`, `delete_message`, `clear_chat`, `pin_message`, and `manage_moderator` require the connected platform account to have permission. |
| Twitch-only live actions | Clips, stream markers, commercials, polls, and predictions are Twitch-only and require the channel to be live. Announcements, chat modes, clear chat, pinned messages, and moderator management also target Twitch. |
| Twitch/Kick stream info | `set_stream_info` supports Twitch and Kick; YouTube stream info is not supported by this tool. |
| Chat bot dependency | `send_chat_message` requires the platform to be connected and the Lumia chat bot to be enabled. |
| Session-scoped items | `end_poll` and `end_prediction` target polls/predictions that Lumia created and can still identify in the current session. |
