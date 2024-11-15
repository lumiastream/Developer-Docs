---
sidebar_position: 17
---

# Control Overlays

To set overlay visibility, layer visibility, layer position, or content you will just send a POST request to:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to **set overlay visibility**

```json
{
  "type": "overlay-set-visibility",
  "params": {
    "layer": "overlay_name", // accept overlay name or uuid
    "value": false
  }
}
```

`You can get the uuid from the preview link https://overlays.lumiastream.com/overlay/UUID`

Raw JSON to **set layer visibility**

```json
{
  "type": "overlay-set-layer-visibility",
  "params": {
    "layer": "layer_id",
    "value": false
  }
}
```

`You can get the layer id from the settings sidebar when the layer is selected`

Raw JSON to **set layer position**

```json
{
  "type": "overlay-set-layer-position",
  "params": {
    "layer": "layer_id",
    "x": "100",
    "y": "200"
  }
}
```

Raw JSON to **set content**

```json
{
  "type": "overlay-set-content",
  "params": {
    "layer": "layer_id",
    "content": "false"
  }
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::
