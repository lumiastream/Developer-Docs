---
sidebar_position: 6
---

# Chat Bot

Lumia Stream has a built in Chat Bot for Twitch, Youtube Live, Facebook Live, and Trovo inside of it that developers are free to use however they see fit.

You can trigger the Chat Bot by sending a POST request like this:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to send:

```json
{
  "type": "chatbot-message",
  "params": {
    "value": "Wow, this tutorial is just way too cool",
    "platform": "twitch" // "twitch", "youtube", "facebook", "trovo"
  }
}
```

To send the message as the streamer

```json
{
  "type": "chatbot-message",
  "params": {
    "value": "Here the message to send",
    "platform": "twitch", // "twitch", "youtube", "facebook", "trovo"
    "userToChatAs": "self"
  }
}
```

Platform is required and has the options of being `twitch`, `youtube`, `facebook`, and `trovo`.

The user must be connected to the selected platform as well as having chat bot on in order for this to work.

:::tip

Make sure you replace **your_token** with your actual token

:::
