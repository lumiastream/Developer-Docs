---
sidebar_position: 3
---

# Plugin Manifest Guide

The `manifest.json` file is the heart of your Lumia Stream plugin. It defines metadata, configuration options, and capabilities.

## Basic Structure

```json
{
	"id": "unique_plugin_id",
	"name": "Human Readable Name",
	"version": "1.0.0",
	"author": "Your Name",
	"description": "Brief description",
	"lumiaVersion": "^9.0.0",
	"category": "utilities",
	"config": {
		"settings": [],
		"actions": [],
		"variables": [],
		"alerts": []
	}
}
```

## Required Fields

### Basic Information

- **`id`** (string): Unique identifier for your plugin. Use letters, numbers, or underscores—no spaces or hyphens.
- **`name`** (string): Human-readable plugin name.
- **`version`** (string): Semantic version (e.g., "1.0.0").
- **`author`** (string): Plugin author name.
- **`description`** (string): Brief description of what the plugin does.
- **`lumiaVersion`** (string): Compatible Lumia Stream version (semver range).
- **`category`** (string): Plugin category (see categories below).

## Optional Fields

### Extended Information

- **`email`** (string): Author's email address.
- **`website`** (string): Plugin or author website URL.
- **`repository`** (string): Source code repository URL.
- **`license`** (string): License type (e.g., "MIT", "GPL-3.0").
- **`keywords`** (string): Comma separated list of keywords for search.
- **`icon`** (string): Plugin icon filename (PNG recommended).
- **`changelog`** (string): Markdown changelog content.

## Plugin Categories

The Lumia marketplace recognises the following categories (strings are case-sensitive):

- **`system`** – Core Lumia features and internal tooling
- **`platforms`** – Streaming platform integrations (Twitch, YouTube, Kick, etc.)
- **`apps`** – Third-party app integrations
- **`lights`** – General lighting control providers
- **`switch`** – Smart switch and relay integrations
- **`deck`** – Control deck hardware and software
- **`protocols`** – Network or automation protocols (OSC, MIDI, etc.)
- **`keylight`** – Key light devices
- **`devices`** – Miscellaneous hardware integrations
- **`utilities`** – General purpose utilities and helpers
- **`overlays`** – Overlay and visual experiences
- **`audio`** – Audio processing and sound integrations
- **`chat`** – Chat interaction tools
- **`development`** – Development, testing, and debugging utilities

### Lights configuration (for lights category)

If your plugin provides lights, add a `config.lights` block so the PluginAuth UI can render discovery/manual-add controls and a selection list. Lights are saved by the Lumia UI—plugins should not mutate light state directly.

```json
{
	"id": "my_lights_plugin",
	"name": "My Lights",
	"category": "lights",
	"config": {
		"settings": [],
		"lights": {
			"search": {
				"buttonLabel": "Discover lights",
				"helperText": "Runs your searchLights hook"
			},
			"manualAdd": {
				"buttonLabel": "Add light",
				"helperText": "Enter details for a device",
				"fields": [
					{ "key": "name", "label": "Name", "type": "text", "required": true },
					{ "key": "id", "label": "ID (optional)", "type": "text" },
					{ "key": "ip", "label": "IP (optional)", "type": "text" }
				]
			},
			"displayFields": [
				{ "key": "name", "label": "Name" },
				{ "key": "ip", "label": "IP", "fallback": "No IP" }
			],
			"emptyStateText": "No lights yet. Discover or add one."
		}
	}
}
```

Runtime hooks for lights plugins:

- Implement `searchLights` to return an array of discovered lights for the UI to save.
- Implement `addLight` to handle manual-add requests and return the updated array.
- Implement `onLightChange` to receive color/brightness/power updates for your lights.

Note: Selection and persistence are handled by the PluginAuth UI; plugins should not call `registerLights`/`updateChosenLights`.

## Configuration

The `config` object defines your plugin's interactive elements:

### Settings

Settings create a configuration UI for users:

