---
sidebar_position: 4
---

# API Reference

This document describes the public surface of the Lumia Stream Plugin SDK exported by `@lumiastream/plugin`.

## Plugin Base Class

### Constructor

```js
constructor(manifest, context);
```

Store any dependencies, initialise locals, and always pass the parameters to the parent constructor.

### Lifecycle Methods

- **`onload()`** – called when the plugin is enabled. Initialise resources, timers, or external connections here.
- **`onunload()`** – invoked when the plugin is disabled. Clean up timers, close sockets, and release resources.
- **`onupdate(oldVersion, newVersion)`** – triggered after a version upgrade. Optional.
- **`onsettingsupdate(settings, previousSettings)`** – called after settings change. Optional.
- **`aiPrompt(config): Promise<string | object | void> | string | object | void`** – optional AI prompt handler. Enabled by declaring `config.hasAI` in the manifest.
- **`aiModels(config?): Promise<Array<{ value, name? }> | string[] | { models: [...] } | void>`** – optional AI model list provider used by Lumia AI model pickers.
- **`chatbot(config): Promise<boolean | void> | boolean | void`** – optional native chatbot handler. Enabled by declaring `config.hasChatbot` in the manifest.
- **`modCommand(type, value): Promise<boolean | void> | boolean | void`** – optional moderation handler. Enabled by declaring `config.modcommandOptions` in the manifest.
- **`searchLights(config?): Promise<any>`** – optional discovery hook for lights plugins. Return a list of devices for the auth UI.
- **`addLight(config): Promise<any>`** – optional manual-add hook for lights plugins. Return the updated list.
- **`removeLight(config): Promise<any>`** – optional manual-remove hook for lights plugins. Return the updated list.
- **`searchPlugs(config?): Promise<any>`** – optional discovery hook for plug/accessory plugins. Return a list of plugs for the auth UI.
- **`addPlug(config): Promise<any>`** – optional manual-add hook for plug/accessory plugins. Return the updated list.
- **`removePlug(config): Promise<any>`** – optional manual-remove hook for plug/accessory plugins. Return the updated list.
- **`searchThemes(config?): Promise<any>`** – optional Studio theme discovery hook for lights plugins. Return an array or an object containing `scenes`, `effects`, and/or `presets`.
- **`onLightChange(config): Promise<void>`** – optional hook fired when Lumia sends color/brightness updates for lights owned by your plugin (`config` includes `brand`, `lights`, `color`, `brightness`, `power`, `transition`, `rawConfig`).  
  For Studio theme-triggered updates, selected theme values are available in `config.rawConfig.theme`.
- **`onPlugChange(config): Promise<void>`** – optional hook fired when Lumia sends plug state updates for plugs owned by your plugin (`config` includes `brand`, `devices`, `state`, `rawConfig`).
- **`onCustomAuthDisplaySignal(config): Promise<any>`** – optional hook fired when your custom auth display sends `signal(type, payload)`.
- **`onCustomAuthDisplayClose(config): Promise<void> | void`** – optional hook fired when the custom auth modal closes (manual close, backdrop/escape, or signal close).

### Action Handling

- **`actions(config)`** – process action executions defined in the manifest. Optional.  
  **Note:** action parameters are provided via `action.value`. Use `const params = action.value;`.
- `actions(config)` may optionally return:
  - `newlyPassedVariables?: Record<string, unknown>` – merged into runtime `extraSettings` for subsequent actions in the same chain.
    - Keys must be prefixed with your plugin id (`<pluginId>_key`).
    - Unprefixed keys are ignored by Lumia.
  - `shouldStop?: boolean` – when `true`, Lumia stops processing the remaining actions in that chain.

```js
// optional action return payload
{
  newlyPassedVariables: {
    myplugin_api_token: "abc123",
    myplugin_retry_count: 2,
    myplugin_payload: { source: "api" },
  },
  shouldStop: false,
}
```

### Variable Functions

- **`variableFunction(config)`** – resolve a template variable function defined in `config.variableFunctions`. Return a string to replace the template, or `{ value, variables }` to also expose extra values.

```js
// config shape
{
  key: "example_key",
  value: "input value",
  raw: "{{example_key=input value}}",
  args: ["input value"],
  allVariables: { username: "viewer123" },
}

// return shape
{
  value: "resolved output",
  variables: {
    extra_var: "extra value",
  },
}
```

