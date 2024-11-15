---
sidebar_position: 12
---

# Toggle Stream Mode

To toggle stream mode you will just send a POST request to:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to **stream mode on**

```json
{
  "type": "toggle-stream-mode",
  "params": {
    "value": true
  }
}
```

Raw JSON to **stream mode off**

```json
{
  "type": "toggle-stream-mode",
  "params": {
    "value": false
  }
}
```

Raw JSON to **toggle stream mode**

```json
{
  "type": "toggle-stream-mode",
  "params": {
    "value": null
  }
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::
