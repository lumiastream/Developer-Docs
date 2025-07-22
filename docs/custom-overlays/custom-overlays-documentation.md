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
	<!-- You can use variables directly within HTML -->
	<div>{{myvar}}</div>
</div>
```

---

## 🎨 CSS Tab

Customize the visual style of your overlay:

```css
#msg {
	font-weight: bold;
	/* You can use variables directly within CSS */
	color: "{{mycolor}}";
}
```

---

## 🧠 JS Tab

Javascript handles initialization and real-time event updates for your overlay:

```js
// window.Overlay is our primary api, you can use it with window.Overlay or just Overlay

// Overlay.data contains he data that's submitted from the user using your overlay that they're allowed to fill out based on the fields in the config tab
console.log(Overlay.data);

// Call a command in Lumia Stream and pass variables for the command to use. In the command you can reference {{secret}} since that's what we're passing in
Overlay.callCommand('mycommand', { secret: 'password' });

// Send a chatbot message to the corresponding platform either as the streamer or the bot. Leave the platform as null to trigger on all connected platforms
Overlay.chatbot({ message: 'This works', platform: 'twitch', chatAsSelf: false  });

// If the variables isn't already created it will create one.
await Overlay.setVariable('myvar', 'this works');

// Retrieves a variable
await Overlay.getVariable('myvar');

// If the variable was not previously created it may not automatically be replaced in your code until after the code is saved and reopened. If the overlay was previously made then it will update immediately. It may be helpful to add a check in your code to see if variable is already auto updating or not and toast the user to refresh the overlay
const usedMyVar = "{{myvar}}";

// You can call await without an async function since an async function is already wrapped around all the JS code

// Save an item to storage
await Overlay.saveStorage('mydata', 151);

// Get an item from stoage
const pokemonCaught = await Overlay.getStorage('mydata');

// Delete an item from stoage
await Overlay.deleteStorage('mydata');

Overlay.on('chat', (data) => {
	const username = data.username;
	const avatar = data.avatar;
	const message = data.message;
	toast(`New chat message received from ${username}. They said ${message}`);
});
Overlay.on('alert', (data) => {
	console.log('alert', data);
	const settings = data.extraSettings;
	const username = settings?.username || 'unknown';
	const amount = data.dynamic.value;
	const avatar = settings?.avatar;

	if (data.alert === 'twitch-subscriber') {
		if (data.dynamic.isGift) {
			console.log(`${username} sent ${data.dynamic.giftAmount} with a tier ${settings.subPlan} sub to ${settings.recipients ?? settings.recipient}`);
		} else if (data.dynamic.isResub) {
			console.log(`${username} shared their ${settings.subPlan} sub. They've been subscribed for ${data.dynamic.subMonths} months`);
		} else {
			console.log(`${username} subscribed with a tier ${settings.subPlan} sub`);
		}
	}

	if (data.alert === 'twitch-raid') {
		console.log(`${username} just raided with ${data.dynamic.value} viewers`);
	}

	if (data.alert === 'kick-follower') {
		console.log(`${username} just followed on Kick`);
	}
});
Overlay.on('hfx', (data) => {
	const username = data.username;
	const command = data.command;
	const message = data.message; // If the HFX was triggered with a message
	const avatar = data.avatar;

	console.log(`${username} just triggered HFX ${command}`);
});
Overlay.on('virtuallight', (data) => {
	console.log('virtuallight', data);
	const viratlLightId = data.uuid;
	const brightness = data.brightness;

	// Power sometimes does not come through if the light is just changing colors
	if (data.color && (data.power || data.power === 'undefined')) {
		const { r, g, b} = data.color;
		console.log(`Light is changing to the color to rgb(${r},${g},${b})`);
	} else if (data.power === false) {
		console.log(`Light is turning off`);
	}
	const
});
// Only codeId that matches on both Overlays and Lumia will trigger this listener. codeId can only contain letters, numbers, hyphens, and underscores. Max 25 characters.
Overlay.on('overlaycontent', (data) => {
	const content = data.content;
	console.log(`Content has been sent from Lumia Stream ${content}`);
});
```

We wrap all the code in an async function, so you can use await in your root level of the code without wrapping it in an async funtion. This example will have no problem

```js
const variable = await Overlay.getStorage("mykey");
console.log(variable);
```

### What This Does

- Displays the initial data provided via `Ovelray.data`
- Accepts incoming events in real time

### 📡 Event Handling

Use the `Overlay.on` to listen to events

### Example Event

If an event with type `chat` is dispatched and you have Overlay.on('chat') within your code it will send it to that listener

```js
Overlay.on("chat", (data) => {
	console.log("chat", data);
});
Overlay.on("alert", (data) => {
	console.log("alert", data);
});
Overlay.on("hfx", (data) => {
	console.log("hfx", data);
});
Overlay.on("virtuallight", (data) => {
	console.log("virtuallight", data);
});
Overlay.on("overlaycontent", (data) => {
	console.log("overlaycontent", data);
});
```

When using Overlay.on the data tab must have the corresponding OverlayListener types:

### OverlayListener types

| Value          | Label                  |
| -------------- | ---------------------- |
| chat           | Chat messages          |
| alert          | Alerts                 |
| hfx            | HFX                    |
| virtuallight   | Virtual lights         |
| overlaycontent | Custom Overlay Content |

> 💡 Performance Tip: Only the selected events will be delivered to the overlay.
> 💡 The typescript types for each alert is within the types tab
> 💡 `overlaycontent` is a default event that will always be on for all custom overlays that are automatically subscribed to whether it's in the data tab or not. This is a special event that allows you to send custom content to the overlay from Lumia Stream and will only send to your specific codeId.

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
console.log("Message");
```

