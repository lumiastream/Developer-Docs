---
title: Examples
sidebar_position: 3
---

# Custom Overlays Examples

## Custom Alert

### JS Code

```js
// Overlay.data is fetched from the sidebar input values
const data = Overlay.data || {};
const container = document.getElementById("container");

// Pass data to css variable to use it easily inside css
if (data?.primaryColor)
	container.style.setProperty("--primary", data?.primaryColor);
if (data?.backgroundColor)
	container.style.setProperty("--secondary", data?.backgroundColor);
if (data?.messageBgColor)
	container.style.setProperty("--bg", data?.messageBgColor);
if (data?.textColor) container.style.setProperty("--text", data?.textColor);
if (data?.rounded) container.style.setProperty("--rounded", data?.rounded);

// Listen for alerts
Overlay.on("alert", (data) => {
	const alertType = data.alert;
	const settings = data.extraSettings;
	let fullMessage = "";

	if (alertType.includes("donat")) {
		fullMessage += `${settings?.username} just tipped ${
			settings?.amount ?? ""
		} ${settings?.currency ?? ""}`;
	} else if (alertType.includes("follow")) {
		fullMessage += `${settings?.username} is now following!`;
	} else if (alertType.includes("firstChatter")) {
		fullMessage += `${settings?.username} is the first chatter`;
	} else if (alertType.includes("entrance")) {
		fullMessage += `${settings?.username} Welcome`;
	} else if (alertType.includes("subscriber")) {
		fullMessage += `${settings?.username} just subscribed!`;
	} else if (alertType.includes("bits")) {
		fullMessage += `${settings?.username} cheered ${
			settings?.amount ?? ""
		} bits`;
	}

	if (settings?.message) fullMessage += ` They said ${settings?.message}`;

	// Display the alert inside the HTML container
	document.getElementById(
		"alert-container"
	).innerHTML = `<div class="message-container"><img src="${settings?.avatar}" id="avatar"/> ${fullMessage}</div>`;
});
```

### HTML

```html
<div id="container">
	<h1>Custom Alert</h1>
	<div id="alert-container"></div>
</div>
```

### CSS Styling

```css
#container {
	--primary: #ff4076;
	--secondary: #393853;
	--bg: #12111d;
	--text: #ffffff;
	--rounded: 10px;
	font-family: "Courier New", Courier, monospace;
	background-color: var(--secondary);
	color: var(--text);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem;
	border-radius: var(--rounded);
}

#container h1 {
	color: var(--primary);
	text-align: center;
}

#alert-container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 0.5rem;
}

#alertImage {
	width: 150px;
}
.message-container {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;
}
#avatar {
	background: var(--secondary);
	border-radius: 100px;
	height: 32px;
	aspect-ratio: 1 / 1;
}
```

### Configs

```json
{
	"primaryColor": {
		"type": "colorpicker",
		"label": "Primary color:"
	},
	"backgroundColor": {
		"type": "colorpicker",
		"label": "Background color:"
	},
	"textColor": {
		"type": "colorpicker",
		"label": "Text color:"
	},
	"rounded": {
		"type": "input",
		"label": "Rounded corners:"
	},
	"alertImage": {
		"type": "input",
		"label": "Alert image:"
	}
}
```

### Data

```json
{
	"primaryColor": "#ff4076",
	"backgroundColor": "#393853",
	"textColor": "#ffffff",
	"messageBgColor": "#12111d",
	"rounded": "10px",
	"alertImage": "https://storage.lumiastream.com/overlays/2/946e20c5-35da-44f6-94cb-fe833c71d10b.gif"
}
```

## Custom Chat Box

### JS Code

```js
// Overlay.data is fetched from the sidebar input values
const data = Overlay.data || {};
const messageContainer = document.getElementById("container");

// Pass data to css variable to use it easily inside css
if (data?.primaryColor)
	messageContainer.style.setProperty("--primary", data?.primaryColor);
if (data?.backgroundColor)
	messageContainer.style.setProperty("--secondary", data?.backgroundColor);
if (data?.messageBgColor)
	messageContainer.style.setProperty("--bg", data?.messageBgColor);
if (data?.textColor)
	messageContainer.style.setProperty("--text", data?.textColor);
if (data?.rounded)
	messageContainer.style.setProperty("--rounded", data?.rounded);

// Listen for chat messages
Overlay.on("chat", (data) => {
	const origin = data.origin;

	// Append the chat messages to the HTML container
	document.getElementById(
		"messages-container"
	).innerHTML += `<div class="message" id="message"><span id="origin">From ${origin}</span><img src="${data.avatar}" id="avatar"/><label id="username">${data.username}:</label><div id="content">${data.message}</div></div>`;
});
```

