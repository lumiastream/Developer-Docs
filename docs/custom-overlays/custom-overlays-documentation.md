---
title: Documentation
sidebar_position: 2
---

# 🧩 Custom Overlay Layer

This layer is a real-time, configurable overlay component with support for dynamic events. It includes five main tabs:

- **HTML** – Defines the static layout of the UI
- **CSS** – Custom styling rules
- **JS** – Handles real-time logic and event listeners
- **Configs** – Input schema used to customize the component
- **Data** – Holds the actual values for the defined fields

## Chat GPT Lumia Overlay Assistant

We offer a Chat GPT Lumia overlay assistant that can help you with your custom overlay creation.
Ask it a question like Create an overlay that changes color every time a new chat command comes in.
It knows our documentation and can help out a ton

Access it here: [Chat GPT Lumia Overlay Assistant](https://chatgpt.com/g/g-6760d2a59b048191b17812250884971b-lumia-custom-code-and-custom-overlays-assistant/c/684d9156-b394-8004-82ef-313b88b6d85f)

---

## 🖼️ HTML Tab

Defines the layout of the overlay visible to users:

```html
<div style="padding:1em; font-family:sans-serif;">
	<h3 id="msg">Waiting for data…</h3>
	<h4>Data:</h4>
	<div id="data"></div>
</div>
```

---

## 🎨 CSS Tab

Customize the visual style of your overlay:

```css
#msg {
	font-weight: bold;
	color: #ff3b88;
}
```

---

## 🧠 JS Tab

Javascript handles initialization and real-time event updates for your overlay:

```js
// CODE_ID is used to filter the custom.overlay-content to ignore data intended for other custom code from Lumia Stream
const CODE_ID = window.CODE_ID || "mycode";
const configs = window.DATA || {};

window.addEventListener("onEventReceived", (ev) => {
	const type = ev.detail.type;
	const payload = ev.detail.data;

	if (type === "alert.chat") {
		log("New chat message", payload);
	}
	// Check for codeId when the type is custom.overlay-content. This is only needed if Lumia Stream needs to send information to your overlays
	else if (type === "custom.overlay-content") {
		log("This is for my code");
	}
});
```

### What This Does

- Displays the initial configs data provided via `window.DATA`
- Appends incoming events to the screen in real time

### 📡 Event Handling

Only events selected in the data tab **"events": []** array will be received by the overlay.

### Example Event

If an event with type `alert.chat` is dispatched, first make sure in the data tab it has

```json
{
	"event": ["alert.chat"]
}
```

And then in JS

```js
window.addEventListener("onEventReceived", (ev) => {
	const type = ev.detail.type;
	const payload = ev.detail.data;

	if (type === "alert.chat") {
		const username = ev.detail?.data?.info?.username;
		const avatar = ev.detail?.data?.info?.avatar;
		const message = ev.detail?.data?.info?.message;

		toast(`New chat message received from ${username}. They said ${message}`);
	}
});
```

### Showing Toasts

You can display toast notifications and log messages using the following:

```js
toast("Message");

// Or you can pass in the type of toast to show
toast("Message", "info");
toast("Message", "success");
toast("Message", "warning");
toast("Message", "error");
```

### Showing Logs in console

You can display log information in your console

```js
log("Message");

// Or you can pass in the type of log to show
log("Message", "log");
log("Message", "info");
log("Message", "debug");
log("Message", "error");
```

### Calling Commands in Lumia Stream using the OverlayAPI

We expose an api that allows you to call a chat command and update variables

This can be used under `window.OverlayAPI.callCommand`

```js
window.OverlayAPI.callCommand("caught");

// Or you can pass local variables to your command as well that will only be used for this instance. This will not be a global variable
window.OverlayAPI.callCommand("caught", {
	username: "lumia",
	pokemon: "lugia",
	shiny: true,
});
```

### Setting/Updating Global Variables in Lumia Stream

We expose an api that allows you to set a variable within Lumia Stream that can be used to save data to Lumia Stream and show it within commands, chatbots, or even other Overlay Layers.

We pull in varaibles dynamically so that overlays that are not using variables will not need to get the data for variables that it does not care about. This means that if you create a brand new variable within an overlay you may need to save and refresh so that it updates to pull in the new variable. But after the variable is created it will dynamically change.

This can be used under `window.OverlayAPI.setVariable`

```js
window.OverlayAPI.setVariable("pokemon_caught", 151);
```

### Using Persistent Storage in Lumia Stream

We expose an api that allows you to get, update, and delete storage tied to your `codeId`. This will persist across Lumia Stream and can be used to communicate with your overlays in any place: OBS, Browser, Meld, etc. It works different than localStorage where localStorage only saves for the browser / streaming studio. If you would like to persist data this is the recommended way other than using it with variables. The only issue is that actual Lumia Stream does not have access to this storage currently. Only your Overlays will have access

This can be used under `window.OverlayAPI.saveStorage`, `window.OverlayAPI.getStorage`, `window.OverlayAPI.deleteStorage`

```js
// Save an item to storage
await window.OverlayAPI.saveStorage("pokemon_caught", 151);

// Get an item from stoage
const pokemonCaught = await window.OverlayAPI.getStorage("pokemon_caught");

// Delete an item from stoage
await window.OverlayAPI.deleteStorage("pokemon_caught");
```

### Data Storage Options in Custom Overlays

When building custom overlays, you have several options for storing and sharing data. Each method has its own use cases, benefits, and limitations:

#### 1. `localStorage`

- **Scope:** Only available in the browser where the overlay is loaded (e.g., OBS, browser source, or streaming studio).
- **Persistence:** Data persists across page reloads in the same browser, but is not shared between different browsers or devices.
- **Use Case:** Storing user preferences or temporary data that doesn't need to sync across devices or overlays.
- **Limitations:** Not accessible by Lumia Stream itself or other overlays running elsewhere.

#### 2. **Lumia Stream Variables**

- **Scope:** Global within Lumia Stream. Variables can be accessed and updated by overlays, chatbots, commands, and other Lumia features.
- **Persistence:** Saved on the server and available across all overlays and sessions.
- **Use Case:** Sharing data between overlays, commands, and chatbots, or persisting state across restarts.
- **Limitations:** All variables are global—be careful with naming to avoid conflicts.

#### 3. `OverlayAPI.callCommand`

- **Scope:** Triggers a Lumia Stream command, optionally passing custom data.
- **Persistence:** Depends on your command logic. You can implement your own storage or logic inside the command.
- **Use Case:** Advanced workflows where you want to process data or trigger actions in Lumia Stream, possibly updating variables or storage as part of the command.
- **Limitations:** Requires custom command setup in Lumia Stream.

#### 4. `OverlayAPI.saveStorage` / `getStorage` / `deleteStorage`

- **Scope:** Persistent storage tied to your overlay's `codeId`. Data is saved on the local Lumia Stream server and is accessible from any overlay instance (e.g., OBS, browser, Meld) running on the same server.
- **Persistence:** Data persists across overlay reloads and is shared between all overlay clients connected to the same Lumia Stream instance.
- **Use Case:** Storing overlay-specific state or data that needs to be shared between multiple overlay clients or sessions.
- **Limitations:**
  - Not accessible by Lumia Stream commands or chatbots (only overlays can read/write).
  - Not synced to the cloud or between different Lumia Stream servers.

#### Summary Table

| Method                        | Scope/Access                | Persistence     | Accessible By      | Best For                                  |
| ----------------------------- | --------------------------- | --------------- | ------------------ | ----------------------------------------- |
| `localStorage`                | Per browser/tab             | Browser reloads | Overlay only       | User preferences, local state             |
| Lumia Stream Variables        | Global (Lumia Stream)       | Server-wide     | Overlays, commands | Shared/global state, cross-feature access |
| `OverlayAPI.callCommand`      | Custom (via command logic)  | Custom          | Overlay & commands | Advanced workflows, custom logic          |
| `OverlayAPI.saveStorage` etc. | Per overlay `codeId`/server | Server (local)  | Overlays only      | Overlay-specific persistent data          |

> **Tip:** Choose the storage method that best fits your data's scope and persistence needs. For most overlay-to-overlay communication, use variables or `saveStorage`. For global state, prefer variables. For overlay-local state, use `localStorage` or `saveStorage`.

---

## 📋 Configs Tab

The Configs fields define what users can customize in the layer.
They appear on the right-hand side of the UI under the `Configuration` section unless a field is marked `hidden: true`.

A field object can now contain up to five useful properties:

| Property        | Required | Purpose                                                                                                                                                                                                                                                                                           | Example                                                           |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **`type`**      | ✅       | UI control to render. Must be one of the `FieldType` enum values (`input`, `number`, `checkbox`, `dropdown`, `multiselect`, `colorpicker`).                                                                                                                                                       | `"type": "dropdown"`                                              |
| **`label`**     | ✅       | Human-readable name shown in the sidebar.                                                                                                                                                                                                                                                         | `"label": "Favorite Color:"`                                      |
| **`value`**     | ❌       | Default value that appears the first time the user opens the overlay (also pre populates `window.DATA`). Omit it to leave the field blank/unchecked on first load.                                                                                                                                | `"value": 18`                                                     |
| **`options`**   | ☑️\*     | Key value map of selectable choices. Required **only** for `dropdown` and `multiselect`; ignored for other types.                                                                                                                                                                                 | `"options": { "twitch": "Twitch", "youtube": "YouTube" }`         |
| **`visibleIf`** | ❌       | **Conditional render rule**. Field is shown **only if** `window.DATA[visibleIf.key]` strictly equals one of the values in `visibleIf.equals`.                                                                                                                                                     | `"visibleIf": { "key": "targetKey", "equals": ["yes", "maybe"] }` |
| **`hidden`**    | ❌       | **Hard-hide rule.** When set to `true`, the field is **never displayed** in the Configs sidebar, preventing end users from altering it. The value still flows into `window.DATA`, so the overlay can rely on it internally.<br>Useful for locking event subscriptions or other advanced settings. | `"hidden": true`                                                  |

### 🔑 Keys vs. Field Objects

Before looking at the individual properties (type, label, value, options), remember that the JSON key itself is critical:

```jsonc
{
	"age": {
		/* field object */
	},
	"platform": {
		/* field object */
	}
}
```

| Concept                             | What it is                                       | Where it shows up                                                                                  |
| ----------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| **Key** (`"age"`, `"platform"`, …)  | The property name that wraps a field object      | Becomes `window.DATA.age`, `window.DATA.platform`, etc. — this is what your JS code reads & writes |
| **Label** (`"Age:"`, `"Platform:"`) | UI text shown in the sidebar next to the control | **Only** visible to the user; never appears in `window.DATA`                                       |

> Rule of thumb: Choose short, machine-friendly keys (no spaces, camelCase is fine). Use labels for anything human-readable.

### Supported Field Types

| type            | UI Control            |
| --------------- | --------------------- |
| `"input"`       | Single-line text box  |
| `"number"`      | Numeric input spinner |
| `"checkbox"`    | Checkbox selection    |
| `"dropdown"`    | Select menu           |
| `"multiselect"` | Multi-select box      |
| `"colorpicker"` | Color picker widget   |

### Sample Config fields

```json
{
	"txt": {
		"type": "input",
		"label": "Name:"
	},
	"last": {
		"type": "input",
		"label": "Last Name:",
		"value": "Abc"
	},
	"partner": {
		"type": "checkbox",
		"label": "Partner:",
		"value": false
	},
	"age": {
		"type": "number",
		"label": "Age:",
		"value": 18
	},
	"color": {
		"type": "colorpicker",
		"label": "Favorite Color:"
	},
	"subcolor": {
		"type": "colorpicker",
		"label": "Sub-color:",
		"visibleIf": {
			"key": "color",
			"equals": "blue"
		}
	},
	"platform": {
		"type": "dropdown",
		"label": "Platform:",
		"options": {
			"twitch": "Twitch",
			"youtube": "Youtube",
			"kick": "Kick"
		}
	}
}
```

### Visible If Conditional Fields

The `visibleIf` field is a conditional statement that determines whether a field should be visible or not based on a condition.
The `visibleIf` field is a JSON object with two keys: `key` and `equals`.

The `key` key is a string that represents the name of the field whose value should be used in the conditional statement.
The `equals` key is a string, number, boolean, or an array that represents the value of the field whose value should be used in the conditional statement.

#### Single Prmitive Equals Example

```json
{
	"hasAlerts": {
		"type": "checkbox",
		"label": "Show alerts"
	},
	"title": {
		"type": "input",
		"label": "Title",
		"visibleIf": {
			"key": "hasAlerts",
			"equals": true
		}
	}
}
```

#### Multiple Prmitive Equals Example

```json
{
	"color": {
		"type": "input",
		"label": "Colors"
	},
	"subcolor": {
		"type": "input",
		"label": "Subcolors",
		"visibleIf": {
			"key": "color",
			"equals": ["red", "blue", "green"]
		}
	}
}
```

### 🧩 Events Multiselect

The `events` field is a **multiselect** input, typically rendered as a list of checkboxes or a dropdown. It allows users to select which event types the overlay should listen to.

### Available Events Options

| Value         | Label          |
| ------------- | -------------- |
| alert.hfx     | HFX            |
| alert.chat    | Chat messages  |
| alert.event   | Alerts         |
| light.virtual | Virtual lights |

> 💡 Performance Tip: Only the selected events will be delivered to the overlay. Unselected event types are ignored, improving efficiency.
> 💡 The typescript types for each alert is down below: under Event Types
> 💡 There is another default event that all custom overlays are automatically subscribed to. This is the `custom.overlay-content` event. This is a special event that allows you to send custom content to the overlay from Lumia Stream and will only send to your specific codeId.

---

## 📊 Data Tab

The `data` fields are the current values that the user has selected. These can have default values by adding them in to the initial Data Tab. This data is passed to your Javascript code that can be accessed under `window.DATA`.

---

## ✅ Use Cases

- Custom stream overlays for Twitch, YouTube, or other platforms
- Real-time dashboards for alerts and interactions
- Interactive visuals triggered by chat or external events

## 📤 Sending Data from Lumia Stream

Lumia Stream allows you to send data from your application to the overlay. This can be used to allow communication from Lumia Stream without needing variables. The way to do this is through either the `Send Custom Overlay Content` Overlay action or by using the `overlaySendCustomContent` action in your Custom Javascript code within a command. When using `Send Custom Overlay Content` Overlay action or `overlaySendCustomContent` it is required that you include the `codeId` otherwise there is no way the overlay will receive your content. The overlay will always only send to custom overlay layers with your `codeId`. An example of this would be in a command custom javascript code send:

```js
async function() {
  overlaySendCustomContent({ codeId: "mycode", content: '{"type": "add", "value": "{{username}} - {{message}}"' });

  // Make sure you call done() to avoid memory leaks
  done();
}
```

Then in your Custom Overlay JS Tab you would listen to it and parse it with:

```js
const CODE_ID = window.CODE_ID || "mycode";
const configs = window.DATA || {};

window.addEventListener("onEventReceived", (ev) => {
	const type = ev.detail.type;
	const payload = ev.detail.data;

	if (type === "custom.overlay-content") {
		const content = JSON.parse(payload.content);
		log("This is for my code", content);
	}
});
```

## Persisting Data

The recommended way to persist data in your custom overlay is by using the provided `OverlayAPI.saveStorage` and `OverlayAPI.setVariable` methods. These allow you to store data that is scoped to your overlay's `codeId` and can be accessed across sessions, without relying on browser `localStorage` or global Lumia Stream variables.

Here's an example using `OverlayAPI.saveStorage` to persist a counter:

```js
const countEl = document.getElementById("count");
let counter = 0;

load();
// We need an async function when loading since getStorage is asynchronous
async function load() {
	counter = await OverlayAPI.getStorage("counter");
	render();
}

/* --- helper -----------------------------------------------------*/
async function render() {
	countEl.textContent = counter;
	await OverlayAPI.saveStorage("counter", counter); // persist
}

/* --- listen only to chat ---------------------------------------*/
window.addEventListener("onEventReceived", (ev) => {
	if (ev.detail?.type !== "alert.chat") return;

	const msg = ev.detail.data?.info?.message?.trim().toLowerCase();
	const user = ev.detail.data?.info?.username ?? "Someone";
	if (msg === "!count") {
		counter++;
		render();
	}
});
```

### Showing variables in your code

You can display the value of a variable or storage item in your overlay by directly accessing it the same way as you would do in a chatbot message, using double curly braces `{{myvar}}`. We will replace the variable in your HTML, CSS, and JS every time the variable changes. Just make sure it's a variable that exist in Lumia when the overlay loads as it will only update variables that exist. If you need to create a variable dynamically, create it in the overlay but then prompt to reload after the initial load. You can check to see if the variable exists within JS.

Variables can be used in these examples

```html
<div>{{myvar}}</div>
```

```css
div {
	color: {{myvarcolor}};
}
```

```js
const myvar = "{{myvar}}";
```

## Using JS Game Engines

Our Overlays will work with various Game Engines including, but not limited to Phaser.js, Pixi.js, Three.js, and more.

## 🧪 Tips

- Use the **Events** multiselect to limit which events trigger updates—great for debugging or focus.
- Always sanitize HTML content if displaying user-generated input.
- Leverage custom CSS to match your stream or brand style.
- Always use Code ID in your code when you need data from Lumia Stream outside of variables
- In the window.addEventListener always use if (type === intendedType) so that you do not get data and events that you do not need.
- In custom code or overlay actions prefer to send data directly to the overlay without the store or variables if you do not need to persist the data

## Event Types

```ts
export interface AlertChatEvent {
	type: "alert.chat";
	data: {
		origin: string; // "twitch" | "kick" | …
		info: {
			id: string;
			username: string;
			displayname: string;
			channel: string; // "#channel"
			avatar: string; // URL
			message: string; // full chat line
			color: string; // hex string, e.g. "#00FF7F"
			badges: string[]; // badge image URLs
			badgesRaw: string; // e.g. "broadcaster/1,sub/12"
			emotesRaw: string;
			emotesPack: Record<string, unknown>;
			reply: unknown | null; // null if not a reply
			lumiauserlevels: number[]; // The number value of userLevels
			userLevels: {
				isSelf: boolean;
				mod: boolean;
				vip: boolean;
				tier3: boolean;
				tier2: boolean;
				subscriber: boolean;
				regular: boolean;
				follower: boolean;
				anyone: boolean;
			};
		};
	};
}

export interface AlertEventEvent {
	type: "alert.event";
	data: {
		type: "alert";
		alert: {
			alert: string;
			dynamic: {
				value: number | string;
			};
			extraSettings: {
				username: string;
				displayname: string;
				userId: number;
				avatar: string | null;
				timestamp: string;
				site: string; // "kick" | "twitch" | …
				checkTimingType: boolean;
				timingType: string;
				duration: number;
			};
			fromLumia: boolean; // true if internally generated
		};
	};
}

export interface LightVirtualEvent {
	type: "light.virtual";
	data: {
		uuid: string;
		brightness: number; // 0-100
		color: { r: number; g: number; b: number };
		transition: number; // ms
		delay: number; // ms
		duration: number; // ms
	};
}

export interface AlertHfxEvent {
	type: "alert.hfx";
	data: {
		layer: string;
		content: string; // UUID of the HFX asset
		command: string;
		origin: string; // "hudfx" | "command" | …
		playAudio: boolean;
		volume: number; // 0-1
		duration: number; // asset length (ms)
		username: string;
		message: string;
		avatar: string; // URL
		commandDuration: number; // same as duration
	};
}
```

## 📦 Templates

You can get started quickly with one of the two built-in templates:

- **Custom Chatbox** – A base template for building a chatbox overlay that listens to messages.
- **Custom Alert** – A template for creating a fully custom alert layer that responds to selected events.
