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
				"helperText": "This message is logged when the plugin loads"
			}
		],
		"actions": [
			{
				"type": "say_hello",
				"label": "Say Hello",
				"description": "Logs a hello message",
				"fields": [
					{
						"key": "name",
						"label": "Name",
						"type": "text",
						"defaultValue": "World"
					}
				]
			}
		]
	}
}
```

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
		await this.lumia.addLog(`Plugin loaded: ${message}`);

		this.interval = setInterval(() => {
			const timestamp = new Date().toISOString();
			void this.lumia.setVariable("last_update", timestamp);
		}, 10000);
	}

	async onunload(): Promise<void> {
		if (this.interval) {
			clearInterval(this.interval);
		}
		await this.lumia.addLog("Plugin unloaded");
	}

	async actions(config: { actions: any[] }): Promise<void> {
		for (const action of config.actions) {
			if (action.type === "say_hello") {
				const name = action.data?.name ?? "World";
				await this.lumia.addLog(`Hello, ${name}!`);

				await this.lumia.triggerAlert({
					alert: "custom-hello",
					extraSettings: {
						username: name,
						message: `Hello from ${this.manifest.name}!`,
					},
				});
			}
		}
	}

	async onsettingsupdate(settings: Record<string, any>): Promise<void> {
		await this.lumia.addLog(`Settings updated: ${JSON.stringify(settings)}`);
	}
}
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

```ts
// Set a variable
await this.lumia.setVariable("my_variable", "some value");

// Read a variable
const value = this.lumia.getVariable("my_variable");

// Update a counter variable
const current = Number(this.lumia.getVariable("counter") ?? 0);
await this.lumia.setVariable("counter", current + 1);
```

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
});
```

When you declare `variationConditions` in your manifest, populate the `dynamic` payload with the fields those conditions expect—for example `value` (for tier/number checks), `currency`, `giftAmount`, or `subMonths`. The comparison logic is defined in `LumiaVariationConditions`, so make sure the runtime data lines up with the chosen condition.

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
});
```

`displayChat` posts a message to Lumia Stream chatboxes and overlay chat widgets.

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

## Common Patterns

### Polling External APIs

```ts
export default class ApiPollingPlugin extends Plugin {
	private pollInterval?: NodeJS.Timeout;

	async onload(): Promise<void> {
		const interval = Number(this.settings.pollInterval ?? 30000);
		this.pollInterval = setInterval(() => {
			void this.pollApi();
		}, interval);
	}

	async onunload(): Promise<void> {
		if (this.pollInterval) {
			clearInterval(this.pollInterval);
		}
	}

	private async pollApi(): Promise<void> {
		try {
			const response = await fetch("https://api.example.com/status");
			const data = await response.json();

			await this.lumia.setVariable("api_status", data.status);
			await this.lumia.setVariable("api_data", JSON.stringify(data));
		} catch (error) {
			await this.lumia.addLog(`API polling failed: ${String(error)}`);
		}
	}
}
```

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
					await this.handleManualTrigger(action.data);
					break;
				case "reset_counters":
					await this.resetCounters();
					break;
			}
		}
	}

	private async handleManualTrigger(data: any): Promise<void> {
		await this.lumia.addLog("Manual trigger executed");
		await this.lumia.triggerAlert({
			alert: "manual-event",
			extraSettings: { username: data?.username ?? "Unknown" },
		});
	}

	private async resetCounters(): Promise<void> {
		await this.lumia.setVariable("counter", 0);
		await this.lumia.addLog("Counters reset");
	}
}
```

## Next Steps

- Review the [API Reference](./api-reference.md) for the full SDK surface area
- Explore the [examples](../examples/) for implementation ideas (e.g., `weather`, and the more advanced `rumble` sample)
- Dive into the [manifest guide](./manifest-guide.md) for advanced configuration options
- Join the [Lumia Stream community](https://lumiastream.com/discord) for support and feedback