```json
{
	"config": {
		"settings": [
			{
				"key": "apiKey",
				"label": "API Key",
				"type": "password",
				"placeholder": "Enter your API key",
				"helperText": "Get this from your service dashboard",
				"required": true
			},
			{
				"key": "pollInterval",
				"label": "Poll Interval (seconds)",
				"type": "number",
				"defaultValue": 30,
				"validation": {
					"min": 5,
					"max": 300
				}
			},
			{
				"key": "notifications",
				"label": "Enable Notifications",
				"type": "toggle",
				"defaultValue": true
			}
		]
	}
}
```

Avoid adding settings that exist only for testing or debugging. Keep settings user-facing and essential.

If you provide `settings_tutorial` (markdown), it renders as a setup guide in the auth screen.

To provide a tutorial that is specific to actions, use `actions_tutorial`. When present, it renders in the Actions editor.

Populate both tutorials with clear, step-by-step instructions that a first-time user can follow without guesswork.

Tutorials can include local images bundled with the plugin. Reference them with a relative path and they will resolve from the plugin root at runtime:

```md
### Setup

![API Key](clickup_tutorial_api_key.jpg)
![List ID](clickup_tutorial_list_id.jpg)
```

#### Multi-Value Settings

Use `text_list` when you need users to enter multiple values (stored as an array of strings).

```json
{
	"config": {
		"settings": [
			{
				"key": "lightIds",
				"label": "Light IDs",
				"type": "text_list",
				"helperText": "Add one or more light identifiers",
				"defaultValue": ["keylight-1", "keylight-2"]
			}
		]
	}
}
```

### OAuth (Lumia-managed)

Plugins can request OAuth via Lumia's auth service so users can authorize in-app and store tokens in plugin settings. To enable this, add an `oauth` block under `config`.

```json
{
	"config": {
		"oauth": {
			"buttonLabel": "Authorize Fitbit",
			"helperText": "Connect your Fitbit account to pull health metrics.",
			"openInBrowser": false,
			"scopes": ["activity", "heartrate"],
			"extraParams": "external=true",
			"tokenKeys": {
				"accessToken": "accessToken",
				"refreshToken": "refreshToken",
				"tokenSecret": "tokenSecret"
			}
		}
	}
}
```

Notes:

- The OAuth provider is always the plugin ID within Lumia. If you need a new OAuth 2.0 integration, contact Lumia Stream on Discord or email dev@lumiastream.com so we can enable it for your plugin.
- `serviceUrl` can be provided to override the default auth URL entirely.
- `scopes` are provider-specific. When set, they are sent to Lumia's OAuth service as a comma-separated list.
- Tokens are stored into your plugin settings using the `tokenKeys` mapping and are available via `this.settings` in your plugin.

#### Setting Types

- **`text`** - Single-line text input
- **`password`** - Password input (hidden text)
- **`number`** - Numeric input
- **`email`** - Email address input
- **`url`** - URL input
- **`textarea`** - Multi-line text input
- **`select`** - Dropdown selection
- **`checkbox`** - Checkbox input
- **`toggle`** - Toggle switch
- **`color`** - Color picker
- **`file`** - File upload

Settings can also include **`disabled`** (boolean) to render a read-only field in the PluginAuth UI.

#### Validation Options

```json
{
	"validation": {
		"pattern": "^[a-zA-Z0-9]+$",
		"min": 1,
		"max": 100,
		"minLength": 5,
		"maxLength": 50
	}
}
```

#### Select Options

```json
{
	"key": "quality",
	"label": "Stream Quality",
	"type": "select",
	"options": [
		{ "label": "Low (480p)", "value": "480p" },
		{ "label": "Medium (720p)", "value": "720p" },
		{ "label": "High (1080p)", "value": "1080p" }
	]
}
```

### Actions

Actions allow users to trigger plugin functionality manually:

```json
{
	"config": {
		"actions": [
			{
				"type": "send_message",
				"label": "Send Custom Message",
				"description": "Send a custom message to the service",
				"fields": [
					{
						"key": "message",
						"label": "Message",
						"type": "textarea",
						"required": true
					},
					{
						"key": "channel",
						"label": "Channel",
						"type": "select",
						"options": [
							{ "label": "General", "value": "general" },
							{ "label": "Alerts", "value": "alerts" }
						]
					}
				]
			},
			{
				"type": "update_status",
				"label": "Update Status",
				"description": "Update the current status message",
				"fields": [
					{
						"key": "status",
						"label": "Status",
						"type": "text",
						"required": true
					}
				]
			}
		]
	}
}
```

