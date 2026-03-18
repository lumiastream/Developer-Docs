---
sidebar_position: 2
---

# Getting Started with Lumia Stream Plugin SDK

This guide walks you through creating your first Lumia Stream plugin from scratch using the SDK.

## Prerequisites

- Node.js 18 or newer
- Basic understanding of JavaScript
- The Lumia Stream desktop app for local testing

> **Runtime constraint:** Lumia plugins run in a Node.js process, not a browser. Avoid browser globals (`window`, `document`, `localStorage`, `XMLHttpRequest`) and browser-only packages — see [What Does Not Work](#what-does-not-work-browser-apis) below for details.

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

### Polling + Fetch Safety (Important)

If your plugin polls APIs, do not run raw unbounded `fetch` calls inside that loop.

- Wrap every polling-path request in a timeout.
- Keep one in-flight refresh lock, but always clear it in `finally`.
- Add stale-lock recovery so one hung request cannot block polling forever.

Example:

```js
if (this._refreshPromise) {
  const elapsed = Date.now() - this._refreshStartedAt;
  if (elapsed < 60000) return this._refreshPromise;
  this._refreshPromise = null; // stale lock recovery
}

this._refreshStartedAt = Date.now();
this._refreshPromise = (async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  } finally {
    this._refreshPromise = null;
    this._refreshStartedAt = 0;
  }
})();
```

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

## Lights And Plugs Plugin Hooks (Optional)

If your plugin is a lights integration, implement these runtime hooks as needed:

- `searchLights()` to discover devices for auth UI selection
- `addLight(data)` for manual add flows
- `onLightChange(config)` to apply color/brightness/power updates
- `searchThemes()` to expose Studio theme options (scenes/effects/presets)
- `searchPlugs()` to discover plugs/accessories for auth UI selection
- `addPlug(data)` for manual plug add flows
- `onPlugChange(config)` to apply plug on/off updates

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
    dynamic: { value: "Viewer123" },
    extraSettings: { username: "Viewer123" },
});
```

`dynamic` is variation-only:

- Use `value` (string | number | boolean) for standard comparisons.
- For specialized comparisons, pass direct dynamic fields such as `giftAmount`, `subMonths`, `currency`, and `isGift`.
- Plugin-triggered alerts do not accept `dynamic.name`; it is stripped by the plugin runtime.
- Variation matching reads `dynamic`; `extraSettings` does not satisfy variation conditions.

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

Guideline: leave `showInEventList` off for most plugins. Turn it on mainly for platform/event-source plugins where stream events are expected in Event List.

### Chat Messages

```js
this.lumia.displayChat({
    username: "Viewer123",
    displayname: "Viewer123",
    message: "Hello from the plugin!",
    avatar: "https://example.com/avatar.png",
    userLevels: {
        mod: true,
        follower: true,
    },
    emotesRaw: JSON.stringify([
        { id: "wave", url: "https://example.com/emotes/wave.webp", start: 6, end: 9 },
    ]),
    skipCommandProcessing: false,
});
```

`displayChat` posts a message to Lumia Stream chatboxes and overlay chat widgets.

For emotes, use `emotesRaw` with the common plugin JSON format:

- `[{ id?: string, url?: string, urls?: string[], start: number, end: number }]`
- or `{ emotes: [...] }`

`start`/`end` are inclusive character offsets in `message`.
Use top-level `skipCommandProcessing` to show a message in chat without triggering commands.

If your plugin should appear as an AI provider in Lumia (similar to ChatGPT/DeepSeek), declare AI support in `manifest.json`:

```json
{
	"config": {
		"hasAI": true
	}
}
```

Implement runtime handlers:

```js
async aiPrompt(config) {
	// config.message, config.model, config.thread, config.username, ...
	return "AI response text";
}

