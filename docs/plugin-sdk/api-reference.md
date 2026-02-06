---
sidebar_position: 4
---

# API Reference

This document describes the public surface of the Lumia Stream Plugin SDK exported by `@lumiastream/plugin`.

## Plugin Base Class

### Constructor

```ts
constructor(manifest: PluginManifest, context: PluginContext)
```

Store any dependencies, initialise locals, and always pass the parameters to the parent constructor.

### Lifecycle Methods

- **`onload(): Promise<void>`** – called when the plugin is enabled. Initialise resources, timers, or external connections here.
- **`onunload(): Promise<void>`** – invoked when the plugin is disabled. Clean up timers, close sockets, and release resources.
- **`onupdate(oldVersion: string, newVersion: string): Promise<void>`** – triggered after a version upgrade. Optional.
- **`onsettingsupdate(settings, previousSettings): Promise<void>`** – called after settings change. Optional.
- **`onLightChange(config): Promise<void>`** – optional hook fired when Lumia sends a color/brightness update for lights owned by your plugin (`config` includes `brand`, `lights`, `color`, `brightness`, `power`, `transition`, `rawConfig`).

### Action Handling

- **`actions(config: { actions: PluginActionPayload[]; extraSettings?: Record<string, unknown> }): Promise<void>`** – process action executions defined in the manifest. Optional.  
  **Note:** action parameters are provided via `action.value`. Use `const params = action?.value ?? {};`.

### Variable Functions

- **`variableFunction(config: PluginVariableFunctionContext): Promise<string | PluginVariableFunctionResult | undefined>`** – resolve a template variable function defined in `config.variableFunctions`. Return a string to replace the template, or `{ value, variables }` to also expose extra values.

```ts
interface PluginVariableFunctionContext {
	key: string;
	value?: string;
	raw?: string;
	args?: string[];
	allVariables?: Record<string, any>;
}

interface PluginVariableFunctionResult {
	value: string;
	variables?: Record<string, any>;
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

### OAuth

- **`refreshOAuthToken(options: { refreshToken: string; applicationId?: number; secondaryAccount?: boolean }): Promise<{ accessToken?: string; refreshToken?: string; raw?: any }>`** – refresh an OAuth access token via Lumia's server. Provider is inferred from the plugin ID. Returns the new token payload.

### Variables

- **`setVariable(name: string, value: any): Promise<void>`** – store a variable that other Lumia features can consume.
- **`getVariable(name: string): any`** – read a stored variable value.

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

### Type Definitions

```ts
interface PluginTriggerAlertOptions {
	alert: string;
	dynamic?: { name: string; value: string | number | boolean };
	extraSettings?: Record<string, any>;
	showInEventList?: boolean;
}

interface PluginDisplayChatOptions {
	username: string;
	displayname?: string;
	message: string;
	avatar?: string;
	color?: string;
	badges?: string[];
	messageId?: string;
	channel?: string;
	user?: {
		isSelf?: boolean;
		broadcaster?: boolean;
		mod?: boolean;
		vip?: boolean;
		subscriber?: boolean;
		member?: boolean;
		tier1?: boolean;
		tier2?: boolean;
		tier3?: boolean;
		follower?: boolean;
		regular?: boolean;
		badges?: Record<string, any> | string[];
		userId?: string;
	};
	emotesRaw?: string;
	emotesPack?: Record<string, any> | any[];
	isCheer?: boolean;
	extraInfo?: Record<string, any>;
}
```

`PluginActionField` supports `allowTyping` on `select` fields. When true, the UI allows entering custom values while still showing the dropdown options as suggestions.

`PluginActionField` also supports `allowVariables` to control whether template variables (e.g., `{{username}}`) can be inserted. When omitted, variables are **not** enabled. Set `allowVariables: true` on any field where you want variables (including `select` with `allowTyping`).

`dynamic` is the link between runtime alerts and the manifest's `variationConditions`. Provide the fields that the active condition needs—commonly `value` (for equality/greater checks), and optionally `currency`, `giftAmount`, `subMonths`, `isPrime`, etc.—so Lumia Stream can resolve the correct variation. `showInEventList` defaults to `false` and only records the alert in the Event List when set to `true`.

For `displayChat`, `user` flags (e.g., `mod`, `subscriber`, `vip`) are used when evaluating chat command permissions. `emotesRaw` uses the Twitch-style emote index format, while `emotesPack` follows the Kick/Discord style payload used by the chat UI.

`displayChat` also supports extra per-message hints via `extraInfo.extraSettings`:

- `rawMessage` (string): Unmodified chat content used for command parsing (useful when the displayed `message` includes prefixes or formatting).
- `skipCommandProcessing` (boolean): When true, the message is shown in chat but will not trigger command processing.
- `emoteParserType` (string): Forces emote/badge parsing for a specific platform (e.g., `twitch`, `kick`, `youtube`, `tiktok`) when the plugin origin differs.

`PluginIntegrationConfig` supports `actions_tutorial` (markdown) to display a guide alongside the Actions editor. It also supports `oauth` for Lumia-managed OAuth configuration (see the manifest guide for details).

Additional types such as `PluginManifest`, `PluginContext`, `PluginActionsConfig`, `PluginAuthConfig`, `PluginOAuthConfig`, and the error classes `PluginError`, `PluginSecurityError`, and `PluginInstallError` are exported from the SDK entry point for convenience.