### Convenience Properties

- **`settings`** – getter/setter for all plugin settings. Setting this replaces the entire settings object.
- **`manifest`** – read-only manifest supplied by Lumia Stream.
- **`lumia`** – typed access to the Lumia Stream runtime API (`ILumiaAPI`).

### Helper Methods

- **`updateSettings(updates: Record<string, any>): void`** – merge new settings values with the existing ones.
- **`validateAuth(data: any): Promise<boolean | string | { ok: boolean; message?: string }>`** – override to validate custom authentication flows. Return `true` for success, `false` for failure, a string to show a failure message, or `{ ok, message }` for explicit status + message.
- **`refreshAuth<T>(data: T): Promise<T>`** – override to refresh credentials when required.

## Lumia API (`ILumiaAPI`)

### Connection

- **`updateConnection(state: boolean): Promise<void>`** – notify Lumia Stream that the plugin connection has changed.
- **`getConnectionState(): boolean`** – check the last reported connection state.

Connection lifecycle guidance for networked plugins:

- Implement a real disconnect path (`onunload`, manual disconnect action, or auth failure) and call `updateConnection(false)`.
- Use capped backoff for reconnect attempts and stop retrying after a small fixed limit.
- If retries are exhausted, keep the plugin disconnected and pause polling until an explicit reconnect trigger.
- In polling paths, do not use unbounded `fetch`; enforce request timeouts with `AbortController` or `Promise.race`.
- If you gate refreshes with an in-flight promise (for example `_refreshPromise`), clear it in `finally`.
- Add stale lock recovery so a hung request cannot block all future polls.

### Settings

- **`getSettings(): Record<string, any>`** – get the current settings object.
- **`setSettings(settings: Record<string, any>): void`** – replace all settings.
- **`updateSettings(updates: Record<string, any>): void`** – merge changes into the existing settings.

### Shared Resources

- **`acquireShared<T>(key: string, factory?: () => T | Promise<T>, options?: { dispose?: (resource: T) => void | Promise<void> }): Promise<T>`** – acquire a shared runtime resource in the plugin host process.
- **`releaseShared(key: string): Promise<boolean>`** – release one plugin reference for a shared resource key.
- **`acquireSharedNoble(options?: { key?: string }): Promise<PluginSharedNobleClient>`** – acquire the shared `@abandonware/noble` BLE runtime with plugin-scoped scan/listener controls.
- **`releaseSharedNoble(options?: { key?: string }): Promise<boolean>`** – release one plugin reference for the shared noble runtime.

Use shared resources for heavyweight runtimes (OpenCV, ONNX, native SDK bridges) so multiple plugins can reuse one initialized instance.  
For BLE, prefer `acquireSharedNoble` so plugins do not fight over adapter scanning state.
By default, `acquireSharedNoble` uses the host key `bluetooth.runtime.noble.manager.v1`.

`PluginSharedNobleClient` exposes:

- **`getNoble(): any`** – raw noble module instance.
- **`getState(): string`** – last observed adapter state.
- **`isScanning(): boolean`** – whether shared runtime is currently scanning.
- **`waitForPoweredOn(timeoutMs?: number): Promise<string>`** – wait until adapter is ready.
- **`onDiscover(listener): () => void`** – subscribe to discovered peripherals.
- **`onStateChange(listener): () => void`** – subscribe to adapter state changes.
- **`startScanning(options?: { serviceUuids?: string[]; allowDuplicates?: boolean }): Promise<boolean>`** – start this plugin's scan request.
- **`stopScanning(): Promise<boolean>`** – stop this plugin's scan request.

### OAuth

- **`refreshOAuthToken(options: { refreshToken: string; applicationId?: number; secondaryAccount?: boolean }): Promise<{ accessToken?: string; refreshToken?: string; raw?: any }>`** – refresh an OAuth access token via Lumia's server. Provider is inferred from the plugin ID. Returns the new token payload.

### Variables

- **`setVariable(name: string, value: any): Promise<void>`** – store a variable that other Lumia features can consume.
- **`getVariable(name: string): Promise<any>`** – read a stored variable value (await the result).

