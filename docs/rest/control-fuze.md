---
sidebar_position: 9
---

# Control Fuze

To start, stop, or toggle fuze you will just send a POST request to:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to **start fuze**

```json
{
  "type": "start-fuze",
  "params": {
    "value": true
  }
}
```

Raw JSON to **stop fuze**

```json
{
  "type": "stop-fuze",
  "params": {
    "value": false
  }
}
```

Raw JSON to **toggle fuze**

```json
{
  "type": "toggle-fuze",
  "params": {
    "value": null
  }
}
```

Raw JSON to contorl **audio sensitivity**

```json
{
  "type": "fuze-audio-sensitivity",
  "params": {
    "value": 50 // Below 100 will make the volume less sensitive
  }
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::
