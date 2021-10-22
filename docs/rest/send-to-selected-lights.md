---
sidebar_position: 7
---

# Sending Colors to only selected lights

In the previous section we've showed how to send 
Generic Colors and Brightness. The great thing about sending generic colors is that you can also individually choose which light you would like to trigger.

A sample POST request would look like:

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "rgb-color",
	"params": {
			"value": { "r": 20, "g": 100, "b": 10 },
			"brightness": 100,
			"transition": 0,
			"duration": 5000,
			"lights": [
					{ "type": "hue", "value": "19" }
			]
	}
}
```

_Make sure you replace **your_token** with your actual token_

the **params.value.lights** is an array of objects that contains each light that you would like to trigger. I will contain a `type` and a `value`. The type is the brand and the value is the id of the light.

---

## Receive list of valid lighs

When getting your settings you will receive a list of valid lights that are connected to Lumia Stream for the user. It will be under `data.lights` and will look similar to this:

```json
{
	"data": {
			"lights": [
				{
						"id": "17",
						"name": "Hue globe",
						"type": "hue"
				},
				{
						"id": "19",
						"name": "hue-go",
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

As you can see this will be a flat list with the id, name, and type of the light. In the example above I will select the id and type from Hue Go and send it. Take note that the list doesn't return a value field, you will have to select the id that you want and send it into the value field.

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "rgb-color",
	"params": {
			"value": { "r": 20, "g": 100, "b": 10 },
			"brightness": 100,
			"transition": 0,
			"duration": 5000,
			"lights": [
					{ "type": "hue", "value": "19" }
			]
	}
}
```
