---
title: Overview
sidebar_position: 1
---

# Lumia Stream Plugin SDK

Official JavaScript SDK for developing plugins for [Lumia Stream](https://lumiastream.com).

![Lumia Stream Plugin](./lumiaplugin-banner.png)

## Installation

```bash
npm install @lumiastream/plugin
```

## Usage

```js
import { Plugin } from "@lumiastream/plugin";

export default class MyPlugin extends Plugin {
	constructor(manifest, context) {
		super(manifest, context);
	}

	async onload() {
		// Plugin loaded
	}

	async onunload() {
		// Plugin unloaded
	}
}
```

JavaScript (`.js`) is the default runtime path for plugins.

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

- `onload()` – invoked when the plugin is enabled inside Lumia Stream.
- `onunload()` – called when your plugin is disabled or unloaded.
- `onupdate(oldVersion, newVersion)` – triggered after version upgrades.
- `onsettingsupdate(settings, previousSettings)` – called whenever settings change.
- `actions(config)` – handle custom actions invoked from Lumia automations.  
  **Note:** action parameters are provided via `action.value`. Use `const params = action.value;`.
- `searchLights(config)` – optional hook for lights plugins to return discoverable devices in the auth UI.
- `addLight(config)` – optional hook for manual light add flows; return the updated light list.
- `searchThemes(config)` – optional hook for lights plugins to return Studio theme options (array or `{ scenes|effects|presets }` object).
- `onLightChange(config)` – optional runtime hook for light updates and Studio theme executions (`config.rawConfig.theme` when invoked from themes).

## Lights And Studio Themes

If your plugin is a lights integration:

- implement `searchLights` and/or `addLight` for light selection in auth
- implement `onLightChange` to apply runtime light changes
- implement `searchThemes` to surface mode/scene options in Studio themes
- set `config.themeConfig` in `manifest.json` to control which Studio bucket (`scenes`, `effects`, or `presets`) Lumia should use

## Lumia API Highlights

Interact with Lumia Stream using the strongly typed `ILumiaAPI` helper on the plugin context:

```js
await this.lumia.triggerAlert({
    alert: "follow",
    extraSettings: { username: "StreamerFan" },
    showInEventList: true,
});
await this.lumia.playAudio({ path: "alert.mp3", volume: 0.7 });
this.lumia.setVariable("follower_count", 1337);
this.lumia.displayChat({
    username: "Viewer123",
    message: "Hello from the plugin!",
});
```

See the [API reference](./api-reference) for the full surface area.

### Shared Runtime Resources

Plugins can share heavy resources (for example OpenCV/ONNX runtimes) across the plugin host process:

```js
const sharedCv = await this.lumia.acquireShared("opencv.runtime", () => {
    return require("@lumiastream/opencv-runtime");
}, {
    dispose: (runtime) => runtime?.shutdown?.(),
});
// ...use sharedCv...
await this.lumia.releaseShared("opencv.runtime");
```

Notes:
- The first plugin call for a key should provide `factory`.
- Later plugins can call `acquireShared(key)` to reuse the same instance.
- If a plugin unloads without releasing, Lumia auto-releases its remaining references.

For Bluetooth plugins using `@abandonware/noble`, use the shared noble helper instead of loading noble separately in each plugin:

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

Notes:
- `acquireSharedNoble()` defaults to key `bluetooth.runtime.noble.manager.v1`.
- Scan/listener controls are plugin-scoped, so plugins can share one adapter runtime without fighting over scan state.

## Runtime Environment

Plugins execute in an isolated **Node.js** process (no browser DOM). Use Node-compatible packages and avoid browser-only APIs like `window`, `document`, `localStorage`, or `XMLHttpRequest`. Bundle or ship your dependencies with the plugin; do not assume Lumia provides third-party packages unless documented.

## Scripts

- `npm run build` – compile the SDK to the `dist` folder.
- `npm run lint` – type-check the source without emitting output.
- `npm run package-docs` – rebuild the GPT knowledge pack in `gpt-knowledge/lumia-plugin-sdk-docs`.
- `npm run sync:developer-docs` – sync core SDK docs and generated example pages into `../Developer-Docs/docs/plugin-sdk` (no manual copy/paste).

## CLI Helpers

The CLI is distributed separately via `lumia-plugin`. Use it with `npx` (requires npm 7+).

- `npx lumia-plugin create my_plugin` scaffold a feature-rich sample plugin showing logging, variables, and alerts
- `npx lumia-plugin validate ./path/to/plugin` check `manifest.json`, entry files, and config for common mistakes
- `npx lumia-plugin build ./path/to/plugin --out ./plugin.lumiaplugin` bundle the directory into a distributable archive

## Documentation

- [Getting Started](./getting-started)
- [API Reference](./api-reference)
- [Manifest Guide](./manifest-guide)
- [Field Types Reference](./field-types-reference)

## Examples

- `examples/base_plugin` – Showcase JavaScript template used by `npx lumia-plugin create`.
- `examples/divoom_pixoo` – Device plugin that sends text, GIFs, drawings, and controls to Divoom Pixoo displays.
- `examples/elevenlabs_tts` – Audio plugin that generates ElevenLabs speech/music and plays it through Lumia.
- `examples/eveonline` – EVE Online integration that syncs character status, wallet, location, and activity from ESI.
- `examples/minecraft_server` – Game plugin that monitors Minecraft Java server status/player changes.
- `examples/ntfy` – App plugin that subscribes to ntfy topics and triggers Lumia alerts/variables.
- `examples/ollama` – App plugin that queries a local Ollama server and exposes prompt helpers for templates.
- `examples/openrgb` – Lights plugin that controls OpenRGB devices and profile actions from Lumia.
- `examples/rumble` – Platforms plugin that tracks Rumble livestream state, engagement, and chat metadata.
- `examples/settings_field_showcase` – Reference plugin demonstrating all supported settings field types.
- `examples/steam` – Steam integration that tracks profile status, games, and achievements with optional alerts/actions.

## License

The SDK is released under the MIT License. See [LICENSE](https://github.com/lumiastream/Plugin-SDK/blob/main/LICENSE) for details.
