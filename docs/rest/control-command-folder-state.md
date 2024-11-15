---
sidebar_position: 14
---

# Control Command & Folder State

To set command or folder to disabled / enabled you will just send a POST request to:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to **set command state**

```json
{
  "type": "set-command-state",
  "params": {
    "name": "blue",
    "value": false
  }
}
```

Raw JSON to **set command state**

```json
{
  "type": "set-folder-state",
  "params": {
    "name": "streaming",
    "value": false
  }
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::
