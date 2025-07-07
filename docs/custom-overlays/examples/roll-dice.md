---
sidebar_position: 4
title: Roll a Dice
---

# Roll a Dice

### JS Code

```js
/********************************************************************/
/*  Simple !roll overlay – auto-hide when idle                      */
/********************************************************************/
const cfg = window.DATA || {};
const die = document.getElementById("die");
const HIDE_MS = cfg.hideDelay ?? 5000; // 5 s default
let hideT = null;

/* ---------- helpers ---------------------------------------------*/
function showDie() {
	die.classList.remove("hidden");
	clearTimeout(hideT);
	hideT = setTimeout(() => die.classList.add("hidden"), HIDE_MS);
}

/* ---------- listener --------------------------------------------*/
window.addEventListener("onEventReceived", (ev) => {
	if (ev.detail?.type !== "alert.chat") return;

	const msg = ev.detail.data?.info?.message?.trim().toLowerCase();
	const user = ev.detail.data?.info?.username ?? "Someone";
	if (msg !== "!roll") return;

	const v = 1 + Math.floor(Math.random() * 6); // 1–6 roll

	/* restart spin animation */
	die.style.animation = "none";
	void die.offsetWidth;
	die.style.animation = `spin var(--roll-ms) cubic-bezier(.26,.88,.37,.99)`;

	/* reveal value after spin */
	setTimeout(() => {
		die.textContent = v;
	}, cfg.rollDuration);

	/* make it visible & schedule hide */
	showDie();
});

/* hide die on first load -----------------------------------------*/
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
	"events": {
		"type": "multiselect",
		"label": "Events to listen to:",
		"value": ["alert.chat"],
		"hidden": true,
		"options": {
			"alert.chat": "Chat messages"
		}
	},
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
	"events": ["alert.chat"],
	"dotColor": "#ffffff",
	"hideDelay": 5000,
	"rollDuration": 900
}
```
