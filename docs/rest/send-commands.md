---
sidebar_position: 4
---

# Sending Commands

In Lumia Stream a command is considered a Chat command, a Twitch Points command, a Twitch Extension command, and a Trovo Spell command.

Sending a command is the easiest thing you can do in our API because it doesn't take in any extra parameter other than the ability to set it as your default.

To send a command you will just send a POST request to:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to send:

```json
{
  "type": "chat-command",
  "params": {
    "value": "blue"
  }
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::

The users commands may vary so you will want to retrieve their settings first as mentioned in the last tutorial **[Getting Settings](./get-settings.md)** to make sure you're triggering the correct command.

The valid types for sending a command are:

- chat-command
- chatbot-command
- twitch-points
- twitch-extension
- trovo-spells

e.g. trigger the chatbot command **uptime**

```json
{
  "type": "chatbot-command",
  "params": {
    "value": "uptime"
  }
}
```

---

## Setting Default State

You will also have the ability to set that command as your new default by adding the parameter hold inside the post request:

```json
{
  "type": "chat-command",
  "params": {
    "value": "blue",
    "hold": true
  }
}
```

---

## Extra Settings

Certain commands normally take in extra variables to determine the TTS, as well as what the Chat Bot will say. You can pass in Extra Settings by adding it to params in the POST request JSON:

```json
{
  "type": "chat-command",
  "params": {
    "value": "blue",
    "extraSettings": {
      "username": "lumia",
      "customVariable": "custom value"
    }
  }
}
```

Local variables, such as {{username}}, can be used within commands like a TTS message, e.g., "{{username}} used {{command}}".

By passing extraSettings, you can modify the value of {{username}} or introduce new variables like {{customVariable}}.

Simply provide the desired values in extraSettings to set or update these variables.
