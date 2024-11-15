---
sidebar_position: 15
---

# Text To Speech

Lumia Stream has a built in Text To Speech Engine inside of it that developers are free to use however they see fit.

You can trigger the TTS system by sending a POST request like this:

```bash
POST http://localhost:39231/api/send?token=your_token
```

```json
{
  "type": "tts",
  "params": {
    "value": "Wow, this tutorial is just way too cool"
  }
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::

## Change The Speaker Voice

You can select the voice based on the results you've retrieved on the **[Getting Settings Page](./get-settings.md)**

The list of voices can be found in the `data.options.tts.voices parameter

```json
{
  "type": "tts",
  "params": {
    "value": "Wow, this tutorial is just way too cool",
    "voice": "Brian"
  }
}
```

---

## Setting The Volume

On `Windows only` you will have the option to also set the volume with how loud the TTS is spoken:

```json
{
  "type": "tts",
  "params": {
    "value": "Wow, this tutorial is just way too cool",
    "volume": 20
  }
}
```