### CSS Styling

```css
#container {
	--primary: #ff4076;
	--secondary: #393853;
	--bg: #12111d;
	--text: #ffffff;
	--rounded: 10px;
	font-family: "Courier New", Courier, monospace;
	background-color: var(--secondary);
	color: var(--text);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem;
	border-radius: var(--rounded);
}
#container h1 {
	color: var(--primary);
	text-align: center;
}
.messages-container {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
.message {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0 1rem;
	background: var(--bg);
	border-radius: 10px;
}
#avatar {
	background: var(--secondary);
	border-radius: 100px;
	height: 32px;
	aspect-ratio: 1 / 1;
}
```

### Configs

```json
{
	"primaryColor": {
		"type": "colorpicker",
		"label": "Primary color:"
	},
	"backgroundColor": {
		"type": "colorpicker",
		"label": "Background color:"
	},
	"textColor": {
		"type": "colorpicker",
		"label": "Text color:"
	},
	"messageBgColor": {
		"type": "colorpicker",
		"label": "Message background color:"
	},
	"rounded": {
		"type": "input",
		"label": "Rounded corners:"
	}
}
```

### Data

```json
{
	"primaryColor": "#ff4076",
	"backgroundColor": "#393853",
	"textColor": "#ffffff",
	"messageBgColor": "#12111d",
	"rounded": "10px"
}
```

---

## Calculator with overlaySendCustomContent from Lumia Stream

To create a calculator we need to take in data from Lumia Stream, so we will need Overlay Actions or Custom Code. This calculator also has a TTS option

### Command Custom JS Code from Lumia Stream

This will take in a message from chat like a number or math operator and send it to the overlay with the codeId of `calculator`

```js
async function() {
  overlaySendCustomContent({ codeId: "calculator", content: "{{message}}" });
  // Make sure you call done() to avoid memory leaks
  done();
}
```

### JS Code

```js
const data = Overlay.data || {};
const calcEl = document.getElementById("calc-container");
const exprEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

// Apply colors from sidebar
if (data.primaryColor) calcEl.style.setProperty("--primary", data.primaryColor);
if (data.backgroundColor)
	calcEl.style.setProperty("--background", data.backgroundColor);

let tokens = [];
let showingResult = false;

const IDLE_MS = data.idleTimeout ?? 20000;
let idleTimer = null;

function resetIdleTimer() {
	clearTimeout(idleTimer);
	idleTimer = setTimeout(() => {
		tokens = [];
		resultEl.textContent = "";
		render();
	}, IDLE_MS);
}

function speak(text, opts = {}) {
	if (!data.tts) return;
	const u = new SpeechSynthesisUtterance(text);
	Object.assign(u, opts); // voice, rate, pitch, lang, etc.
	window.speechSynthesis.cancel(); // stop anything currently talking
	window.speechSynthesis.speak(u);
}

function verbalize(token) {
	switch (token) {
		case "+":
			return "plus";
		case "-":
			return "minus";
		case "*":
			return "times";
		case "/":
			return "divided by";
		case "=":
			return "equals";
		default:
			return token; // numbers & anything else
	}
}

function render() {
	exprEl.innerHTML = tokens
		.map((t) =>
			/^[0-9.]+$/.test(t)
				? `<span class="token number">${t}</span>`
				: `<span class="token op">${t}</span>`
		)
		.join(" ");
}

function evaluate() {
	const raw = tokens.join(" ");
	try {
		const safe = raw.replace(/[^0-9+\-*/.() ]/g, "");
		const total = Function(`"use strict"; return (${safe})`)();

		resultEl.textContent = "= " + total;

		// 🔊 read the answer
		speak(`equals ${String(total)}`); // “forty-two”, “3.14159”, …
	} catch {
		resultEl.textContent = "Error";
		speak("Error");
	}
	showingResult = true;
}

Overlay.on("overlaycontent", (data) => {
	const content = data.content;

	// After displaying a result, any new token starts a new expression
	if (showingResult) {
		tokens = [];
		resultEl.textContent = "";
		showingResult = false;
	}

	// Clear
	if (content === "C") {
		tokens = [];
		resultEl.textContent = "";
		speak("Clear");
		render();
		return;
	}

	// Evaluate
	if (content === "=") {
		if (tokens.length) evaluate();
		return;
	}

	// Numbers (build multi-digit) vs operators
	if (/^[0-9.]$/.test(content)) {
		if (tokens.length && /^[0-9.]+$/.test(tokens.at(-1))) {
			tokens[tokens.length - 1] += content; // extend current number
			// speak(tokens[tokens.length - 1]);
		} else {
			tokens.push(content);
			speak(verbalize(content));
		}
	} else if (/^[+\-*/]$/.test(content)) {
		// If previous token is also an operator, overwrite it
		if (tokens.length && /^[+\-*/]$/.test(tokens.at(-1))) {
			tokens[tokens.length - 1] = content;
		} else {
			tokens.push(content);
		}
		speak(verbalize(content));
	}
	render();
});
```

