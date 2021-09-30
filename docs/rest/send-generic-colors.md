---
sidebar_position: 6
---

# Sending Colors and Brightness

Sending Generic Colors and Brightness is the most powerful way to use Lumia. You will have access to setting the duration, brightness, transition, as well as individually choosing which light that you would like to trigger.

A sample POST request would look like:

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "rgb-color",
	"params": {
			"value": { "r": 20, "g": 100, "b": 10 },
			"brightness": 100,
			"transition": 0,
			"duration": 5000
	}
}
```

*Make sure you replace **your_token** with your actual token*

the **params.value** can either be an object with parameters `R, G, and B`, or an array with `[number, number, number]`.

---

## Color Temperature

When using an object insted of R, G, B, you can also use `CT` which stands for Color Temperature.
The values for Color Temperature can go between `2900 kelvin to 7000 kelvin` inclusive.

---

## Hex Colors

You will also have the ability to send hex colors instead of RGB Colors by sending a POST request with the type `hex-color`:

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "hex-color",
	"params": {
			"value": "#ff00ff",
			"brightness": 100,
			"transition": 0,
			"duration": 5000
	}
}
```

Hex colors take in the same parameters as RGB except the value is a string

---

## Required params

Using rgb-color and hex-color only requires the value parameter, everything else is optional.
Brightness will default to 100, transition defaults to 0, and duration defaults to 4000 ms

---

## Setting Default State

You will also have the ability to set that command as your new default by adding the parameter hold inside the post request:

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "rgb-color",
	"params": {
			"value": { "r": 20, "g": 100, "b": 10 },
			"brightness": 100,
			"transition": 0,
			"duration": 5000,
			"hold": true
	}
}
```
