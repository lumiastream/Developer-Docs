---
sidebar_position: 8
---

# Sending Studio Trigger

To send a studio trigger you will just send a POST request to:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to trigger studio scene **snow** with 4 seconds duration

```json
{
  "type": "studio-scene",
  "params": {
    "value": "snow",
    "duration": "4000" // in milliseconds
  }
}
```

Raw JSON to trigger studio theme **lifx** with 4 seconds duration

```json
{
  "type": "studio-theme",
  "params": {
    "value": "lifx",
    "duration": "4000" // in milliseconds
  }
}
```

Raw JSON to trigger studio animation **breathe** with 4 seconds duration

```json
{
  "type": "studio-animation",
  "params": {
    "value": "breathe",
    "duration": "4000" // in milliseconds
  }
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::
