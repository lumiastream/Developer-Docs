---
title: Overview
sidebar_position: 1
---

# Lumia Stream Plugin SDK

Official TypeScript/JavaScript SDK for developing plugins for [Lumia Stream](https://lumiastream.com).

![Lumia Stream Plugin](./lumiaplugin-banner.png)

## GitHub

Source, releases, and issues live here:

https://github.com/lumiastream/Plugin-SDK

## Installation

```bash
npm install @lumiastream/plugin
```

## Usage

```ts
import {
	Plugin,
	type PluginManifest,
	type PluginContext,
} from "@lumiastream/plugin";

export default class MyPlugin extends Plugin {
	constructor(manifest: PluginManifest, context: PluginContext) {
		super(manifest, context);
	}

	async onload(): Promise<void> {
		this.lumia.addLog("Plugin loaded successfully!");
	}

	async onunload(): Promise<void> {
		this.lumia.addLog("Plugin unloaded");
	}
}
```

## Plugin Manifest

Every plugin requires a `manifest.json` file that describes your plugin, its metadata, and configuration:

```json
{
	"id": "my_awesome_plugin",
	"name": "My Awesome Plugin",
	"version": "1.0.0",
	"author": "Your Name",
	"description": "A brief description of what your plugin does",
	"lumiaVersion": "^9.0.0",
	"category": "utilities",
	"config": {
		"settings": [
			{
				"key": "apiKey",
				"label": "API Key",
				"type": "text",
				"required": true
			}
		]
	}
}
```

## Lifecycle Hooks

- `onload()` - invoked when the plugin is enabled inside Lumia Stream.
- `onunload()` - called when your plugin is disabled or unloaded.
- `onupdate(oldVersion, newVersion)` - triggered after version upgrades.
- `onsettingsupdate(settings, previousSettings)` - called whenever settings change.
- `actions(config)` - handle custom actions invoked from Lumia automations.

## Lumia API Highlights

Interact with Lumia Stream using the strongly typed `ILumiaAPI` helper on the plugin context:

```ts
await this.lumia.triggerAlert({
	alert: "follow",
	extraSettings: { username: "StreamerFan" },
});
await this.lumia.playAudio({ path: "alert.mp3", volume: 0.7 });
this.lumia.setVariable("follower_count", 1337);
```

See the [API reference](./api-reference.md) for the full surface area.

## Scripts

- `npm run build` - compile the SDK to the `dist` folder.
- `npm run lint` - type-check the source without emitting output.

## CLI Helpers

The CLI is distributed separately via `lumia-plugin`. Use it with `npx` (requires npm 7+).

- `npx lumia-plugin create my_plugin` scaffold a feature-rich sample plugin showing logging, variables, and alerts
- `npx lumia-plugin validate ./path/to/plugin` check `manifest.json`, entry files, and config for common mistakes
- `npx lumia-plugin build ./path/to/plugin --out ./plugin.lumiaplugin` bundle the directory into a distributable archive

## Documentation

- [Getting Started](./getting-started.md)
- [API Reference](./api-reference.md)
- [Manifest Guide](./manifest-guide.md)
- [Field Types Reference](./field-types-reference.md)
- [Lumia Plugin GPT](./lumia-plugin-gpt.md)

## Examples

- [Showcase Plugin Template](./examples/base-plugin.md) - Starter template with lifecycle logging, variables, and alerts.
- [Rumble Livestream Plugin](./examples/rumble.md) - JavaScript example that polls the Rumble API and publishes variables/alerts.
- [Hot News Plugin](./examples/hot-news.md) - NewsAPI headlines with alerts, variables, and on-demand actions.
- [Weather](./examples/cosmic-weather.md) - Open-Meteo example with themed copy and alert payloads.
- [BLE Messenger Plugin](./examples/ble-messenger.md) - Sends payloads to BLE devices with configurable settings/actions.
- [Divoom Controller Example Plugin](./examples/divoom-controller.md) - Controls Divoom Pixoo devices via local HTTP.

## License

The SDK is released under the MIT License. See https://github.com/lumiastream/Plugin-SDK/blob/main/LICENSE for details.
