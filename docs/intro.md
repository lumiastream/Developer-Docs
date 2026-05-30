---
sidebar_position: 1
---

# Lumia Stream Developer Docs

Lumia Stream is a streaming automation platform that connects lights, devices, streaming platforms, games, and tools into a single control surface. These docs cover every surface that's open to developers — from a simple REST call to a full marketplace plugin.

## What you can build

### Trigger anything with the REST API

The [REST API](/docs/rest/clone-the-repo) is the fastest way to control Lumia from an external app, game, or script. One POST to `http://localhost:39231/api/send` can:

- Fire any Lumia command by name
- Push a light color with exact duration, brightness, and transition
- Trigger any alert (follow, sub, donation, raid, etc.)
- Send a TTS message
- Start or stop stream mode
- Update template variables
- Manage loyalty points
- Control overlays, queues, and command folders

The API runs locally on port `39231` (HTTP) or `39232` (HTTPS). Authentication is a single token you generate once in the Lumia settings. See [Get a token](/docs/get-a-token) to get started.

### React to everything with WebSockets

The [WebSocket API](/docs/websockets/clone-the-repo) streams every event Lumia receives in real time. Subscribe once and you get:

- Chat messages from Twitch, YouTube, Kick, Facebook, TikTok
- Chat commands and channel point redeems
- All alert events — follows, subs, donations, cheers, raids, hosts, superchats, charity donations, gift subs, and more
- Stream live / offline transitions
- Custom events your own integrations emit

This is the right surface when you want to build your own alert system, sync external state to stream events, or trigger logic in a game engine or application without polling.

### Display live data with custom overlays

[Custom overlays](/docs/custom-overlays/custom-overlays-documentation) are browser-source widgets you build with HTML, CSS, and JavaScript. The `@lumiastream/lumia-types` package ships a typed `Overlay` class that wires your overlay directly into the Lumia event bus:

```js
Overlay.on('alert', (data) => {
  // data.alert    — alert name, e.g. "twitch-subscriber"
  // data.extraSettings — the full payload for that alert
})
```

Every alert has a documented payload shape in the [Alert Explorer](/docs/alerts/alert-explorer) and the [Alerts](/docs/alerts) reference. Overlays also subscribe to display variables, so labels like "latest sub", "top tipper", and "stream uptime" update automatically without any polling.

Overlays can be wired to chatbot commands via [chat triggers](/docs/overlays/chat-triggers) — viewers type `!kappagen` in chat and your overlay fires an emote burst, no chatbot command configuration needed.

### Write custom logic with JavaScript actions

[Custom JavaScript](/docs/custom-code/what-is-custom-javascript) runs inside Lumia actions — the same action pipeline that fires lights, alerts, TTS, and OBS. You get a sandboxed Node.js-like environment with access to Lumia's helper API:

```js
// Read and write template variables
const deaths = lumia.getVariable('deaths');
lumia.setVariable('deaths', deaths + 1);

// Post to chat
await lumia.sendChat({ message: `Death count: ${deaths + 1}` });

// Trigger an alert
await lumia.triggerAlert({ alert: 'lumiastream-donation', extraSettings: { username: 'test', amount: 10 } });

// Fetch external data
const res = await fetch('https://api.example.com/status');
const json = await res.json();
```

Custom JS is the right tool when you need branching logic, external API calls, or anything that can't be expressed with the template variable system alone.

### Use the template variable system

[Variables](/docs/variables) are the connective tissue of Lumia. Any text field — chatbot messages, alert text, TTS, overlay labels, goal targets — accepts `{{variable}}` placeholders that resolve to live values at render time.

There are two kinds:

- **Display variables** — read live state: `{{total_follower_count}}`, `{{twitch_current_viewer_count}}`, `{{latest_subscriber}}`, `{{spotify_current_song}}`, and [hundreds more](/docs/display-variables).
- **Variable functions** — callable helpers: `{{random=1-100}}`, `{{counter=deaths,+1}}`, `{{read_url=https://api.example.com}}`, `{{math={{counter=deaths}}*2}}`, [and many more](/docs/variable-functions).

Variables work in chatbot responses, TTS, alert text, overlay labels, goals, and custom JavaScript templates.

### Build a full plugin

The [Plugin SDK](/docs/plugin-sdk/overview) lets you ship a complete integration as a `.lumiaplugin` file that users install from the Lumia marketplace with one click. Plugins are Node.js classes that extend `Plugin`:

```js
import { Plugin } from '@lumiastream/plugin';

export default class MyPlugin extends Plugin {
  async onload() {
    // runs when the user enables your plugin
  }

  async actions(config) {
    // handle any action the user configured for your plugin
    const result = await callMyExternalAPI(config.action.value);
    this.lumia.setVariable('my_result', result);
  }
}
```

Plugins can:
- Register as native integrations with their own auth UI and settings fields
- Add custom actions that appear in the Lumia action picker
- Control lights and plugs directly (lights plugins and plug plugins)
- Handle chatbot commands, AI prompts, and moderation actions
- Trigger alerts, play audio, write variables, and display chat
- Share heavy runtimes (OpenCV, Bluetooth adapters, etc.) across plugins
- Surface Studio themes and scene options

Use the CLI to scaffold, validate, and package:

```bash
npx lumia-plugin create my_plugin
npx lumia-plugin validate ./my_plugin
npx lumia-plugin build ./my_plugin --out ./my_plugin.lumiaplugin
```

### Chatbot commands

Lumia ships [60+ default chatbot commands](/docs/chatbot/default-commands) out of the box — `!so`, `!roulette`, `!duel`, `!voteskip`, `!songrequest`, and more. You can add, edit, and delete commands from chat using [mod management](/docs/chatbot/mod-management) (`!addcom`, `!editcom`, `!delcom`), or programmatically from any template using variable functions:

```text
{{add_chatbot_command=mycommand,Hello from a variable function!}}
```

Every command response is a template string with full variable and function support.

## Ports and authentication

| Surface | Port |
| --- | --- |
| REST API (HTTP) | `39231` |
| REST API (HTTPS) | `39232` |
| WebSocket / Overlays (HTTP) | `39222` |
| WebSocket / Overlays (HTTPS) | `39223` |

All REST and WebSocket connections authenticate with a token. Generate yours in Lumia Stream → Settings → API, or follow the [Get a token](/docs/get-a-token) guide.

## Where to start

| Goal | Start here |
| --- | --- |
| Trigger Lumia from a game or external app | [REST API](/docs/rest/clone-the-repo) |
| React to stream events in real time | [WebSockets](/docs/websockets/clone-the-repo) |
| Build a browser-source overlay | [Custom Overlays](/docs/custom-overlays/custom-overlays-documentation) |
| Add scripting logic to an action | [Custom JavaScript](/docs/custom-code/what-is-custom-javascript) |
| Use or look up a template variable | [Variables](/docs/variables) |
| Browse every alert payload | [Alert Explorer](/docs/alerts/alert-explorer) |
| Build and publish a plugin | [Plugin SDK](/docs/plugin-sdk/overview) |
| See common patterns quickly | [Cheatsheet](/docs/cheatsheet) |

## Getting help

Join the [community Discord](https://discord.gg/R8rCaKb) to ask questions, share what you're building, or get feedback on a plugin before you publish. Follow [@lumiastream](https://twitter.com/lumiastream) for announcements.
