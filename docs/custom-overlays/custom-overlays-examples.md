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

## Pokemon Catch Mini-Game Overlay

### JS Code

```js
/* ------------------------------------------------------------------
   0. CONFIG  (editable in “Configs” / “Data” tabs)
------------------------------------------------------------------*/
const cfg = {
	catchCommand: Overlay.data?.catchCommand || "!catch",
	leaderboardCommand: Overlay.data?.leaderboardCommand || "!leader",
	pokedexCommand: Overlay.data?.pokedexCommand || "!pokedex",
	minSpawnSec: Number(Overlay.data?.minSpawn) || 40,
	maxSpawnSec: Number(Overlay.data?.maxSpawn) || 60,
	captureMsgMs: Number(Overlay.data?.msgMs) || 7000,
	maxDex: Number(Overlay.data?.maxDex) || 151,
	volume: Number(Overlay.data?.volume) || 0.3,
	shinyRate: Number(Overlay.data?.shinyRate) || 2,
	catchSuccess: Number(Overlay.data?.catchPct) || 50,
	fleeChance: Number(Overlay.data?.fleePct) || 15,
	idleFleeSec: Number(Overlay.data?.idleSec) || 15,
	disableChat: Boolean(Overlay.data?.disableChat),
	devMode: Boolean(Overlay.data?.devMode),
};

/* ------------------------------------------------------------------
   1. DOM handles
------------------------------------------------------------------*/
const imgPoke = document.getElementById("pokemon-image");
const imgBall = document.getElementById("pokeball-image");
const msgEl = document.getElementById("message");
const boardList = document.getElementById("board-list");
const modalDex = document.getElementById("pokedex");
const dexMsgEl = document.getElementById("pokedex-message");
const dexImgsEl = document.getElementById("pokedex-images");
const sfxSpawn = document.getElementById("spawn-sound");
const sfxCatch = document.getElementById("catch-sfx");
const sfxThrow = document.getElementById("throw-sfx");

/* ------------------------------------------------------------------
   2. Global state
------------------------------------------------------------------*/
let game = {
	cur: null,
	catchable: false,
	anim: false,
	idleT: null,
	spawnT: null,
};
let msgTimer = null;
let leaderboardTimer = null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BALL_POWER = {
	regular: 0, // baseline cfg.catchSuccess
	great: +20, // +20 %
	ultra: +40, // +40 %
	master: 100, // always catches
};

const BALL_SPRITE = {
	regular:
		"https://storage.lumiastream.com/overlays/2/8f20685a-21f2-4f11-a0cf-2571ed3a65f3.png",
	great:
		"https://storage.lumiastream.com/overlays/2/92177744-1de7-4605-8a26-5c03ff2257cf.png",
	ultra:
		"https://storage.lumiastream.com/overlays/2/c8efaa7b-e983-4706-ad46-33e0ee547846.png",
	master:
		"https://storage.lumiastream.com/overlays/2/4cb9dbe2-6e9a-451b-bb11-20044011c9b5.png",
};

/* ------------------------------------------------------------------
   3. Leaderboard helpers  (Lumia Variables)
------------------------------------------------------------------*/
async function load() {
	const raw = await Overlay.getVariable("pokemon_leaderboard");
	try {
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

async function save(data) {
	await Overlay.setVariable("pokemon_leaderboard", JSON.stringify(data));
}

async function incrementUser(user, pokeName, isShiny) {
	const board = await load();
	if (!board[user]) board[user] = { total: 0, shiny: 0, list: [] };

	board[user].total++;
	if (isShiny) board[user].shiny++;
	board[user].list.push({ name: pokeName, shiny: isShiny });

	await save(board);
}

/* ------------------------------------------------------------------
   4. Pokémon fetcher  (forceId / forceShiny overrides)
------------------------------------------------------------------*/
async function fetchPokemon({ forceId = null, forceShiny = null } = {}) {
	const id = forceId ?? Math.floor(Math.random() * cfg.maxDex) + 1;
	try {
		const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
			(r) => r.json()
		);
		const shiny = forceShiny ?? Math.random() * 100 < cfg.shinyRate;

		return {
			id,
			name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
			sprite: shiny ? data.sprites.front_shiny : data.sprites.front_default,
			cry: data.cries.latest || data.cries.legacy,
			shiny,
		};
	} catch {
		return null;
	}
}

/* ------------------------------------------------------------------
   5. Game flow
------------------------------------------------------------------*/
function showMessage(txt = "", ms = 0) {
	clearTimeout(msgTimer);

	if (txt) {
		msgEl.textContent = txt;
		msgEl.classList.remove("hidden"); // <-- make sure you have a `.hidden` css rule
	} else {
		msgEl.textContent = "";
		msgEl.classList.add("hidden");
	}

	if (ms > 0) {
		msgTimer = setTimeout(() => showMessage("", 0), ms);
	}
}

function scheduleSpawn() {
	clearTimeout(game.spawnT);
	const delay =
		(Math.random() * (cfg.maxSpawnSec - cfg.minSpawnSec) + cfg.minSpawnSec) *
		1000;
	game.spawnT = setTimeout(() => spawn(), delay);
}

async function spawn(overrides = {}) {
	if (game.cur || game.anim) return;
	game.anim = true;

	imgBall.className = "hidden";
	imgPoke.className = "hidden";

	const p = await fetchPokemon(overrides);
	if (!p) {
		game.anim = false;
		scheduleSpawn();
		return;
	}

	game.cur = p;
	imgPoke.src = p.sprite;
	showMessage(
		p.shiny
			? `✨ A SHINY ${p.name.toUpperCase()} appeared!`
			: `A wild ${p.name} appeared!`,
		0
	);
	game.catchable = true;

	/* cry */
	if (p.cry && cfg.volume > 0) {
		sfxSpawn.src = p.cry;
		sfxSpawn.volume = Math.min(1, Math.max(0, cfg.volume));
		sfxSpawn.play().catch(() => {});
	}

	imgPoke.classList.remove("hidden");
	imgPoke.classList.add("spawned");

	setTimeout(() => {
		game.anim = false;
		showMessage(`${p.name} appeared! Type ${cfg.catchCommand} to catch it!`, 0);
	}, 1500);

	/* boredom flee */
	clearTimeout(game.idleT);
	game.idleT = setTimeout(() => {
		if (game.cur && !game.anim) {
			showMessage(`${game.cur.name} got bored and fled! 💨`, 3000); // 👈 3 s
			despawn();
		}
	}, cfg.idleFleeSec * 1000);
}

/* ------------------------------------------------------------------
   Attempt a capture
   @param {string} username – display name
   @param {string} origin   – 'kick' | 'twitch' | 'youtube' | 'discord'
   @param {string} ballType – 'regular' | 'great' | 'ultra' | 'master'
------------------------------------------------------------------*/
async function tryCatch({ username, origin = "twitch", ballType = "regular" }) {
	if (!game.catchable || game.anim) return; // nothing to catch

	/* ---------- pre-throw setup ---------- */
	game.anim = true;
	game.catchable = false;

	// Capitalise the label used in the UI message
	const ballLabel = ballType.charAt(0).toUpperCase() + ballType.slice(1);

	showMessage(`${username} threw a ${ballLabel} Ball!`, 0);
	imgBall.src = BALL_SPRITE[ballType] || BALL_SPRITE.regular;
	imgBall.className = "start-capture-sequence";

	// SFX
	sfxThrow.currentTime = 0;
	sfxThrow.volume = Math.min(1, Math.max(0, cfg.volume));
	sfxThrow.play().catch(() => {});

	setTimeout(() => imgPoke.classList.add("hidden"), 700);
	await sleep(5000);
	imgBall.className = "hidden";

	/* ---------- success roll ---------- */
	let success;
	if (ballType === "master") {
		success = true; // Master Ball never fails
	} else {
		const bonus = BALL_POWER[ballType] ?? 0; // fall back to 0
		const chance = Math.min(100, cfg.catchSuccess + bonus);
		success = Math.random() * 100 < chance;
	}

	/* ---------- outcome ---------- */
	if (success) {
		// -------------------- catch! --------------------
		sfxCatch.currentTime = 0;
		sfxCatch.volume = Math.min(1, Math.max(0, cfg.volume));
		sfxCatch.play().catch(() => {});
		showMessage(`Gotcha! ${username} caught ${game.cur.name}! 🎉`, 3000);
		Overlay.callCommand("pokemon-chatbot", {
			platform: origin,
			pokemon_message: `Gotcha! ${username} caught ${game.cur.name}! 🎉`,
		});

		await incrementUser(username.toLowerCase(), game.cur.name, game.cur.shiny);

		await sleep(cfg.captureMsgMs);
		despawn();
	} else {
		// -------------------- broke free --------------------
		showMessage(`${game.cur.name} broke free!`, 5000);

		imgPoke.classList.remove("hidden"); // show Pokémon again

		/* restart the idle-flee timer */
		clearTimeout(game.idleT);
		game.idleT = setTimeout(() => {
			if (game.cur && !game.anim) {
				showMessage(`${game.cur.name} got bored and fled! 💨`, 5000);
				despawn();
			}
		}, cfg.idleFleeSec * 1000);

		game.catchable = true;
		game.anim = false;
	}
}

function despawn() {
	clearTimeout(game.idleT);
	imgBall.classList.add("hidden");
	imgPoke.classList.add("hidden");
	game = {
		cur: null,
		catchable: false,
		anim: false,
		idleT: null,
		spawnT: null,
	};
	showMessage();
	scheduleSpawn();
}

/* ------------------------------------------------------------------
   6. Pokédex pop-up  (reads leaderboard data)
------------------------------------------------------------------*/
async function showPokedex(username = "Someone") {
	const all = await load();
	const entry = all[username.toLowerCase()] || { list: [] };
	const list = entry.list;

	dexMsgEl.textContent = list.length
		? `${username} has caught ${list.length} / ${cfg.maxDex}`
		: `${username} hasn’t caught anything yet.`;

	dexImgsEl.innerHTML = list
		.map((p) => {
			const slug = p.name
				.toLowerCase()
				.replace(/♀/g, "f")
				.replace(/♂/g, "m")
				.replace(/[.'’]/g, "")
				.replace(/\s+/g, "-");
			const src = `https://img.pokemondb.net/sprites/home/${
				p.shiny ? "shiny" : "normal"
			}/${slug}.png`;
			return `<img class="poke${p.shiny ? " shiny" : ""}" src="${src}" alt="${
				p.name
			}">`;
		})
		.join("");

	modalDex.classList.remove("hidden");
	setTimeout(() => modalDex.classList.add("hidden"), 10000);
}

