---
sidebar_position: 11
---

# Control Lumia On / Off State

To start, stop, or toggle Lumia On / Off state you will just send a POST request to:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to **start Lumia**

```json
{
  "type": "start-lumia",
  "params": {
    "value": true
  }
}
```

Raw JSON to **stop Lumia**

```json
{
  "type": "stop-lumia",
  "params": {
    "value": false
  }
}
```

Raw JSON to **toggle Lumia**

```json
{
  "type": "set-lumia",
  "params": {
    "value": null
  }
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::