### Calling Commands in Lumia Stream using the Overlay

We expose an api that allows you to call a chat command and update variables

This can be used under `Overlay.callCommand`

```js
Overlay.callCommand("caught");

// Or you can pass local variables to your command as well that will only be used for this instance. This will not be a global variable
Overlay.callCommand("caught", {
	username: "lumia",
	pokemon: "lugia",
	shiny: true,
});
```

### Setting/Updating Global Variables in Lumia Stream

We expose an api that allows you to set a variable within Lumia Stream that can be used to save data to Lumia Stream and show it within commands, chatbots, or even other Overlay Layers.

We pull in varaibles dynamically so that overlays that are not using variables will not need to get the data for variables that it does not care about. This means that if you create a brand new variable within an overlay you may need to save and refresh so that it updates to pull in the new variable. But after the variable is created it will dynamically change.

This can be used under `Overlay.setVariable`

```js
Overlay.setVariable("pokemon_caught", 151);
```

### Using Persistent Storage in Lumia Stream

We expose an api that allows you to get, update, and delete storage tied to your `codeId`. This will persist across Lumia Stream and can be used to communicate with your overlays in any place: OBS, Browser, Meld, etc. It works different than localStorage where localStorage only saves for the browser / streaming studio. If you would like to persist data this is the recommended way other than using it with variables. The only issue is that actual Lumia Stream does not have access to this storage currently. Only your Overlays will have access

This can be used under `Overlay.saveStorage`, `Overlay.getStorage`, `Overlay.deleteStorage`

