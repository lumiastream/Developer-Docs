---
sidebar_position: 2
---

# Get settings from Lumia

Lumia Stream has various ways users can setup their stream. Some users use commands, others may use only twitch points, the possibilities vary. This is why we have an endpoint to retireve the users settings such as what chat commands does the user have, twitch points, extensions, connections, and even the lights they currently have connected.
This make it extremely simple to target what is needed.

Lumia Stream's api server runs on local port **39231** and at this time does not have a cloud api, but one will be coming.

You can retrieve the settings from the user by sending a **GET** request:

```
GET http://localhost:39231/api/retrieve?token=your_token
```

_Make sure you replace **your_token** with your actual token_

An example response would look like this:

```json
{
	"status": 200,
	"data": {
		"premium": true,
		"types": [
			"alert",
			"chat-command",
			"chatbot-message",
			"clear-queue",
			"clear-cooldowns",
			"hex-color",
			"rgb-color",
			"set-fuze",
			"set-lumia",
			"start-lumia",
			"stop-lumia",
			"studio-animation",
			"studio-scene",
			"studio-theme",
			"to-default",
			"toggle-fuze",
			"tts",
			"twitch-extension",
			"twitch-points"
		],
		"options": {
			"alert": {
				"values": [
					"twitch-follower",
					"twitch-subscriber",
					"twitch-bits",
					"twitch-host",
					"twitch-raid",
					"youtube-subscriber",
					"youtube-superchat",
					"youtube-supersticker",
					"youtube-member",
					"facebook-follower",
					"facebook-reaction",
					"facebook-star",
					"facebook-support",
					"facebook-share",
					"facebook-fan",
					"streamlabs-donation",
					"streamlabs-merch",
					"streamlabs-redemption",
					"streamlabs-primegift",
					"streamelements-donation",
					"obs-switchProfile",
					"obs-switchScene",
					"obs-switchTransition",
					"obs-streamStarting",
					"obs-streamStopping",
					"slobs-switchScene",
					"treatstream-treat",
					"pulse-heartrate",
					"pulse-calories"
				]
			},
			"chat": {},
			"chat-command": {
				"values": [
					"aqua",
					"blue",
					"emerald",
					"green",
					"police",
					"purple",
					"red"
				]
			},
			"chatbot-message": {},
			"clear-queue": null,
			"clear-cooldowns": null,
			"hex-color": {},
			"rgb-color": {},
			"set-fuze": null,
			"set-lumia": null,
			"start-lumia": null,
			"stop-lumia": null,
			"studio-animation": {
				"values": [
					"Fireworks",
					"Flicker",
					"Lava",
					"Water",
					"breathe",
					"flashbang",
					"rainbow",
					"yinyang"
				]
			},
			"studio-scene": {
				"values": [
					"Blue Gradient",
					"Candy Cane",
					"Flame",
					"Fruits",
					"Green Gradient",
					"Red Gradient",
					"Sunset",
					"Tropical",
					"rgb",
					"snow"
				]
			},
			"studio-theme": {
				"values": ["aurora", "circus", "nemo"]
			},
			"to-default": null,
			"toggle-fuze": null,
			"tts": {
				"values": {
					"devices": [
						{
							"id": "125",
							"label": "MacBook Pro Speakers"
						},
						{
							"id": "87",
							"label": "ZoomAudioDevice"
						}
					],
					"currentDevice": {
						"id": "desktop",
						"label": "desktop"
					},
					"voices": [
						{
							"id": "Agnes",
							"label": "Agnes",
							"language": "en_US"
						},
						{
							"id": "Albert",
							"label": "Albert",
							"language": "en_US"
						},
						{
							"id": "Alex",
							"label": "Alex",
							"language": "en_US"
						}
					]
				}
			},
			"twitch-extension": {
				"values": ["blue", "emerald", "green", "new-command", "pink", "red"]
			},
			"twitch-points": {
				"values": [
					"blue",
					"emerald",
					"green",
					"nemo",
					"new-command",
					"pink",
					"red",
					"snow",
					"tierall",
					"tieronly1",
					"tieronly2",
					"wildhex",
					"wildpoints"
				]
			}
		},
		"lights": [
			{
				"id": "17",
				"name": "Hue globe",
				"type": "hue"
			},
			{
				"id": "19",
				"name": "Hue go",
				"type": "hue"
			},
			{
				"id": "167",
				"type": "nanoleaf"
			},
			{
				"id": "178",
				"type": "nanoleaf"
			},
			{
				"id": "1",
				"name": "bar",
				"type": "overlay"
			}
		]
	}
}
```

As you can see the reponse list contains a lot of informaion because, and the main reason is because every user will have a different setup adn you should never rely on a command existing in one place every time.

---

## Slim mode

The full response includes complete overlay configurations, which can run to megabytes on setups with many overlays. If you only need the command/alert/scene/light lists, add `slim=true`:

```
GET http://localhost:39231/api/retrieve?token=your_token&slim=true
```

Slim mode replaces `options.overlays`, `options.overlayLayers`, `options.overlayAssets`, and `options.indistinctLayers` with `{ "count": n }` objects and leaves everything else unchanged. Over the Websocket, send `{ "retrieve": true, "slim": true }` for the same effect.

:::tip

Slim mode requires an up-to-date Lumia Stream. On older versions the parameter is ignored and the full payload is returned, so it degrades safely.

:::

---

## API capabilities

To find out what the connected Lumia Stream supports, call the meta endpoint:

```
GET http://localhost:39231/api/meta?token=your_token
```

```json
{
	"status": 200,
	"name": "lumia-stream",
	"version": "9.1.0",
	"apiVersion": 2,
	"startedAt": 1783487000000,
	"features": ["meta", "retrieve-slim", "structured-errors", "name-validation", "ws-command-responses"]
}
```

Older versions of Lumia return a 404 here — treat that as `apiVersion: 1` with none of the listed features.

Next page we will go in depth for each command that you can trigger and how to trigger them
