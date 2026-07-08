---
sidebar_position: 6
description: Real things you can do with the Lumia Stream MCP server. Control lights, trigger commands and alerts, speak on stream, and drive overlays, all in plain language.
---

# Use Cases & Examples

Once the [MCP server is connected](./setup.mdx), you talk to your AI assistant in plain language and it drives Lumia Stream for you. It reads your setup with `get_settings`, then calls the right tool.

Every setup is different, so the assistant checks what you actually have before acting; the command and scene names below are just illustrations.

For anything public or destructive, tell your assistant to ask before it acts. That includes chat posts, TTS, moderation, commercials, polls, predictions, and clearing chat.

## Control your lights

> "Set my lights to a warm sunset."

> "Flash bright red for three seconds, then go back to normal."

> "Dim everything to 20% and make it a cool white."

> "My team is purple and gold. Set my lights to match."

The assistant chooses the color, brightness, transition, and duration and calls `set_color`. It can use a hex value, RGB, or a color temperature.

## Trigger your commands and alerts

> "What can you control on my stream?": lists your commands, alerts, scenes, and lights (`get_settings`).

> "Run my police command.": `trigger_command`

> "Test my follower alert.": `trigger_alert` with `twitch-follower`

> "Simulate a 1,000-bit cheer from Ahad so I can check my overlay.": `trigger_alert` with `twitch-bits` and extra data.

Because it reads your setup first, you can refer to things by description ("run the blue one," "play my raid animation") and it maps that to the real command name.

## Speak on stream

> "Announce that I'll be right back in five minutes."

> "Read this out in Brian's voice: thanks for the raid!"

`speak` sends the text through Lumia's built-in TTS engine on your machine, optionally with a specific voice from your settings.

## Drive overlays with variables

Custom variables are how overlays, commands, and custom code share state. Your assistant can read and write them:

> "Set my death counter to 5.": `set_variable`

> "How many deaths am I on?": `get_variable`

> "Add one to my giveaway entries.": reads the value, increments it, writes it back.

Any overlay bound to that variable updates live.

## Create commands on the fly

Chatbot commands are unlimited on every plan, and the assistant can manage them for you mid-stream:

> "Make a !socials command that links my Twitter and TikTok.": `manage_chatbot_command` creates it, live in chat within a second.

> "Update !socials to add my Discord too.": updates just the reply text.

> "Chat keeps asking about my keyboard. Make a command for it with a 30 second cooldown."

> "Delete the !socials command.": built-in system commands are protected; your own are fair game.

It can also flip anything on or off by kind — "disable my channel-point reward called blue" uses `set_command_state`, which pauses the actual reward on Twitch too.

## Talk to chat and moderate

> "Post in my chat: thanks for the raid, everyone!": `send_chat_message` (as the bot, or as yourself).

> "Shout out RaiderName.": `shoutout`

> "Time out spammer123 for 10 minutes for posting links.": `moderate_user` (also ban/unban/VIP), plus `delete_message` to remove a single message.

> "Someone asked a question in Spanish. Translate my answer to Spanish and post it.": `translate_message`

## React in real time

The server keeps a live feed of your stream (chat, commands, follows, subs, bits, raids, donations, even heart rate) so the assistant can respond to what just happened:

> "Did anyone follow in the last few minutes? Thank them by name.": `get_recent_events`

> "Watch for the next follower, greet them, then stop.": `wait_for_event`

> "What's my stream status right now?": `get_state` (live status, viewers, followers, now-playing, heart rate).

This is what turns the assistant from a remote control into a co-host: it can see the moment a raid lands and celebrate it without you lifting a finger.

## Chain it into routines

The real power is combining tools in a single request:

> "I just died. Flash my lights red and bump my death counter."

The assistant runs `set_color` and `set_variable` together.

> "Kick off my intro: warm lights, welcome the chat by voice, and run my intro command."

That becomes `set_color` + `speak` + `trigger_command`, in order.

## Concrete tool-call examples

Most clients show tool calls in their own UI. These examples show the inputs the assistant should choose after it has checked your setup.

### Find and run a command

**You:** "What commands do I have that are good for a raid?"

The assistant discovers command names:

```json
{
	"tool": "get_settings",
	"arguments": {
		"section": "commands"
	}
}
```

Then it can run the exact command name you choose:

```json
{
	"tool": "trigger_command",
	"arguments": {
		"name": "raid-hype",
		"kind": "chat-command",
		"extraSettings": {
			"username": "RaiderName"
		}
	}
}
```

### Test an alert with data

**You:** "Simulate a 1,000-bit cheer from Ahad."

```json
{
	"tool": "trigger_alert",
	"arguments": {
		"name": "twitch-bits",
		"extraSettings": {
			"username": "Ahad",
			"bits": 1000
		}
	}
}
```

### Flash lights and update a counter

**You:** "I just died. Flash red and add one to my death counter."

```json
{
	"tool": "set_color",
	"arguments": {
		"hex": "#ff0000",
		"brightness": 100,
		"duration": 3000,
		"transition": 150
	}
}
```

The assistant reads the current value, adds one, then writes it back:

```json
{
	"tool": "get_variable",
	"arguments": {
		"name": "death_count"
	}
}
```

```json
{
	"tool": "set_variable",
	"arguments": {
		"name": "death_count",
		"value": 6
	}
}
```

### Create a temporary chatbot command

**You:** "Make a !keyboard command with a 30 second cooldown."

```json
{
	"tool": "manage_chatbot_command",
	"arguments": {
		"action": "create",
		"name": "keyboard",
		"message": "I'm using a custom mechanical keyboard today.",
		"cooldown_seconds": 30,
		"enabled": true
	}
}
```

### Wait for the next follower

**You:** "Watch for the next Twitch follow and then thank them in chat."

```json
{
	"tool": "wait_for_event",
	"arguments": {
		"type": "follow",
		"origin": "twitch",
		"timeout_seconds": 300
	}
}
```

If an event arrives, the assistant can use the returned name in a chat message:

```json
{
	"tool": "send_chat_message",
	"arguments": {
		"platform": "twitch",
		"message": "Thanks for the follow, NewFollower!"
	}
}
```

## A worked example

**You:** "It's raid o'clock. What do I have to celebrate with?"

**Assistant:** calls `get_settings`, then replies with your raid-related commands, alerts, and studio scenes.

**You:** "Perfect. When the raid lands, flash gold, shout it out with TTS, and set my hype scene."

**Assistant:** on your go, runs `set_color` (gold), `speak` ("Raiders incoming!"), and `trigger_command` for your hype scene: one instruction, three coordinated actions.

## Tips

- **Ask what's available first.** "What commands and scenes do I have?" grounds everything else and avoids guessing names.
- **Refer to things loosely.** The assistant matches "the blue command" or "my hype alert" to the real names from your settings.
- **Confirm risky actions.** Public chat, TTS, moderation, commercials, polls, predictions, and clear-chat actions affect viewers immediately.
- **Keep the app running.** The server talks to Lumia on `localhost`, so Lumia must be open with the API enabled.

## Quick macros

Your client also exposes ready-made routines as prompts (slash-commands in most clients): **start_stream**, **brb**, **hype**, **wind_down**, and **thank_new_followers**. Trigger one and the assistant runs the whole sequence with the tools above. For the full catalog, see [Tools](./tools.md).