async aiModels() {
	// Return strings or { value, name } objects
	return [{ value: "gpt-oss:20b", name: "gpt-oss:20b" }];
}
```

If your plugin should appear as a selectable chatbot platform in Lumia commands, declare chatbot support in `manifest.json`:

```json
{
	"config": {
		"hasChatbot": true
	}
}
```

You can also implement a native runtime handler:

```js
async chatbot(config) {
	// config.message, config.userToChatAs, config.color, etc.
	return true;
}
```

For Dashboard/API moderation actions, declare supported commands and implement a handler:

```json
{
	"config": {
		"modcommandOptions": ["delete", "ban", "timeout"]
	}
}
```

```js
async modCommand(type, value) {
	// type: "delete" | "ban" | ...
	// value: { username, message, reason, duration, ... }
	return true;
}
```

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

## When To Use A Custom Overlay

If your feature needs on-screen visuals (animated cards, HUD widgets, chat visualizers, stream panels), pair the plugin with a Custom Overlay:

- Keep API calls, normalization, and business logic in the plugin.
- Keep visual rendering and animation in the overlay.

Recommended plugin->overlay bridge:

1. Write global variables from the plugin with `this.lumia.setVariable("key", value)`.
2. Trigger alerts from the plugin with `this.lumia.triggerAlert(...)`.
3. In the overlay, read variables with `Overlay.getVariable("key")` and alert payloads in `Overlay.on("alert", (data) => data.extraSettings)`.

Use `extraSettings` for overlay payload values. Use `dynamic` only when you need alert variation matching.

Keep global variables focused on durable state. Avoid writing request/action-specific data as globals; pass action outputs via `acceptedVariables` / `newlyPassedVariables` and alert payloads via `extraSettings` so plugin variables do not become overloaded.

Overlay docs: https://dev.lumiastream.com/docs/custom-overlays/custom-overlays-documentation  
Overlay assistant: https://chatgpt.com/g/g-6760d2a59b048191b17812250884971b-lumia-custom-overlays-assistant

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

Connection reliability checklist for polling/integration plugins:

- Implement an explicit `disconnect()` flow that clears intervals/timeouts, closes sockets, and calls `await this.lumia.updateConnection(false)`.
- Retry with capped exponential backoff (for example `1s -> 2s -> 4s -> 8s -> 16s`) and stop after a small fixed retry budget (typically 3-5 attempts).
- When retries are exhausted, keep the plugin marked as disconnected and stop polling.
- Resume only on an explicit reconnect trigger (plugin load, relevant settings change, or a manual connect action).
- Do not run continuous polling loops while disconnected unless the upstream integration explicitly requires it and the poll rate is safely bounded.

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

## AI / IDE Skills Support (Optional)

Use the built-in skill files if you develop plugins with Claude Code, GitHub Copilot, Gemini CLI, Cursor, or Codex Desktop. Skills give your AI assistant full context about the Lumia Plugin SDK so it can validate, build, and debug plugins without manual prompting.

### Easy Install (Recommended)

Install all supported skills (Claude + Copilot + Gemini + Cursor + Codex):

```bash
npx lumia-plugin skills --target /path/to/your-plugin
```

Install one specific tool:

```bash
npx lumia-plugin skills claude --target /path/to/your-plugin
npx lumia-plugin skills copilot --target /path/to/your-plugin
npx lumia-plugin skills gemini --target /path/to/your-plugin
npx lumia-plugin skills cursor --target /path/to/your-plugin
npx lumia-plugin skills codex
```

Optional Codex home override:

```bash
npx lumia-plugin skills codex --codex-home "$CODEX_HOME"
```

List available skill bundles:

```bash
npx lumia-plugin skills list
```

### Codex Desktop: Enable And Use

Codex skill files install to `$CODEX_HOME/skills` (or `~/.codex/skills` when `CODEX_HOME` is not set).

1. Install Codex skill files:
```bash
npx lumia-plugin skills codex
```
2. Restart Codex Desktop (or open a new thread).
3. Invoke the skill in your prompt:
```text
$lumia-plugin-codex-skill
```
4. Example:
```text
Use $lumia-plugin-codex-skill to validate my plugin manifest and hooks before packaging.
```

### Updating Later (No Full Redownload)

Run the same command again to update to latest skill files:

```bash
npx lumia-plugin skills --target /path/to/your-plugin
```

Tool-specific updates:

```bash
npx lumia-plugin skills --tools claude,copilot,gemini,cursor --target /path/to/your-plugin
npx lumia-plugin skills codex
npx lumia-plugin skills codex --codex-home "$CODEX_HOME"
```
