---
sidebar_position: 3
title: Calculator
---

# Calculator with Custom Code Commands

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
/********************************************************************/
/*  Simple Calculator Overlay – listens to custom.overlay-content   */
/********************************************************************/
const CODE_ID = window.CODE_ID || "calculator"; // keep in sync when you send content
const cfg = window.DATA || {}; // colours etc.
const calcEl = document.getElementById("calc-container");
const exprEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

// Apply colors from sidebar
if (cfg.primaryColor) calcEl.style.setProperty("--primary", cfg.primaryColor);
if (cfg.backgroundColor)
	calcEl.style.setProperty("--background", cfg.backgroundColor);

let tokens = [];
let showingResult = false;

/* ---- helpers --------------------------------------------------- */
const IDLE_MS = cfg.idleTimeout ?? 20000;
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
	if (!cfg.tts) return;
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

/* ---- event listener -------------------------------------------- */
window.addEventListener("onEventReceived", (ev) => {
	console.log("ev", ev.detail);
	const type = ev.detail?.type;
	if (type !== "custom.overlay-content") return;

	resetIdleTimer();

	const { codeId, content } = ev.detail.data || {};
	if (codeId && codeId !== CODE_ID) return; // ignore other snippets

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
	"events": ["custom.overlay-content"],
	"primaryColor": "#00000000",
	"backgroundColor": "#00000000"
}
```