### Commands

- **`callCommand(name: string, variableValues?: any): Promise<any>`** – execute another Lumia command and optionally pass variable values.
- **`getAllCommands(params?: { onlyOn?: boolean }): Promise<any>`** – fetch available commands.

### Dynamic UI Options

- **`updateActionFieldOptions({ actionType, fieldKey, options }): Promise<boolean>`** – update action dropdown options at runtime.
- **`updateSettingsFieldOptions({ fieldKey, options }): Promise<boolean>`** – update settings dropdown options at runtime (used with `dynamicOptions` fields in PluginAuth).

### Alerts & Chat

- **`triggerAlert(options: PluginTriggerAlertOptions): Promise<boolean>`** – trigger an alert. Options include the alert identifier and optional payload. `showInEventList` defaults to `false`; set it to `true` only when users should see those plugin-triggered events in Event List (usually streaming platform/event-source plugins).
- **`displayChat(options: PluginDisplayChatOptions): void`** – display chat content inside Lumia Stream chatboxes and overlays.
- **`chatbot(options: { message: string; site?: string | string[]; color?: string; chatAsSelf?: boolean }): Promise<boolean>`** – send a message through the Lumia chatbot system.

### Overlay & Visuals

- **`overlaySendCustomContent(options: { layer: string; codeId: string; content: any }): Promise<boolean>`** – push custom overlay content.
- **`sendColor(options: { lights?: string[]; color: string | any; power?: boolean; brightness?: number; transition?: number }): Promise<boolean>`** – control connected lighting devices.
- **`getLights(): Promise<any>`** – retrieve current light information.
- _Light management note_: Lights are saved via the PluginAuth UI. Implement `searchLights`/`addLight` (and optionally `removeLight`) to manage auth UI devices, and handle runtime updates in `onLightChange`; plugins should not mutate live light state directly.
- _Plug management note_: Plugs are saved via the PluginAuth UI. Implement `searchPlugs`/`addPlug` (and optionally `removePlug`) to manage auth UI devices, and handle runtime updates in `onPlugChange`; plugins should not mutate plug state directly.
- _Studio themes note_: If your plugin exposes themes/modes, implement `searchThemes` and set `config.themeConfig` in the manifest so Lumia knows where to place returned options (`scenes`, `effects`, `presets`).

### Audio & Speech

- **`playAudio(options: { path: string; volume?: number; waitForAudioToStop?: boolean }): Promise<boolean>`** – play an audio file. Await the promise if you need to wait for playback to finish.
- **`tts(options: { message: string; voice?: string; volume?: number }): Promise<boolean>`** – trigger text-to-speech playback.

`playAudio` notes:

- `path` should be a renderer-playable audio source such as a local file path, `file://...`, `http://...`, `https://...`, or `data:audio/...`.
- Prefer local files or `data:` URLs when your plugin generated/downloaded the audio itself.
- Avoid passing `blob:` / `blob:nodedata:` URLs from a different runtime context. Blob URLs are context-scoped and may fail to load in Lumia's renderer even if they were valid where they were created.
- `waitForAudioToStop: true` means the returned promise resolves after playback completes.
- `waitForAudioToStop: false` means the promise may resolve as soon as playback starts, so plugin cleanup code must not immediately invalidate the source.

Example:

```js
await this.lumia.playAudio({
	path: "file:///Users/me/Desktop/alert.wav",
	volume: 100,
	waitForAudioToStop: true,
});
```

Example with generated audio bytes:

```js
const response = await fetch(audioUrl);
const buffer = await response.arrayBuffer();
const base64 = Buffer.from(buffer).toString("base64");

await this.lumia.playAudio({
	path: `data:audio/wav;base64,${base64}`,
	volume: 100,
	waitForAudioToStop: true,
});
```

### Files & Persistence

- **`writeFile(options: { path: string; message: string; append?: boolean; value?: string }): Promise<boolean>`** – write or append to a file.
- **`readFile(path: string): Promise<string | boolean>`** – read a file's contents. Returns `false` on failure.

### UX Helpers

- **`showToast(options: { message: string; time?: number; type?: "info" | "success" | "warning" | "warn" | "error" }): Promise<boolean>`** – display a toast notification within Lumia Stream.  
  `time` is in **milliseconds**.