### HTML

```html
<div id="calc-container">
	<div id="expression"></div>
	<div id="result"></div>
</div>
```

### CSS

```css
/* Big, bold, colourful ✨ */
@import url("https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap");

#calc-container {
	--bg: var(--background, #fff6d6);
	--border: var(--primary, #ff90e8);
	--pad: min(2vw, 20px);

	font-family: "Fredoka One", system-ui, sans-serif;
	background: var(--bg);
	border: 6px solid var(--border);
	border-radius: 25px;
	padding: var(--pad);
	filter: drop-shadow(0 0 10px #0003);
}

#expression,
#result {
	line-height: 1.2;
	letter-spacing: 0.06em;
	word-break: break-all;
	/* huge on widescreen, scale down on mobile */
	font-size: clamp(40px, 6vw, 80px);
	text-align: center;
}

#expression span.token.number {
	color: #ff595e; /* watermelon */
}
#expression span.token.op {
	color: #1982c4; /* sky */
}

#result {
	margin-top: 0.2em;
	color: #8ac926; /* lime */
}
```

### Configs

```json
{
	"tts": {
		"type": "checkbox",
		"label": "TTS",
		"value": false
	},
	"idleTimeout": {
		"type": "number",
		"label": "Auto-clear after (ms)",
		"default": 20000,
		"min": 5000,
		"step": 1000
	},
	"ttsVoice": {
		"type": "input",
		"label": "TTS Voice",
		"visibleIf": {
			"key": "tts",
			"equals": true
		}
	},
	"primaryColor": {
		"type": "colorpicker",
		"label": "Text / border colour",
		"value": "#ffffff"
	},
	"backgroundColor": {
		"type": "colorpicker",
		"label": "Background colour",
		"value": "#00000080"
	}
}
```

### Data

```json
{
	"tts": true,
	"idleTimeout": 20000,
	"primaryColor": "#00000000",
	"backgroundColor": "#00000000"
}
```

## Roll a Dice

### JS Code

```js
const data = Overlay.data || {};
const die = document.getElementById("die");
const HIDE_MS = data.hideDelay ?? 5000;
let hideT = null;
let min = 1;
let max = 6;

function showDie() {
	die.classList.remove("hidden");
	clearTimeout(hideT);
	hideT = setTimeout(() => die.classList.add("hidden"), HIDE_MS);
}

Overlay.on("chat", (data) => {
	const message = data.message?.trim().toLowerCase();
	const username = data.username ?? "Someone";
	if (message !== "!roll") return;

	const v = min + Math.floor(Math.random() * (max - min + 1));

	// restart spin animation
	die.style.animation = "none";
	void die.offsetWidth;
	die.style.animation = `spin var(--roll-ms) cubic-bezier(.26,.88,.37,.99)`;

	// reveal value after spin
	setTimeout(() => {
		die.textContent = v;
	}, data.rollDuration);

	// make it visible & schedule hide
	showDie();
});

// hide die on first load
die.classList.add("hidden");
```

### HTML

```html
<div id="die" class="die">🎲</div>
```

### CSS Styling

```css
:root {
	--size: 90px; /* die size */
	--roll-ms: 900ms; /* spin length */
	--dot-color: #fff;
}

.die {
	width: var(--size);
	height: var(--size);
	display: grid;
	place-content: center;
	font-size: calc(var(--size) * 0.55);
	color: var(--dot-color);
	background: #0008;
	border-radius: 12%;
	user-select: none;
	animation: none;
}

.die.hidden {
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.3s ease;
}
.die {
	transition: opacity 0.3s ease;
}

/* single-run spin animation */
@keyframes spin {
	0% {
		transform: rotateX(0) rotateY(0);
	}
	70% {
		transform: rotateX(3turn) rotateY(4turn);
	}
	100% {
		transform: rotateX(3turn) rotateY(4turn);
	}
}
```

### Configs

```json
{
	"dotColor": {
		"type": "colorpicker",
		"label": "Dice text colour",
		"default": "#ffffff"
	},
	"hideDelay": {
		"type": "number",
		"label": "Auto-hide after (ms)",
		"default": 5000
	},
	"rollDuration": {
		"type": "number",
		"label": "Spin time (ms)",
		"default": 900
	}
}
```

### Data

```json
{
	"dotColor": "#ffffff",
	"hideDelay": 5000,
	"rollDuration": 900
}
```