Avoid test-only actions (for example, test connection or refetch). Actions should map to real user workflows.

To auto-refresh dynamic options when a user selects the action type, set `refreshOnChange` on the action.

```json
{
	"type": "send_message",
	"label": "Send Custom Message",
	"refreshOnChange": true,
	"fields": []
}
```

### Variable Functions

Variable functions let plugins return values inline in templates (similar to `{{ai_prompt=...}}`).

Define them under `config.variableFunctions`:

```json
{
	"config": {
		"variableFunctions": [
			{
				"key": "my_function",
				"label": "My Function",
				"description": "Use {{my_function=value}} to return a value."
			}
		]
	}
}
```

Usage example:

```
{{my_function=message|thread|model}}
```

- The text after `=` is passed to the plugin as a raw string (`value`).
- A convenience `args` array is provided by splitting the raw string on `|`.
- Your plugin handles the logic in `variableFunction()` and returns a string.

Guidelines:

- Keep variable functions fast. They run during template resolution.
- Do not log excessively or retry aggressively.
- Return a plain string or an object with `{ value, variables }`.

#### Logging Guidance

Avoid excessive logging. High-frequency logs can quickly fill the user's Logs dashboard. Prefer concise logs and only emit details for errors or explicit user actions. Avoid per-plugin log wrappers unless they add real value.

#### Action Field Types

Action fields support the following input types:

- **`text`** - Single-line text input. Supports variables when `allowVariables` is true.
- **`email`** - Email address input with validation. Supports variables when `allowVariables` is true.
- **`url`** - URL input with validation. Supports variables when `allowVariables` is true.
- **`number`** - Numeric input with optional min/max constraints.
- **`textarea`** - Multi-line text input. Supports variables when `allowVariables` is true and configurable rows.
- **`color`** - Color picker that outputs hex color values (e.g., `#FF0000`).
- **`select`** - Dropdown selection from predefined options.
- **`checkbox`** - Boolean checkbox input.
- **`switch`** - Toggle switch for boolean values.
- **`slider`** - Numeric slider with min, max, and step values.
- **`file`** - File path input with file browser dialog.

#### Field Configuration Examples

**Text Input with Variables**

```json
{
	"key": "username",
	"label": "Username",
	"type": "text",
	"placeholder": "Enter username",
	"helperText": "Supports variables like {{username}}"
}
```

**Textarea with Custom Rows**

```json
{
	"key": "message",
	"label": "Message",
	"type": "textarea",
	"placeholder": "Enter your message",
	"rows": 6,
	"helperText": "Multi-line text with variable support"
}
```

**Number with Constraints**

```json
{
	"key": "volume",
	"label": "Volume",
	"type": "number",
	"defaultValue": 50,
	"min": 0,
	"max": 100
}
```

**Slider Input**

```json
{
	"key": "brightness",
	"label": "Brightness",
	"type": "slider",
	"defaultValue": 100,
	"min": 0,
	"max": 255,
	"step": 5
}
```

**Color Picker**

```json
{
	"key": "backgroundColor",
	"label": "Background Color",
	"type": "color",
	"defaultValue": "#000000",
	"helperText": "Choose a background color"
}
```

**Select Dropdown**

```json
{
	"key": "mode",
	"label": "Mode",
	"type": "select",
	"defaultValue": "normal",
	"allowTyping": true,
	"options": [
		{ "label": "Normal", "value": "normal" },
		{ "label": "Fast", "value": "fast" },
		{ "label": "Slow", "value": "slow" }
	]
}
```

Set `allowTyping` to let users type custom values in addition to the provided options. The dropdown list still appears as suggestions.

Set `allowVariables: true` to enable template variables (e.g., `{{username}}`) for a specific action field. When omitted, variables are not enabled—even for `select` fields with `allowTyping`.

**Checkbox**

