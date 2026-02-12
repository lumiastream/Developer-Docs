---
sidebar_position: 2
---

# Getting Started with Lumia Stream Plugin SDK

This guide walks you through creating your first Lumia Stream plugin from scratch using the SDK.

## Prerequisites

- Node.js 18 or newer
- Basic understanding of JavaScript
- The Lumia Stream desktop app for local testing

## SDK CLI Helpers

The repository ships simple helpers so you can bootstrap and package plugins without writing scripts yourself:

- `npx lumia-plugin create my_plugin` scaffolds the showcase template without cloning this repo (requires npm 7+).
- `npx lumia-plugin build ./path/to/plugin` runs the same build pipeline globally (optional `--out`).
- `npx lumia-plugin validate ./path/to/plugin` validates manifests without cloning the repo.

## 1. Project Setup

```bash
mkdir my_first_plugin
cd my_first_plugin
npm init -y
npm install @lumiastream/plugin
```

## 2. Create the Manifest

Create `manifest.json` with your plugin metadata and configuration options:

```json
{
	"id": "my_first_plugin",
	"name": "My First Plugin",
	"version": "1.0.0",
	"author": "Your Name",
	"email": "your.email@example.com",
	"description": "My first Lumia Stream plugin",
	"lumiaVersion": "^9.0.0",
	"category": "utilities",
	"config": {
		"settings": [
			{
				"key": "message",
				"label": "Custom Message",
				"type": "text",
				"defaultValue": "Hello from my plugin!",
				"helperText": "Used as the default message for the sample alert"
			}
		],
		"actions": [
			{
				"type": "trigger_alert",
				"label": "Trigger Alert",
				"description": "Trigger the sample alert",
				"fields": [
					{
						"key": "username",
						"label": "Username",
						"type": "text",
						"defaultValue": "Viewer"
					},
					{
						"key": "message",
						"label": "Message",
						"type": "text",
						"defaultValue": "Hello from my plugin!"
					}
				]
			}
		]
	}
}
```

Avoid test-only actions or settings. Focus on real user workflows.

## 3. Create the Main Plugin File

Create `src/main.js`:

```js
import { Plugin } from "@lumiastream/plugin";

export default class MyFirstPlugin extends Plugin {
	constructor(manifest, context) {
		super(manifest, context);
		this.interval = undefined;
	}

	async onload() {
		this.interval = setInterval(() => {
			const timestamp = new Date().toISOString();
			void this.lumia.setVariable("last_update", timestamp);
		}, 10000);
	}

	async onunload() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	async actions(config) {
		for (const action of config.actions) {
			if (action.type === "trigger_alert") {
				const params = action.value;
				const username =
					typeof params.username === "string" ? params.username : "Viewer";
				const message =
					typeof params.message === "string"
						? params.message
						: typeof this.settings.message === "string"
							? this.settings.message
							: "Hello!";

				await this.lumia.triggerAlert({
					alert: "custom-hello",
					extraSettings: { username, message },
				});
			}
		}
	}

	async onsettingsupdate(settings) {}
}
```

### Module Loading Note

Plugins run in an isolated **Node.js** process (not a browser). Use `require()` for external dependencies in runtime code (for example, `const api = require("some-lib")`). Avoid dynamic `import()` because the plugin runtime does not resolve browser-style module specifiers.

### What Works (Node)

- Node core modules (`fs`, `path`, `crypto`, etc.)
- Most npm packages that target Node
- Global `fetch` (Node 18+), including `AbortController`

### What Does Not Work (Browser APIs)

The runtime does **not** provide a DOM or browser globals. Avoid packages that require:

- `window`, `document`, `navigator`, `localStorage`, `sessionStorage`
- DOM APIs (`HTMLElement`, `CanvasRenderingContext2D`, etc.)
- Browser-only networking like `XMLHttpRequest`
- WebRTC, MediaDevices, or other browser-only APIs