- **`prompt(options: { title?: string; message?: string; inputLabel?: string; inputPlaceholder?: string; confirmLabel?: string; showCancelButton?: boolean; inputType?: "text" | "password" }): Promise<{ value: string } | null>`** – open a SweetAlert input prompt. Returns `{ value }` on confirm or `null` if cancelled/failed.
  Example:
  ```js
  const result = await lumia.prompt({
    title: "Phone Verification",
    message: "Enter the verification code",
    inputLabel: "Login Code",
    inputPlaceholder: "12345",
    confirmLabel: "Verify",
  });
  if (result?.value) {
    // use result.value
  }
  ```
- **`log(params: { message?: any; level?: "info" | "warn" | "warning" | "error" | "success" | "debug"; type?: ... } | string | number, type?: "info" | "warn" | "warning" | "error" | "success" | "debug"): Promise<boolean>`** – write to the plugin host console (visible in plugin host logs). Supports either object form (`{ message, level/type }`) or positional form (`message, type`).
- **`dashboardLog(params: { message?: any; level?: "info" | "warn" | "warning" | "error" | "success" | "debug"; type?: ... } | string | number, type?: "info" | "warn" | "warning" | "error" | "success" | "debug"): Promise<boolean>`** – write a plugin message into Lumia Stream's dashboard log feed (the main app log panel). Also supports object or positional severity.
- **`addLog(...)`** – deprecated alias of `log(...)`.

### Integration Helpers

`ILumiaAPI.integration` exposes:

- **`getId(): string`** – current integration identifier.
- **`getConfig(): Record<string, any>`** – read integration configuration.
- **`isConnected(): boolean`** – whether the integration reports a connected state.
- **`isEnabled(): boolean`** – whether the integration is enabled.

### Payload Shapes

```js
// triggerAlert options
{
  alert: "my-alert-key",
  dynamic: { value: "Tier1" }, // optional
  extraSettings: { username: "viewer123" }, // optional
  showInEventList: false, // optional
}

// displayChat options
{
  username: "viewer123",
  displayname: "Viewer123",
  message: "Hello from plugin",
  avatar: "https://example.com/avatar.png",
  color: "#9147ff",
  badges: ["https://example.com/badges/mod.png"],
  messageId: "msg-1",
  channel: "my_channel",
  userId: "12345",
  userLevels: {
    isSelf: false,
    mod: true,
    vip: false,
    tier3: false,
    tier2: false,
    subscriber: false,
    follower: true,
  },
  emotesRaw: JSON.stringify([
    { id: "Cupcake!", url: "https://img.trovo.live/test/emotes/Cupcake!.webp", start: 0, end: 7 },
    { id: "wave", urls: ["https://example.com/emotes/wave-1x.png", "https://example.com/emotes/wave-2x.png"], start: 9, end: 12 },
  ]),
  skipCommandProcessing: false,
  isCheer: false,
}
```

`PluginActionField` supports `allowTyping` on `select` fields. When true, the UI allows entering custom values while still showing the dropdown options as suggestions.

`PluginActionField` also supports `multiple` on `select` fields. When true, users can pick multiple options and the action receives an array of selected values.

`PluginActionField` also supports `allowVariables` to control whether template variables (e.g., `{{username}}`) can be inserted. When omitted, variables are **not** enabled. Set `allowVariables: true` on any field where you want variables (including `select` with `allowTyping`).

`dynamic` is only for variation matching (`variationConditions`).

- Use `dynamic.value` for standard equal/greater/less conditions.
- For specialized checks, pass direct dynamic fields (for example `giftAmount`, `subMonths`, `currency`, `isGift`).
- Plugin-triggered alerts do not accept `dynamic.name`; plugin runtime strips it automatically.
- Variation matching reads `dynamic`; `extraSettings` is not used to satisfy variation checks.
- See the Manifest Guide section `Variation Payload Contract (Plugins)` for condition-to-field mapping.

`extraSettings` is separate from variation matching. It can contain any key/value pairs and is passed through as alert variables for templates, overlays, and other runtime consumers.

If your alert has no `variationConditions`, omit `dynamic` and pass only `extraSettings`. `showInEventList` defaults to `false` and only records the alert in the Event List when set to `true`.