```json
{
	"key": "enableNotifications",
	"label": "Enable Notifications",
	"type": "checkbox",
	"defaultValue": true
}
```

**Switch Toggle**

```json
{
	"key": "autoStart",
	"label": "Auto Start",
	"type": "switch",
	"defaultValue": false,
	"helperText": "Automatically start on load"
}
```

**File Input**

```json
{
	"key": "audioFile",
	"label": "Audio File",
	"type": "file",
	"helperText": "Select an audio file to play"
}
```

### Variables

Variables define data that your plugin provides to Lumia Stream:

Do not prefix variable names with your plugin name. Lumia automatically namespaces them.

```json
{
	"config": {
		"variables": [
			{
				"name": "follower_count",
				"system": true,
				"origin": "twitch",
				"allowedPlaces": ["chat", "overlay"],
				"description": "Current number of followers",
				"value": 0,
				"example": "follower_count"
			},
			{
				"name": "last_follower",
				"system": true,
				"origin": "twitch",
				"allowedPlaces": ["chat", "overlay", "alert"],
				"description": "Username of the most recent follower",
				"value": "",
				"example": "last_follower"
			}
		]
	}
}
```

### Alerts

Alerts define events that your plugin can trigger:

```json
{
	"config": {
		"alerts": [
			{
				"title": "New Follower",
				"key": "follow",
				"acceptedVariables": ["follower_count", "last_follower"],
				"defaultMessage": "{{last_follower}} just followed! Welcome!",
				"variationConditions": []
			},
			{
				"title": "Stream Started",
				"key": "streamStart",
				"acceptedVariables": ["stream_title", "game"],
				"defaultMessage": "Stream is now live! Playing {{game}}"
			}
		]
	}
}
```

Optional alert defaults can be provided under `defaults` to control how Lumia initializes the base alert state. For example, `disableBaseAlert` can enforce variations-only behavior.

```json
{
	"title": "High CPU Usage",
	"key": "cpu_high",
	"defaultMessage": "",
	"defaults": {
		"disableBaseAlert": true
	}
}
```

#### Alert Variations (`variationConditions`)

Use `variationConditions` when an alert can fire with multiple sub-types (for example, different tiers of a subscription or thresholds of a donation) and you want creators to configure each variation independently.

- **`type`** – One of the condition identifiers exposed by `LumiaVariationConditions` (see `lumia-types/src/alert.types.ts:6`). Examples: `EQUAL_SELECTION`, `GIFT_SUB_EQUAL`, `GREATER_NUMBER`, `RANDOM`.
- **`description`** _(optional)_ – Helper text shown in the Lumia UI.
- **`selections`** _(optional)_ – Only used with `EQUAL_SELECTION`; supplies the dropdown values the creator can pick from.
  - **`label`** – How the option appears in the Lumia UI.
  - **`value`** – The literal tier/value you expect to receive at runtime (compared against `dynamic.value`).
  - **`message`** _(optional)_ – Override for `defaultMessage` when this variation is active.

Example manifest entry with variations:

```json
{
	"title": "Gifted Membership",
	"key": "giftedMembership",
	"defaultMessage": "{{gifter}} gifted a membership!",
	"acceptedVariables": ["gifter", "recipient", "gift_count"],
	"variationConditions": [
		{
			"type": "EQUAL_SELECTION",
			"description": "Tier level (compares against dynamic.value).",
			"selections": [
				{
					"label": "Single gift",
					"value": "Tier1"
				},
				{
					"label": "Premium tier",
					"value": "Tier2",
					"message": "{{gifter}} just unlocked the premium tier!"
				}
			]
		},
		{
			"type": "GIFT_SUB_EQUAL",
			"description": "Exact gift bundle size (compares dynamic.giftAmount)."
		},
		{
			"type": "GIFT_SUB_GREATER",
			"description": "Gift bundle size or larger (compares dynamic.giftAmount)."
		}
	]
}
```

At runtime, trigger the alert with the fields expected by the selected condition types:

```ts
await this.lumia.triggerAlert({
	alert: "giftedMembership",
	dynamic: {
		value: "Tier2", // checked by EQUAL_SELECTION
		isGift: true,
		giftAmount: 5, // checked by GIFT_SUB_EQUAL / GIFT_SUB_GREATER
		gifter: "StreamerFan42",
		recipient: "LuckyViewer",
		gift_count: 5,
	},
	extraSettings: {
		gifter: "StreamerFan42",
		recipient: "LuckyViewer",
		gift_count: 5,
	},
});
```

Pass alert variables through both `dynamic` and `extraSettings` so templates and variations have the same data.

If no matching selection is found for the provided condition values (or no `dynamic` payload is supplied), Lumia falls back to the base alert configuration and `defaultMessage`.

To also show a plugin-triggered alert inside the Event List, opt in explicitly:

```ts
await this.lumia.triggerAlert({
	alert: "giftedMembership",
	showInEventList: true,
	extraSettings: {
		gifter: "StreamerFan42",
		recipient: "LuckyViewer",
		gift_count: 5,
	},
});
```

Tip: `LumiaDynamicCondition` in `lumia-types/src/alert.types.ts:99` lists every property (`value`, `currency`, `subMonths`, `giftAmount`, etc.) that variation checkers use.
},
{
"label": "10-pack",
"value": 10,
"message": "{{gifter}} unleashed 10 memberships! Show some love!"
}
]
}
]
}

````

At runtime, trigger the alert with the variation value that matches one of the configured selections:

