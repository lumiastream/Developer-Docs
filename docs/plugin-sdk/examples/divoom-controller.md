---
sidebar_position: 6
title: Divoom Controller Example Plugin
---

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/divoom_controller

A Lumia Stream example plugin that sends commands to Divoom Pixoo devices. The plugin exposes actions that can be wired into Lumia automations so you can change brightness, switch channels, or push scrolling text when events occur.

> The Divoom Local API is undocumented by the vendor. The commands used here follow the behaviours observed on Pixoo 16/64 devices. If you run a different model, double-check the endpoint list in the official mobile app capture or Divoom community documentation.

## Features

- Simple HTTP client that posts to `http://<ip>/post`
- Configurable device address, port, timeout, and default canvas size for text
- High-level actions for brightness, channel switching, and scrolling text
- Escape hatch action for raw JSON when you need more control

## Settings

| Key                 | Description                                                |
| ------------------- | ---------------------------------------------------------- |
| `deviceAddress`     | Required IPv4/hostname of the Pixoo (e.g. `192.168.1.42`). |
| `devicePort`        | API port (default `80`).                                   |
| `requestTimeout`    | Timeout in milliseconds for each request (default `5000`). |
| `defaultTextWidth`  | Canvas width used by scrolling text (default `64`).        |
| `defaultTextHeight` | Canvas height used by scrolling text (default `64`).       |

## Actions

### Set Brightness (`set_brightness`)

Sets the global panel brightness via `Channel/SetBrightness`. Accepts a number between `0` and `100`.

### Switch Channel (`set_channel`)

Routes to one of the channel commands listed below and sends the selected identifier:

| Option            | Command                      | Payload key    |
| ----------------- | ---------------------------- | -------------- |
| Clock             | `Channel/SetClock`           | `ClockId`      |
| Visualizer        | `Channel/SetVisualizer`      | `VisualizerId` |
| Scene             | `Channel/SetScene`           | `SceneId`      |
| Custom Page Index | `Channel/SetCustomPageIndex` | `Index`        |

You can find valid ids by using the official Divoom app and monitoring network traffic or browsing community lists. For example, `ClockId` `46` is a minimal digital clock on Pixoo 64.

### Send Scrolling Text (`send_text`)

Sends a `Draw/SendHttpText` payload. Fields:

- `message` - text to render (required)
- `color` - hex colour (defaults to `#FFFFFF`, converted to an `[r, g, b]` array)
- `scrollSpeed` - 1-100 (maps to `TextSpeed`)
- `direction` - left/right/up/down (converted to `ScrollDirection` 0-3)
- `repeat` - number of loops (1-10)

The plugin also injects `TextWidth`, `TextHeight`, `TextAlign`, and `TextFont` from settings so you can tailor the marquee to your Pixoo resolution.

### Send Raw Command (`send_raw_command`)

Allows power users to send any payload that the local API understands. The `command` field is merged into the `Command` property, and the JSON payload is merged into the root body. Example:

```json
{
	"command": "Device/SetRTC",
	"payload": "{ \"RtcHour\": 12, \"RtcMin\": 34, \"RtcSec\": 56 }"
}
```

## Testing

1. Set the plugin settings inside Lumia Stream (IP/port/timeout).
2. Trigger an action manually from the Lumia UI to confirm connectivity.
3. For debugging, open the Lumia Stream log panel to view the messages emitted by the plugin.

If a command fails (HTTP errors, timeouts, invalid JSON), the plugin logs the reason so you can adjust the payload and try again.

## Packaging

```
npm install
npx lumia-plugin build ./examples/divoom_controller --out ./divoom_controller-1.0.0.lumiaplugin
```

You can then load the generated `.lumiaplugin` file in the Lumia Stream desktop app.