async function showLeaderboard() {
	clearTimeout(leaderboardTimer);
	const board = await load();
	const list = Object.entries(board)
		.sort((a, b) => b[1].total - a[1].total)
		.slice(0, 10);

	boardList.innerHTML = list.length
		? list
				.map(([u, d]) => {
					const tip = d.list
						.map((p) => (p.shiny ? `${p.name} ⭐` : p.name))
						.join(", ");
					return `<li>
            <span class="user" title="${tip}">${u}</span>
            <span>${d.total}${d.shiny ? ` ⭐${d.shiny}` : ""}</span>
          </li>`;
				})
				.join("")
		: "<li>No catches yet</li>";

	boardList.classList.remove("hidden");

	leaderboardTimer = setTimeout(() => {
		boardList.classList.add("hidden");
	}, 10000);
}

/* ------------------------------------------------------------------
   7. Chat listeners
------------------------------------------------------------------*/
const handleListener = ({ command, username, ballType, origin }) => {
	if (command === cfg.catchCommand) tryCatch({ username, origin, ballType });
	if (command === cfg.leaderboardCommand) showLeaderboard();
	if (command === cfg.pokedexCommand) showPokedex(username);
};

if (!cfg.disableChat) {
	Overlay.on("chat", (data) => {
		handleListener({
			command: data.message?.trim(),
			username: data.username,
			ballType: "regular",
			origin: data.origin,
		});
	});
}