```js
// Save an item to storage
await Overlay.saveStorage("pokemon_caught", 151);

// Get an item from stoage
const pokemonCaught = await Overlay.getStorage("pokemon_caught");

// Delete an item from stoage
await Overlay.deleteStorage("pokemon_caught");
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

#### 3. `Overlay.callCommand`

- **Scope:** Triggers a Lumia Stream command, optionally passing custom data.
- **Persistence:** Depends on your command logic. You can implement your own storage or logic inside the command.
- **Use Case:** Advanced workflows where you want to process data or trigger actions in Lumia Stream, possibly updating variables or storage as part of the command.
- **Limitations:** Requires custom command setup in Lumia Stream.

#### 4. `Overlay.saveStorage` / `getStorage` / `deleteStorage`

- **Scope:** Persistent storage tied to your overlay's `codeId`. Data is saved on the local Lumia Stream server and is accessible from any overlay instance (e.g., OBS, browser, Meld) running on the same server.
- **Persistence:** Data persists across overlay reloads and is shared between all overlay clients connected to the same Lumia Stream instance.
- **Use Case:** Storing overlay-specific state or data that needs to be shared between multiple overlay clients or sessions.
- **Limitations:**
  - Not accessible by Lumia Stream commands or chatbots (only overlays can read/write).
  - Not synced to the cloud or between different Lumia Stream servers.

#### Summary Table

| Method                     | Scope/Access                | Persistence     | Accessible By      | Best For                                  |
| -------------------------- | --------------------------- | --------------- | ------------------ | ----------------------------------------- |
| `localStorage`             | Per browser/tab             | Browser reloads | Overlay only       | User preferences, local state             |
| Lumia Stream Variables     | Global (Lumia Stream)       | Server-wide     | Overlays, commands | Shared/global state, cross-feature access |
| `Overlay.callCommand`      | Custom (via command logic)  | Custom          | Overlay & commands | Advanced workflows, custom logic          |
| `Overlay.saveStorage` etc. | Per overlay `codeId`/server | Server (local)  | Overlays only      | Overlay-specific persistent data          |

> **Tip:** Choose the storage method that best fits your data's scope and persistence needs. For most overlay-to-overlay communication, use variables or `saveStorage`. For global state, prefer variables. For overlay-local state, use `localStorage` or `saveStorage`.

---

## 📋 Configs Tab

The Configs fields define what users can customize in the layer.
They appear on the right-hand side of the UI under the `Configuration` section unless a field is marked `hidden: true`.

A field object can now contain up to five useful properties:

| Property        | Required | Purpose                                                                                                                                                                                                                                                                                            | Example                                                           |
| --------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **`type`**      | ✅       | UI control to render. Must be one of the `FieldType` enum values (`input`, `number`, `checkbox`, `dropdown`, `multiselect`, `colorpicker`).                                                                                                                                                        | `"type": "dropdown"`                                              |
| **`label`**     | ✅       | Human-readable name shown in the sidebar.                                                                                                                                                                                                                                                          | `"label": "Favorite Color:"`                                      |
| **`value`**     | ❌       | Default value that appears the first time the user opens the overlay (also pre populates `Overlay.data`). Omit it to leave the field blank/unchecked on first load.                                                                                                                                | `"value": 18`                                                     |
| **`options`**   | ☑️\*     | Key value map of selectable choices. Required **only** for `dropdown` and `multiselect`; ignored for other types.                                                                                                                                                                                  | `"options": { "twitch": "Twitch", "youtube": "YouTube" }`         |
| **`visibleIf`** | ❌       | **Conditional render rule**. Field is shown **only if** `Overlay.data[visibleIf.key]` strictly equals one of the values in `visibleIf.equals`.                                                                                                                                                     | `"visibleIf": { "key": "targetKey", "equals": ["yes", "maybe"] }` |
| **`hidden`**    | ❌       | **Hard-hide rule.** When set to `true`, the field is **never displayed** in the Configs sidebar, preventing end users from altering it. The value still flows into `Overlay.data`, so the overlay can rely on it internally.<br>Useful for locking event subscriptions or other advanced settings. | `"hidden": true`                                                  |

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

| Concept                             | What it is                                       | Where it shows up                                                                                    |
| ----------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **Key** (`"age"`, `"platform"`, …)  | The property name that wraps a field object      | Becomes `Overlay.data.age`, `Overlay.data.platform`, etc. — this is what your JS code reads & writes |
| **Label** (`"Age:"`, `"Platform:"`) | UI text shown in the sidebar next to the control | **Only** visible to the user; never appears in `Overlay.data`                                        |

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

---

## 📊 Data Tab

The `data` fields are the current values that the user has selected. These can have default values by adding them in to the initial Data Tab. This data is passed to your Javascript code that can be accessed under `Overlay.data`.

Data Tab Example

```json
{
	"userSelectedColor": "#FF00FF"
}
```

Then in your JS Tab you can access the color with `Overlay.data.userSelectedColor`
Or you can even just use it directly with variable replacement using double curly braces

JS Tab

```js
const userColor = Overlay.data.userSelectedColor;
console.log("User Color is", userColor);
// Or use it with variable replacing
const myUserColor = "{{userSelectedColor}}";
```

---

## Code ID

The codeId is primarily meant to be used when talking to Lumia Stream. It is used to store storage data, it is used when calling send overlay content that will only send to overlays with that specific code id. It can be retrieved within the overlay using `Overlay.on('overlaycontent', (data) => {...})`

The codeId can only contain letters, numbers, hyphens, and underscores with a max of 25 characters.

## ✅ Use Cases

- Custom stream overlays for Twitch, YouTube, or other platforms
- Real-time dashboards for alerts and interactions
- Interactive visuals triggered by chat or external events
- Pokemon Catching Mini Game
- Duel Overlay to show matches on stream with your viewers

## Persisting Data

The recommended way to persist data in your custom overlay is by using the provided `Overlay.saveStorage` and `Overlay.setVariable` methods. These allow you to store data that is scoped to your overlay's `codeId` and can be accessed across sessions, without relying on browser `localStorage` or global Lumia Stream variables.

Here's an example using `Overlay.saveStorage` to persist a counter:

```js
const countEl = document.getElementById("count");
let counter = 0;

