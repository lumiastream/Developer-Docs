---
sidebar_position: 2
---

# Getting Started with Lumia Stream Plugin SDK

This guide walks you through creating your first Lumia Stream plugin from scratch using the SDK.

## Prerequisites

- Node.js 18 or newer
- Basic understanding of JavaScript or TypeScript
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
npm install -D typescript @types/node
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

Create `src/main.ts`:

```ts
import {
	Plugin,
	type PluginManifest,
	type PluginContext,
} from "@lumiastream/plugin";

export default class MyFirstPlugin extends Plugin {
	private interval?: NodeJS.Timeout;

	constructor(manifest: PluginManifest, context: PluginContext) {
		super(manifest, context);
	}

	async onload(): Promise<void> {
		const message = this.settings.message ?? "Hello from my plugin!";

		this.interval = setInterval(() => {
			const timestamp = new Date().toISOString();
			void this.lumia.setVariable("last_update", timestamp);
		}, 10000);
	}

	async onunload(): Promise<void> {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	async actions(config: { actions: any[] }): Promise<void> {
		for (const action of config.actions) {
			if (action.type === "trigger_alert") {
				const params = action?.value ?? action?.data ?? {};
				const username = params?.username ?? "Viewer";
				const message = params?.message ?? this.settings.message ?? "Hello!";

				await this.lumia.triggerAlert({
					alert: "custom-hello",
					dynamic: { username, message },
					extraSettings: { username, message },
				});
			}
		}
	}

	async onsettingsupdate(settings: Record<string, any>): Promise<void> {}
}

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
```

## 4. Build Configuration

Create `tsconfig.json`:

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "CommonJS",
		"outDir": "./dist",
		"rootDir": "./src",
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "dist"]
}
```

Add scripts to `package.json`:

```json
{
	"scripts": {
		"build": "tsc",
		"dev": "tsc --watch"
	}
}
```

## 5. Build and Test

```bash
npm run build
```

The compiled JavaScript will be in the `dist` folder. Your plugin is ready to load in the Lumia Stream app.

## Working with the Lumia API

### Variables

Do not prefix variable names with your plugin name. Lumia already namespaces them.

```ts
// Set a variable
await this.lumia.setVariable("my_variable", "some value");

// Read a variable
const value = await this.lumia.getVariable("my_variable");

// Update a counter variable
const current = Number((await this.lumia.getVariable("counter")) ?? 0);
await this.lumia.setVariable("counter", current + 1);
```

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

```ts
await this.lumia.triggerAlert({
	alert: "follow",
	extraSettings: {
		username: "NewFollower",
		message: "Thanks for following!",
	},
});

await this.lumia.triggerAlert({
	alert: "my-custom-alert",
	dynamic: { name: "username", value: "Viewer123" },
	extraSettings: { username: "Viewer123" },
});
```

When you declare `variationConditions` in your manifest, populate the `dynamic` payload with the fields those conditions expect. Pass the same alert variables through `extraSettings` so templates and variations have the same data. The comparison logic is defined in `LumiaVariationConditions`, so make sure the runtime data lines up with the chosen condition.

If you want a plugin alert to appear in the Event List, opt in explicitly:

```ts
await this.lumia.triggerAlert({
	alert: "my-custom-alert",
	showInEventList: true,
	extraSettings: {
		username: "Viewer123",
	},
});
```

### Chat Messages

```ts
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

```ts
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

```ts
const response = await fetch("https://api.example.com/data");
const data = await response.json();
await this.lumia.setVariable("api_data", JSON.stringify(data));
```

### OAuth 2.0

If your plugin needs OAuth 2.0, contact Lumia Stream on Discord or email dev@lumiastream.com so the server OAuth flow can be enabled for your plugin.

## Common Patterns

### Polling External APIs

```ts
export default class ApiPollingPlugin extends Plugin {
	private pollInterval?: NodeJS.Timeout;
	private offline = false;

	async onload(): Promise<void> {
		const interval = Number(this.settings.pollInterval ?? 30000);
		this.pollInterval = setInterval(() => void this.pollApi(), interval);
	}

	async onunload(): Promise<void> {
		if (this.pollInterval) {
			clearInterval(this.pollInterval);
		}
	}

	private async pollApi(): Promise<void> {
		if (this.offline) return;

		try {
			const data = await fetchWithBackoff("https://api.example.com/status");

			await this.lumia.setVariable("api_status", data.status);
			await this.lumia.setVariable("api_data", JSON.stringify(data));
		} catch (error) {
			this.offline = true;
			await this.lumia.addLog(`API polling failed: ${String(error)}`);
		}
	}
}

async function fetchWithBackoff(url: string) {
	const maxAttempts = 3;
	let delayMs = 1000;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}
			return await response.json();
		} catch (error) {
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

```ts
export default class EventPlugin extends Plugin {
	async onload(): Promise<void> {
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		// Example: Listen for chat events, webhooks, etc.
	}

	async actions(config: { actions: any[] }): Promise<void> {
		for (const action of config.actions) {
			switch (action.type) {
				case "manual_trigger":
					await this.handleManualTrigger(action?.value ?? action?.data ?? {});
					break;
				case "reset_counters":
					await this.resetCounters();
					break;
			}
		}
	}

	private async handleManualTrigger(data: any): Promise<void> {
		await this.lumia.triggerAlert({
			alert: "manual-event",
			extraSettings: { username: data?.username ?? "Unknown" },
		});
	}

	private async resetCounters(): Promise<void> {
		await this.lumia.setVariable("counter", 0);
	}
}
```

## Next Steps

- Review the [API Reference](./api-reference.md) for the full SDK surface area
- Explore the [examples](./examples) for implementation ideas (e.g., `weather`, and the more advanced `rumble` sample)
- Dive into the [manifest guide](./manifest-guide.md) for advanced configuration options
- Join the [Lumia Stream community](https://lumiastream.com/discord) for support and feedback
