---
sidebar_position: 8
---

# Text To Speech

Lumia Stream has a built in Text To Speech Engine inside of it that developers are free to use however they see fit.

You can trigger the TTS system by sending a POST request like this:

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "tts",
	"params": {
			"value": "Wow, this tutorial is just way too cool"
	}
}
```

_Make sure you replace **your_token** with your actual token_

---

## Change The Speaker Voice

You can select the voice based on the results you've retrieved on the **[Getting Settings Page](./get-settings.md)**

The list of voices can be found in the `data.options.tts.voices parameter

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "tts",
	"params": {
			"value": "Wow, this tutorial is just way too cool",
			"voice": "Agnes"
	}
}
```

---

## Setting The Volume

On `Windows only` you will have the option to also se the volume with how loud the TTS is spoken:

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "tts",
	"params": {
			"value": "Wow, this tutorial is just way too cool",
			"volume": 20
	}
}
```