Best practice: keep `showInEventList` disabled for utility/device/app plugins that fire internal workflow alerts. Enable it for platform integrations (for example Twitch/Kick/Trovo/Rumble-style event streams) where Event List visibility is expected.

For `displayChat`, `userLevels` flags are used when evaluating chat command permissions.

`emotesRaw` supports two formats:

- Twitch index format string (example: `"25:0-4/1902:6-10"`).
- Common plugin JSON format (works for any plugin origin):
  - `[{ id?: string, url?: string, urls?: string[], start: number, end: number }]`
  - or `{ emotes: [...] }`
  - `start` and `end` are inclusive character offsets in `message`.
  - Use `url` for a single image URL or `urls` for multi-resolution emotes.

Use `skipCommandProcessing` (top-level) to show a message in chat without running command parsing.

`PluginIntegrationConfig` supports `actions_tutorial` (markdown) to display a guide alongside the Actions editor. It also supports `oauth` for Lumia-managed OAuth configuration (see the manifest guide for details).

For media embeds inside tutorials (`iframe`, `video`, `audio`, `source`) and URL safety rules, see `docs/manifest-guide.md` under **Tutorial Media Embeds**.

`PluginIntegrationConfig` also supports `custom_auth_display` for custom setup UI embedded in PluginAuth:

```json
{
	"config": {
		"custom_auth_display": {
			"entry": "./auth/index.html",
			"autoAutoOpen": true,
			"authButtonLabel": "Open Setup",
			"title": "Setup Wizard"
		}
	}
}
```

- `entry` and `title` are required.

Custom auth display runtime bridge:

- `window.customAuthDisplay.signal(type, payload)` routes to `onCustomAuthDisplaySignal`.
- `window.customAuthDisplay.close(reason?)` closes the modal and routes to `onCustomAuthDisplayClose`.
- `signal('close')` is also supported as a close mode.

Custom auth display styling guidance (Lumia-aligned):

- Base palette: `#191743` (background), `#1f1f3a` (container), `#15142b` (card), `#393853` (border), `#ff4076` (primary), `#ffffff` (primary text), `#cac9d5` (secondary text).
- Control standards: `1px` borders, dark/translucent fills, `10-14px` control radius, `16px` panel radius, `8px` spacing scale.
- Buttons: primary uses Lumia pink (`#ff4076`) accent; secondary uses neutral dark fill; success/warn/error use `#5dda6c` / `#dcc984` / `#fd5454` tints.
- Typography: `Roboto, sans-serif`.

See `docs/manifest-guide.md` ("Lumia PluginAuth Styling Standards") for the full token block and examples.

`PluginIntegrationConfig` also supports `translations` for plugin-localized strings:

- shape: either a language-map object or a single relative `.json` file path
- object keys: language codes (for example `en`, `es`, `fr`)
- object values: inline translation objects (legacy per-language file paths are also supported)
- runtime: loaded under your plugin namespace (plugin `id`) when the plugin loads
- variable/global variable keys: Lumia resolves both `key` and `pluginid_key` forms automatically

`PluginIntegrationConfig` also supports `hasAI` for plugin-native AI routing:

```js
{
	hasAI: true;
}
```

When `hasAI` is enabled, Lumia routes prompt requests to your plugin by calling `aiPrompt(config)`, and model list requests by calling `aiModels(config?)`.

`PluginIntegrationConfig` also supports `hasChatbot` for plugin-native chatbot routing:

```js
{
	hasChatbot: true;
}
```

When `hasChatbot` is enabled, Lumia routes chatbot messages for that platform to your plugin by calling `chatbot(config)`.

`PluginIntegrationConfig` also supports `modcommandOptions` for Dashboard/API moderation routing:

```js
{
	modcommandOptions: ["delete", "ban", "timeout"];
}
```

When declared, Lumia routes matching mod actions to your plugin by calling `modCommand(type, value)`.

Additional types such as `PluginManifest`, `PluginContext`, `PluginActionsConfig`, `PluginAuthConfig`, `PluginOAuthConfig`, and the error classes `PluginError`, `PluginSecurityError`, and `PluginInstallError` are exported from the SDK entry point for convenience.
