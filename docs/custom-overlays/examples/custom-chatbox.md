---
sidebar_position: 1
title: Custom Chatbox
---

# Custom Chat Box

### JS Code

```js
// codeId is used to filter the custom.overlay-content to ignore data intended for other custom code from Lumia Stream
const CODE_ID = window.CODE_ID || "chat-template";
// DATA is fetched from the sidebar input values
const configs = window.DATA || {};
const messageContainer = document.getElementById("container");

// Pass data to css variable to use it easily inside css
if (configs?.primaryColor)
	messageContainer.style.setProperty("--primary", configs?.primaryColor);
if (configs?.backgroundColor)
	messageContainer.style.setProperty("--secondary", configs?.backgroundColor);
if (configs?.messageBgColor)
	messageContainer.style.setProperty("--bg", configs?.messageBgColor);
if (configs?.textColor)
	messageContainer.style.setProperty("--text", configs?.textColor);
if (configs?.rounded)
	container.style.setProperty("--rounded", configs?.rounded);

// Listen for chat messages
window.addEventListener("onEventReceived", (ev) => {
	const type = ev.detail?.type;
	const payload = ev.detail?.data;

	if (type === "alert.chat") {
		const chat = ev.detail?.data?.info;
		const origin = ev.detail?.data?.origin;

		// Append the chat messages to the HTML container
		document.getElementById(
			"messages-container"
		).innerHTML += `<div class="message" id="message"><span id="origin">From ${origin}</span><img src="${chat.avatar}" id="avatar"/><label id="username">${chat.username}:</label><div id="content">${chat.message}</div></div>`;
	}
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
	"rounded": "10px",
	"events": ["alert.chat"]
}
```