If a package is browser-first, you should use a Node alternative.

### Dependency Packaging

Bundle or ship your dependencies with the plugin. Do **not** assume Lumia Stream provides third-party packages unless explicitly documented.

## 4. Validate and Test

```bash
npx lumia-plugin validate .
```

## Lights Plugin Hooks (Optional)

If your plugin is a lights integration, implement these runtime hooks as needed:

- `searchLights()` to discover devices for auth UI selection
- `addLight(data)` for manual add flows
- `onLightChange(config)` to apply color/brightness/power updates
- `searchThemes()` to expose Studio theme options (scenes/effects/presets)

When Studio themes trigger your plugin, the selected theme value is available in `config.rawConfig.theme` inside `onLightChange`.

## Working with the Lumia API

### Variables

Do not prefix variable names with your plugin name. Lumia already namespaces them.

```js
// Set a variable
await this.lumia.setVariable("my_variable", "some value");
// Read a variable
const value = await this.lumia.getVariable("my_variable");
// Update a counter variable
const current = Number((await this.lumia.getVariable("counter")) ?? 0);
await this.lumia.setVariable("counter", current + 1);
```

### Shared Runtime Resources

When multiple plugins need the same heavy runtime (for example OpenCV), use shared resources so Lumia initializes it once in the plugin host process:

```js
const cv = await this.lumia.acquireShared("opencv.runtime", () => {
    return require("@lumiastream/opencv-runtime");
}, {
    dispose: (runtime) => runtime?.shutdown?.(),
});
// ...use cv...
await this.lumia.releaseShared("opencv.runtime");
```

Notes:

- The first plugin to acquire a key should provide a factory callback.
- Later plugins can call `acquireShared("opencv.runtime")` without a factory.
- Lumia automatically releases leftover references when a plugin unloads.

For Bluetooth plugins using `@abandonware/noble`, use the shared noble helper:

```js
const ble = await this.lumia.acquireSharedNoble();
await ble.waitForPoweredOn(15000);
const unsubscribe = ble.onDiscover((peripheral) => {
    // handle BLE peripheral discovery
});
await ble.startScanning({
    serviceUuids: ["180d"], // optional
    allowDuplicates: false,
});
// ... later
await ble.stopScanning();
unsubscribe();
await this.lumia.releaseSharedNoble();
```

`acquireSharedNoble()` defaults to key `bluetooth.runtime.noble.manager.v1`.

### HTTP Requests and Timeouts

Node 18+ ships with the global `fetch` API and `AbortController`. You can still use a timeout wrapper if preferred:

```js
const timeoutMs = 60000;
const timeoutPromise = new Promise((_, reject) => {
	setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
});

const response = await Promise.race([fetch(url, options), timeoutPromise]);
if (!response || !response.ok) {
	const text = response ? await response.text() : "";
	throw new Error(
		`Request failed (${response?.status ?? "unknown"}): ${text || response?.statusText || "No response"}`,
	);
}
const data = await response.json();
```

Keep timeouts reasonable and avoid aggressive retries.

### Alerts

```js
await this.lumia.triggerAlert({
    alert: "follow",
    extraSettings: {
        username: "NewFollower",
        message: "Thanks for following!",
    },
});
await this.lumia.triggerAlert({
    alert: "my-custom-alert",
    dynamic: { name: "value", value: "Viewer123" },
    extraSettings: { username: "Viewer123" },
});
```

`dynamic` is variation-only and has exactly two keys:

- `name` (string): variation field to compare.
- `value` (string | number | boolean): runtime value for that field.

Use `extraSettings` for everything else. `extraSettings` can contain any keys and is passed through as alert variables.

If the alert does not use `variationConditions`, omit `dynamic` and send only `extraSettings`.

If you want a plugin alert to appear in the Event List, opt in explicitly:

```js
await this.lumia.triggerAlert({
    alert: "my-custom-alert",
    showInEventList: true,
    extraSettings: {
        username: "Viewer123",
    },
});
```