load();
// We need an async function when loading since getStorage is asynchronous
async function load() {
	counter = await Overlay.getStorage("counter");
	render();
}

/* --- helper -----------------------------------------------------*/
async function render() {
	countEl.textContent = counter;
	await Overlay.saveStorage("counter", counter); // persist
}

/* --- listen only to chat ---------------------------------------*/
Overlay.on("chat", (data) => {
	const username = data.username;
	const avatar = data.avatar;
	const message = data.message;
	if (message === "!count") {
		counter++;
		render();
	}
	toast(`New chat message received from ${username}. They said ${message}`);
});
```

### Showing variables in your code

You can display the value of a variable or storage item in your overlay by directly accessing it the same way as you would do in a chatbot message, using double curly braces `{{myvar}}`. We will replace the variable in your HTML, CSS, and JS every time the variable changes. Just make sure it's a variable that exist in Lumia when the overlay loads as it will only update variables that exist. If you need to create a variable dynamically, create it in the overlay but then prompt to reload after the initial load. You can check to see if the variable exists within JS.

Variables can be used in these examples

HTML Tab

```html
<div>{{myvar}}</div>
```

CSS Tab

```css
div {
	color: {{myvarcolor}};
}
```

JS Tab

```js
const myvar = "{{myvar}}";
```

### Using variables from data tab

You can also use variables in the same way as Lumia variables from your data tab.

So if you wanted to allow changing of your background color you would set it up like this:

Configs Tab

```json
{
	"background": {
		"type": "input",
		"label": "background",
		"value": "blue"
	}
}
```

Data Tab

```json
{
	"background": "blue"
}
```

CSS Tab

```css
body {
	background: {{background}};
}
```

You can also use the same data variables in your JS, HTML, and CSS Tabs

JS Tab

```js
const myBg = "{{background}}";
```

HTML Tab

```html
<div>User selected background {{background}}</div>
```

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
Overlay.on("overlaycontent", (data) => {
	const content = JSON.parse(data.content);
	toast("This is for my code", content);
});
```

## Using JS Game Engines

Our Overlays will work with various Game Engines including, but not limited to Phaser.js, Pixi.js, Three.js, and more.

## 🧪 Tips

- Use the **Events** multiselect to limit which events trigger updates—great for debugging or focus.
- Always sanitize HTML content if displaying user-generated input.
- Leverage custom CSS to match your stream or brand style.
- In custom code or overlay actions prefer to send data directly to the overlay without the store or variables if you do not need to persist the data

## 📦 Templates

You can get started quickly with one of the two built-in templates:

- **Custom Chatbox** – A base template for building a chatbox overlay that listens to messages.
- **Custom Alert** – A template for creating a fully custom alert layer that responds to selected events.

## Using API requests with Fetch

You can 100% use fetch api requests from within Overlays to call any API you need.
Here is an example:

```js
const url = `https://api.adviceslip.com/advice`;
const slip = await fetch(url).then((r) => r.json());
const advice = slip.slip?.advice || "Take life one step at a time.";
```