// Manual Listeners from Lumia
Overlay.on("overlaycontent", (data) => {
	const { command, username, ballType } = JSON.parse(data.content);
	handleListener({ command, username, ballType, origin: data.origin });
});

/* ------------------------------------------------------------------
   8. Developer helpers (keyboard + console)
------------------------------------------------------------------*/
if (cfg.devMode) {
	console.info(
		"[Poké-Overlay] Dev-mode ON  –  S:spawn  ⇧S:shiny  R:rare  C:catch  M:Master  P:pokedex  L:leaderboard"
	);

	/* onscreen cheat-sheet */
	const hint = document.getElementById("debug-hints");
	if (hint) {
		hint.innerHTML =
			"Dev-mode: <kbd>S</kbd> Spawn • <kbd>⇧S</kbd> Shiny • <kbd>R</kbd> Rare • " +
			"<kbd>C</kbd> Catch • <kbd>M</kbd> Masterball • <kbd>P</kbd> Pokédex • <kbd>L</kbd> Leaderboard";
		hint.classList.remove("hidden");
	}

	/* helpers */
	const rareIds = [144, 145, 146, 150, 151];
	const spawnShiny = () => spawn({ forceShiny: true });
	const spawnRare = () =>
		spawn({ forceId: rareIds[Math.floor(Math.random() * rareIds.length)] });

	window.debug = {
		spawn,
		spawnShiny,
		spawnRare,
		tryCatch,
		showPokedex,
		showLeaderboard,
		state: async () => ({ game, board: await load() }),
	};

	window.addEventListener("keydown", (e) => {
		if (e.repeat) return;
		const k = e.key.toLowerCase();
		if (k === "s" && e.shiftKey) return spawnShiny();
		if (k === "s") return spawn();
		if (k === "r") return spawnRare();
		if (k === "c") return tryCatch({ username: "Dev" });
		if (k === "m") return tryCatch({ username: "Dev", ballType: "master" });
		if (k === "l") return showLeaderboard();
		if (k === "p") return showPokedex("Dev");
	});
}