### Chat Messages

```js
this.lumia.displayChat({
    username: "Viewer123",
    displayname: "Viewer123",
    message: "Hello from the plugin!",
    avatar: "https://example.com/avatar.png",
    user: {
        mod: true,
    },
    emotesPack: {
        "12345": { locations: ["6-10"], type: "emote" },
    },
    extraInfo: {
        extraSettings: {
            rawMessage: "Hello from the plugin!",
            emoteParserType: "twitch",
            skipCommandProcessing: false,
        },
    },
});
```

`displayChat` posts a message to Lumia Stream chatboxes and overlay chat widgets.

When your displayed message includes prefixes (e.g., `[channel]`) or formatting, set `extraInfo.extraSettings.rawMessage` so command parsing uses the original text. Use `extraInfo.extraSettings.skipCommandProcessing` to show a message in chat without triggering commands. To force the emote/badge parser for a specific platform, set `extraInfo.extraSettings.emoteParserType`.

### File Operations

```js
const content = await this.lumia.readFile("data.txt");
if (typeof content === "string") {
    await this.lumia.writeFile({
        path: "output.txt",
        message: content.toUpperCase(),
    });
}
```

### Networking

Node.js 18+ ships with the global `fetch` API. Use it directly from your plugin when you need to talk to external services:

```js
const response = await fetch("https://api.example.com/data");
const data = await response.json();
await this.lumia.setVariable("api_data", JSON.stringify(data));
```

### OAuth 2.0

If your plugin needs OAuth 2.0, contact Lumia Stream on Discord or email dev@lumiastream.com so the server OAuth flow can be enabled for your plugin.

## Common Patterns

### Polling External APIs

```js
export default class ApiPollingPlugin extends Plugin {
    pollInterval;
    offline = false;
    async onload() {
        const interval = Number(this.settings.pollInterval ?? 30000);
        this.pollInterval = setInterval(() => void this.pollApi(), interval);
    }
    async onunload() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }
    async pollApi() {
        if (this.offline)
            return;
        try {
            const data = await fetchWithBackoff("https://api.example.com/status");
            await this.lumia.setVariable("api_status", data.status);
            await this.lumia.setVariable("api_data", JSON.stringify(data));
        }
        catch (error) {
            this.offline = true;
            await this.lumia.log(`API polling failed: ${String(error)}`);
        }
    }
}
async function fetchWithBackoff(url) {
    const maxAttempts = 3;
    let delayMs = 1000;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            if (attempt === maxAttempts) {
                throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            delayMs *= 2;
        }
    }
}
```

If repeated failures occur, keep the plugin offline until the next load or a settings update to avoid rapid reconnect loops.

### Event-Based Plugins

```js
import { Plugin } from "@lumiastream/plugin";
export default class EventPlugin extends Plugin {
    async onload() {
        this.setupEventListeners();
    }
    setupEventListeners() {
        // Example: Listen for chat events, webhooks, etc.
    }
    async actions(config) {
        for (const action of config.actions) {
            switch (action.type) {
                case "manual_trigger":
                    await this.handleManualTrigger(action.value);
                    break;
                case "reset_counters":
                    await this.resetCounters();
                    break;
            }
        }
    }
    async handleManualTrigger(data) {
        const username = typeof data.username === "string" ? data.username : "Unknown";
        await this.lumia.triggerAlert({
            alert: "manual-event",
            extraSettings: { username },
        });
    }
    async resetCounters() {
        await this.lumia.setVariable("counter", 0);
    }
}
```

## Next Steps

- Review the [API Reference](./api-reference) for the full SDK surface area
- Explore the [examples](./examples) for implementation ideas (e.g., `weather`, and the more advanced `rumble` sample)
- Dive into the [manifest guide](./manifest-guide) for advanced configuration options
- Join the [Lumia Stream community](https://lumiastream.com/discord) for support and feedback
