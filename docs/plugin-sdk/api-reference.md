---
sidebar_position: 4
---

# API Reference

This document describes the public surface of the Lumia Stream Plugin SDK exported by `@lumiastream/plugin`.

## Plugin Base Class

### Constructor

```js
constructor(manifest, context)
```

Store any dependencies, initialise locals, and always pass the parameters to the parent constructor.

### Lifecycle Methods

- **`onload()`** – called when the plugin is enabled. Initialise resources, timers, or external connections here.
- **`onunload()`** – invoked when the plugin is disabled. Clean up timers, close sockets, and release resources.
- **`onupdate(oldVersion, newVersion)`** – triggered after a version upgrade. Optional.
- **`onsettingsupdate(settings, previousSettings)`** – called after settings change. Optional.
- **`searchLights(config?): Promise<any>`** – optional discovery hook for lights plugins. Return a list of devices for the auth UI.
- **`addLight(config): Promise<any>`** – optional manual-add hook for lights plugins. Return the updated list.
- **`searchThemes(config?): Promise<any>`** – optional Studio theme discovery hook for lights plugins. Return an array or an object containing `scenes`, `effects`, and/or `presets`.
- **`onLightChange(config): Promise<void>`** – optional hook fired when Lumia sends color/brightness updates for lights owned by your plugin (`config` includes `brand`, `lights`, `color`, `brightness`, `power`, `transition`, `rawConfig`).  
  For Studio theme-triggered updates, selected theme values are available in `config.rawConfig.theme`.

### Action Handling

- **`actions(config)`** – process action executions defined in the manifest. Optional.  
  **Note:** action parameters are provided via `action.value`. Use `const params = action.value;`.

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

### Alerts & Chat

- **`triggerAlert(options: PluginTriggerAlertOptions): Promise<boolean>`** – trigger an alert. Options include the alert identifier and optional payload. Set `showInEventList: true` to also record the alert in the Event List (default is `false`).
- **`displayChat(options: PluginDisplayChatOptions): void`** – display chat content inside Lumia Stream chatboxes and overlays.
- **`chatbot(options: { message: string; site?: string | string[]; color?: string; chatAsSelf?: boolean }): Promise<boolean>`** – send a message through the Lumia chatbot system.

### Overlay & Visuals

- **`overlaySendCustomContent(options: { layer: string; codeId: string; content: any }): Promise<boolean>`** – push custom overlay content.
- **`sendColor(options: { lights?: string[]; color: string | any; power?: boolean; brightness?: number; transition?: number }): Promise<boolean>`** – control connected lighting devices.
- **`getLights(): Promise<any>`** – retrieve current light information.
- _Light management note_: Lights are saved via the PluginAuth UI. Implement `searchLights`/`addLight` to return discovered devices for the UI, and handle runtime updates in `onLightChange`; plugins should not mutate light state directly.
- _Studio themes note_: If your plugin exposes themes/modes, implement `searchThemes` and set `config.themeConfig` in the manifest so Lumia knows where to place returned options (`scenes`, `effects`, `presets`).

### Audio & Speech

- **`playAudio(options: { path: string; volume?: number; waitForAudioToStop?: boolean }): Promise<boolean>`** – play an audio file. Await the promise if you need to wait for playback to finish.
- **`tts(options: { message: string; voice?: string; volume?: number }): Promise<boolean>`** – trigger text-to-speech playback.

### Files & Persistence

- **`writeFile(options: { path: string; message: string; append?: boolean; value?: string }): Promise<boolean>`** – write or append to a file.
- **`readFile(path: string): Promise<string | boolean>`** – read a file's contents. Returns `false` on failure.

### UX Helpers

- **`showToast(options: { message: string; time?: number }): Promise<boolean>`** – display a toast notification within Lumia Stream.  
  `time` is in **milliseconds**.
- **`addLog(message: string): Promise<boolean>`** – append a message to the Lumia Stream log panel.

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
  dynamic: { name: "value", value: "Tier1" }, // optional
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
  badges: ["mod"],
  messageId: "msg-1",
  channel: "my_channel",
  user: {
    mod: true,
    subscriber: false,
    vip: false,
    userId: "12345",
  },
  emotesRaw: "25:0-4",
  emotesPack: { "25": { locations: ["0-4"], type: "emote" } },
  isCheer: false,
  extraInfo: {
    extraSettings: {
      rawMessage: "Hello from plugin",
      skipCommandProcessing: false,
      emoteParserType: "twitch",
    },
  },
}
```

`PluginActionField` supports `allowTyping` on `select` fields. When true, the UI allows entering custom values while still showing the dropdown options as suggestions.

`PluginActionField` also supports `multiple` on `select` fields. When true, users can pick multiple options and the action receives an array of selected values.

`PluginActionField` also supports `allowVariables` to control whether template variables (e.g., `{{username}}`) can be inserted. When omitted, variables are **not** enabled. Set `allowVariables: true` on any field where you want variables (including `select` with `allowTyping`).

`dynamic` is only for variation matching (`variationConditions`). Lumia only registers two keys from this object: `name` and `value`.

- `dynamic.name`: the variation field/condition key to evaluate (for example `value`, `giftAmount`, or `subMonths`).
- `dynamic.value`: the runtime value to compare against that condition.

`extraSettings` is separate from variation matching. It can contain any key/value pairs and is passed through as alert variables for templates, overlays, and other runtime consumers.

If your alert has no `variationConditions`, omit `dynamic` and pass only `extraSettings`. `showInEventList` defaults to `false` and only records the alert in the Event List when set to `true`.

For `displayChat`, `user` flags (e.g., `mod`, `subscriber`, `vip`) are used when evaluating chat command permissions. `emotesRaw` uses the Twitch-style emote index format, while `emotesPack` follows the Kick/Discord style payload used by the chat UI.

`displayChat` also supports extra per-message hints via `extraInfo.extraSettings`:

- `rawMessage` (string): Unmodified chat content used for command parsing (useful when the displayed `message` includes prefixes or formatting).
- `skipCommandProcessing` (boolean): When true, the message is shown in chat but will not trigger command processing.
- `emoteParserType` (string): Forces emote/badge parsing for a specific platform (e.g., `twitch`, `kick`, `youtube`, `tiktok`) when the plugin origin differs.

`PluginIntegrationConfig` supports `actions_tutorial` (markdown) to display a guide alongside the Actions editor. It also supports `oauth` for Lumia-managed OAuth configuration (see the manifest guide for details).

Additional types such as `PluginManifest`, `PluginContext`, `PluginActionsConfig`, `PluginAuthConfig`, `PluginOAuthConfig`, and the error classes `PluginError`, `PluginSecurityError`, and `PluginInstallError` are exported from the SDK entry point for convenience.