/* ------------------------------------------------------------------
   9. Boot
------------------------------------------------------------------*/
// Give it a little time for variables to make it in
setTimeout(async () => {
	// Sets the initial pokeball sprite
	imgBall.src = BALL_SPRITE.regular;
	scheduleSpawn();
	showLeaderboard();
}, 1000);
```

### HTML

```html
<div class="container">
	<!-- Game area -->
	<div id="game-area">
		<img id="pokemon-image" class="hidden" alt="Pokémon" />
		<img id="pokeball-image" class="hidden" alt="Poké Ball" />
		<p id="message"></p>
	</div>

	<!-- Leaderboard -->
	<ul id="board-list"></ul>

	<!-- Sounds -->
	<audio id="spawn-sound" preload="auto"></audio>
	<audio id="catch-sfx" preload="auto">
		<source
			src="https://storage.lumiastream.com/overlays/1/1c3c7e1a-da7b-4b3c-8efa-d5792f5d7011.mp3"
			type="audio/mpeg"
		/>
	</audio>
	<audio id="throw-sfx" preload="auto">
		<source
			src="https://storage.lumiastream.com/overlays/1/5e8753b9-1b9b-41be-ba20-27af95282e62.wav"
			type="audio/mpeg"
		/>
	</audio>

	<!-- Pokédex pop-up -->
	<div id="pokedex" class="pokedex-container hidden">
		<div id="pokedex-message"></div>
		<div id="pokedex-images"></div>
	</div>

	<!-- Dev-mode cheat-sheet (shown only when devMode = true) -->
	<div id="debug-hints" class="debug-hints hidden">
		Dev-mode:&nbsp;<kbd>S</kbd> Spawn&nbsp;•&nbsp;<kbd>⇧S</kbd>
		Shiny&nbsp;•&nbsp; <kbd>R</kbd> Rare&nbsp;•&nbsp;<kbd>C</kbd>
		Catch&nbsp;•&nbsp;<kbd>P</kbd> Pokédex
	</div>