```ts
await this.lumia.triggerAlert({
	alert: "giftedMembership",
	dynamic: {
		name: "giftCount",
		value: 5,
		gifter: "StreamerFan42",
		recipient: "LuckyViewer",
		gift_count: 5
	},
	extraSettings: {
		gifter: "StreamerFan42",
		recipient: "LuckyViewer",
		gift_count: 5
	}
});
````

If no matching selection is found for the provided value (or `dynamic` is omitted), Lumia defaults to the base alert configuration and `defaultMessage`.

## Complete Example

Here's a complete manifest for a hypothetical Discord integration plugin:

```json
{
	"id": "discord_integration",
	"name": "Discord Integration",
	"version": "2.1.0",
	"author": "Lumia Stream",
	"email": "dev@lumiastream.com",
	"website": "https://lumiastream.com/plugins/discord",
	"repository": "https://github.com/LumiaStream/discord-plugin",
	"description": "Integrate your Discord server with Lumia Stream",
	"license": "MIT",
	"lumiaVersion": "^9.0.0",
	"keywords": "discord, chat, community, notifications",
	"category": "platforms",
	"icon": "discord-icon.png",
	"changelog": "# Changelog\n\n## 2.1.0\n- Added voice channel activity tracking\n- Improved message filtering\n- Bug fixes for role mentions\n\n## 2.0.0\n- Complete rewrite with new Discord API\n- Added slash command support\n- Enhanced security",
	"config": {
		"settings": [
			{
				"key": "botToken",
				"label": "Bot Token",
				"type": "password",
				"placeholder": "Your Discord bot token",
				"helperText": "Create a bot application at https://discord.com/developers/applications",
				"required": true
			},
			{
				"key": "guildId",
				"label": "Server ID",
				"type": "text",
				"placeholder": "Your Discord server ID",
				"helperText": "Right-click your server name and select 'Copy Server ID'",
				"required": true,
				"validation": {
					"pattern": "^[0-9]{17,19}$"
				}
			},
			{
				"key": "channels",
				"label": "Monitored Channels",
				"type": "textarea",
				"placeholder": "Channel IDs, one per line",
				"helperText": "Leave empty to monitor all channels",
				"defaultValue": ""
			},
			{
				"key": "messageFilter",
				"label": "Message Filter",
				"type": "select",
				"defaultValue": "all",
				"options": [
					{ "label": "All Messages", "value": "all" },
					{ "label": "Mentions Only", "value": "mentions" },
					{ "label": "Commands Only", "value": "commands" }
				]
			},
			{
				"key": "enableVoiceTracking",
				"label": "Track Voice Activity",
				"type": "toggle",
				"defaultValue": false,
				"helperText": "Monitor voice channel joins/leaves"
			}
		],
		"actions": [
			{
				"type": "send_message",
				"label": "Send Message",
				"description": "Send a message to a Discord channel",
				"fields": [
					{
						"key": "channelId",
						"label": "Channel ID",
						"type": "text",
						"required": true
					},
					{
						"key": "message",
						"label": "Message",
						"type": "textarea",
						"required": true,
						"validation": {
							"maxLength": 2000
						}
					}
				]
			},
			{
				"type": "update_status",
				"label": "Update Bot Status",
				"description": "Update the bot's activity status",
				"fields": [
					{
						"key": "activity",
						"label": "Activity Type",
						"type": "select",
						"options": [
							{ "label": "Playing", "value": "PLAYING" },
							{ "label": "Listening", "value": "LISTENING" },
							{ "label": "Watching", "value": "WATCHING" },
							{ "label": "Streaming", "value": "STREAMING" }
						]
					},
					{
						"key": "text",
						"label": "Status Text",
						"type": "text",
						"placeholder": "What is the bot doing?"
					}
				]
			}
		],
		"variables": [
			{
				"name": "member_count",
				"system": true,
				"origin": "discord",
				"allowedPlaces": ["chat", "overlay"],
				"description": "Total number of server members",
				"value": 0,
				"example": "member_count"
			},
			{
				"name": "online_count",
				"system": true,
				"origin": "discord",
				"allowedPlaces": ["chat", "overlay"],
				"description": "Number of online members",
				"value": 0,
				"example": "online_count"
			},
			{
				"name": "voice_count",
				"system": true,
				"origin": "discord",
				"allowedPlaces": ["chat", "overlay"],
				"description": "Number of members in voice channels",
				"value": 0,
				"example": "voice_count"
			},
			{
				"name": "last_message",
				"system": true,
				"origin": "discord",
				"allowedPlaces": ["chat", "overlay", "alert"],
				"description": "Content of the most recent message",
				"value": "",
				"example": "last_message"
			},
			{
				"name": "last_user",
				"system": true,
				"origin": "discord",
				"allowedPlaces": ["chat", "overlay", "alert"],
				"description": "Username of the last message author",
				"value": "",
				"example": "last_user"
			}
		],
		"alerts": [
			{
				"title": "New Message",
				"key": "message",
				"acceptedVariables": ["last_message", "last_user"],
				"defaultMessage": "{{last_user}}: {{last_message}}"
			},
			{
				"title": "Member Joined",
				"key": "memberJoin",
				"acceptedVariables": ["member_count", "last_user"],
				"defaultMessage": "{{last_user}} joined the Discord! ({{member_count}} total)"
			},
			{
				"title": "Voice Channel Activity",
				"key": "voiceActivity",
				"acceptedVariables": ["voice_count", "last_user"],
				"defaultMessage": "{{last_user}} joined voice ({{voice_count}} in voice)"
			}
		]
	}
}
```

## Validation

The SDK includes manifest validation. Common validation errors:

- **Invalid semver**: Version must follow semantic versioning
- **Missing required fields**: All required fields must be present
- **Invalid category**: Category must be one of the allowed values
- **Duplicate keys**: Setting/action/variable keys must be unique
- **Invalid types**: Field types must be valid
- **Circular dependencies**: Alert conditions cannot create loops

## Best Practices

1. **Unique IDs**: Use your organization/username prefix (e.g., "mycompany-plugin-name")
2. **Semantic Versioning**: Follow semver for version numbers
3. **Clear Descriptions**: Write descriptive labels and help text
4. **Sensible Defaults**: Provide good default values
5. **Validation**: Use validation rules to prevent user errors
6. **Documentation**: Include comprehensive descriptions and examples
7. **Testing**: Test your manifest with the validation tools
8. **Tutorials**: Provide clear `settings_tutorial` and `actions_tutorial` steps
9. **No Test Controls**: Avoid test-only settings and actions
10. **Retry Discipline**: Use exponential backoff and stop rapid retry loops
11. **Minimal Logs**: Log errors and explicit user actions only

## Localization

Currently, manifests support English only. Localization support is planned for future releases.
