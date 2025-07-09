---
sidebar_position: 2
title: Custom Alerts
---

# Custom Alert

### JS Code

```js
// codeId is used to filter the custom.overlay-content to ignore data intended for other custom code from Lumia Stream
const CODE_ID = window.CODE_ID || "alert-template";
// DATA is fetched from the sidebar input values
const configs = window.DATA || {};
const container = document.getElementById("container");

// Pass data to css variable to use it easily inside css
if (configs?.primaryColor)
	container.style.setProperty("--primary", configs?.primaryColor);
if (configs?.backgroundColor)
	container.style.setProperty("--secondary", configs?.backgroundColor);
if (configs?.messageBgColor)
	container.style.setProperty("--bg", configs?.messageBgColor);
if (configs?.textColor)
	container.style.setProperty("--text", configs?.textColor);
if (configs?.rounded)
	container.style.setProperty("--rounded", configs?.rounded);

// Listen for alerts
window.addEventListener("onEventReceived", (ev) => {
	const type = ev.detail?.type;
	const payload = ev.detail?.data;

	if (type === "alert.event") {
		const alertSettings = payload?.alert;
		const settings = alertSettings?.extraSettings;
		let fullMessage = "";

		// Add the alert type you need to listen to here
		if (alertSettings.alert.includes("donat")) {
			fullMessage += `${settings?.username} just tipped ${
				settings?.amount ?? ""
			} ${settings?.currency ?? ""}`;
		} else if (alertSettings.alert.includes("follow")) {
			fullMessage += `${settings?.username} is now following!`;
		} else if (alertSettings.alert.includes("firstChatter")) {
			fullMessage += `${settings?.username} is the first chatter`;
		} else if (alertSettings.alert.includes("entrance")) {
			fullMessage += `${settings?.username} Welcome`;
		} else if (alertSettings.alert.includes("subscriber")) {
			fullMessage += `${settings?.username} just subscribed!`;
		} else if (alertSettings.alert.includes("bits")) {
			fullMessage += `${settings?.username} cheered ${
				settings?.amount ?? ""
			} bits`;
		}

		if (settings?.message) fullMessage += ` They said ${settings?.message}`;

		// Display the alert inside the HTML container
		document.getElementById(
			"alert-container"
		).innerHTML = `<img src="${configs?.alertImage}" id="alertImage"/><div class="message-container"><img src="${settings?.avatar}" id="avatar"/> ${fullMessage}</div>`;
	}
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
	"alertImage": "https://storage.lumiastream.com/overlays/2/946e20c5-35da-44f6-94cb-fe833c71d10b.gif",
	"events": ["alert.trigger"]
}
```