</div>
```

### CSS Styling

```css
/* ------------------------------------------------------------------
   0. Font
------------------------------------------------------------------*/
@font-face {
	font-family: "PokemonRBY";
	src: url("https://db.onlinewebfonts.com/t/65780863e7302fe257df982341d6a1cb.woff2")
			format("woff2"), url("https://db.onlinewebfonts.com/t/65780863e7302fe257df982341d6a1cb.woff")
			format("woff"),
		url("https://db.onlinewebfonts.com/t/65780863e7302fe257df982341d6a1cb.ttf")
			format("truetype");
	font-weight: 400;
	font-style: normal;
	font-display: swap;
}

/* ------------------------------------------------------------------
   1. Layout
------------------------------------------------------------------*/
html,
body {
	height: 100%;
	width: 100%;
	margin: 0;
	font-family: "PokemonRBY", sans-serif;
	overflow: hidden;
}

.container {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

#game-area {
	position: relative; /* → origin for absolute Poké-ball */
	display: flex;
	flex-direction: column;
	align-items: center;
}

/* ------------------------------------------------------------------
   2. Pokémon & ball
------------------------------------------------------------------*/
#pokemon-image {
	width: 250px;
	height: 250px;
	object-fit: contain;
	transition: opacity 0.5s ease, transform 0.5s ease;
	image-rendering: pixelated;
	z-index: 10;
}

#pokeball-image {
	position: absolute;
	/* centred on the sprite before animation starts */
	top: calc(50% - 125px);
	left: 50%;
	transform: translate(-50%, -50%) scale(0);
	transform-origin: center center;
	opacity: 0;
	visibility: hidden;
	z-index: 20;
	pointer-events: none;
}

/* ------------------------------------------------------------------
   3. Message text
------------------------------------------------------------------*/
#message {
	text-align: center;
	color: #ffcb05;
	font-size: 28px;
	letter-spacing: 2px;
	margin-top: 10px;
	text-shadow: 3px 3px 0 #3a5b8a, -3px 3px 0 #3a5b8a, 3px -3px 0 #3a5b8a, -3px -3px
			0 #3a5b8a;
	height: 80px;
}

/* ------------------------------------------------------------------
   4. Leaderboard
------------------------------------------------------------------*/
#board-list {
	list-style: none;
	margin: 0;
	padding: 0 12px;
	position: absolute;
	top: 20px;
	right: 20px;
	background: rgba(0, 0, 0, 0.25);
	backdrop-filter: blur(4px);
	border-radius: 8px;
	font-size: 18px;
	color: white;
}
#board-list li {
	display: flex;
	justify-content: space-between;
	gap: 12px;
	padding: 2px 0;
	white-space: nowrap;
}
#board-list .user {
	cursor: default;
}
#board-list span:last-child {
	font-weight: bold;
}

/* ------------------------------------------------------------------
   5. Pokédex pop-up
------------------------------------------------------------------*/
#pokedex {
	position: absolute;
	bottom: 30px;
	right: 60px;
	padding: 20px;
	background: rgba(255, 255, 255, 0.8);
	border-radius: 10px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);

	opacity: 0;
	visibility: hidden;
	transition: opacity 0.3s ease;
}
#pokedex:not(.hidden) {
	opacity: 1;
	visibility: visible;
}

.pokedex-message {
	font-size: 24px;
	color: #3a5b8a;
	margin-bottom: 10px;
}
.pokedex-container img {
	width: 50px;
	height: 50px;
	margin: 5px;
}

/* ------------------------------------------------------------------
   6. Utility + animations
------------------------------------------------------------------*/
.hidden {
	opacity: 0 !important;
	visibility: hidden !important;
	transform: scale(0) !important;
}
.spawned {
	opacity: 1;
	visibility: visible;
	transform: scale(1);
	animation: pulse 2.5s ease-in-out infinite;
}
.poke {
	width: 80px;
	margin: 4px;
	image-rendering: crisp-edges;
}
.shiny {
	filter: hue-rotate(45deg) brightness(1.3) saturate(1.2);
}

@keyframes pulse {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.05);
	}
}

/* Throw + arc + shake + flash */
@keyframes full-capture-sequence {
	0% {
		transform: translate(-50%, -50%) translate(-300px, 150px) scale(0.5) rotate(
				-200deg
			);
		opacity: 0;
	}
	8% {
		opacity: 1;
	}
	14% {
		transform: translate(-50%, -50%) translate(0, -140px) scale(1.2) rotate(
				0deg
			);
	}
	24% {
		transform: translate(-50%, -50%) translate(0, 0) scale(1);
	}
	35% {
		transform: translate(-50%, -50%) rotate(-15deg);
	}
	45% {
		transform: translate(-50%, -50%) rotate(15deg);
	}
	55% {
		transform: translate(-50%, -50%) rotate(-15deg);
	}
	65% {
		transform: translate(-50%, -50%) rotate(15deg);
	}
	75% {
		transform: translate(-50%, -50%) rotate(-15deg);
	}
	85% {
		transform: translate(-50%, -50%) rotate(15deg);
	}
	90% {
		transform: translate(-50%, -50%) rotate(0deg);
	}
	100% {
		transform: translate(-50%, -50%) rotate(0deg);
		filter: drop-shadow(0 0 10px white);
	}
}

.start-capture-sequence {
	visibility: visible !important;
	opacity: 1 !important;
	animation: full-capture-sequence 5s ease-out forwards;
}

/* ------------------------------------------------------------------
   7. Dev cheat-sheet bar
------------------------------------------------------------------*/
.debug-hints {
	position: absolute;
	bottom: 8px;
	left: 50%;
	transform: translateX(-50%);
	background: rgba(0, 0, 0, 0.6);
	color: #fff;
	font-size: 14px;
	padding: 4px 14px;
	border-radius: 6px;
	pointer-events: none;
}
.debug-hints kbd {
	background: #333;
	padding: 0 4px;
	border-radius: 4px;
	font-size: 13px;
}
```

### Configs

```json
{
	"maxDex": {
		"type": "number",
		"label": "Highest Pokédex #",
		"value": 151
	},
	"volume": {
		"type": "number",
		"label": "Volume (0-1)",
		"value": 0.3
	},
	"devMode": {
		"type": "checkbox",
		"label": "Developer mode (keyboard + console helpers)",
		"value": false
	},
	"fleePct": {
		"type": "number",
		"label": "Flee chance %",
		"value": 15
	},
	"idleSec": {
		"type": "number",
		"label": "Flee time (seconds)",
		"value": 30
	},
	"catchPct": {
		"type": "number",
		"label": "Catch success %",
		"value": 40
	},
	"maxSpawn": {
		"type": "number",
		"label": "Spawn delay (max s)",
		"value": 60
	},
	"minSpawn": {
		"type": "number",
		"label": "Spawn delay (min s)",
		"value": 40
	},
	"shinyRate": {
		"type": "number",
		"label": "Shiny rate %",
		"value": 2
	},
	"disableChat": {
		"type": "checkbox",
		"label": "Disable Chat from Overlays to allow manual control from Lumia",
		"value": false
	},
	"catchCommand": {
		"type": "input",
		"label": "Catch command",
		"value": "!catch"
	},
	"pokedexCommand": {
		"type": "input",
		"label": "Pokedex command",
		"value": "!pokedex"
	},
	"leaderboardCommand": {
		"type": "input",
		"label": "Leaderboard command",
		"value": "!leader"
	}
}
```

### Data

```json
{
	"maxDex": 151,
	"volume": 0.3,
	"devMode": false,
	"fleePct": 15,
	"idleSec": 30,
	"catchPct": 40,
	"maxSpawn": 120,
	"minSpawn": 30,
	"shinyRate": 2,
	"disableChat": false,
	"catchCommand": "!catch",
	"pokedexCommand": "!pokedex",
	"leaderboardCommand": "!leader"
}
```
