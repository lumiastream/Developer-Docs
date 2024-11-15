---
sidebar_position: 16
---

# Update & Get variable

To get or update variable you will just send a POST request to:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to **get variable value**

```json
{
  "type": "get-variable-value",
  "params": {
    "name": "twitch_username"
  }
}
```

Output will be

```json
{
  "message": "Your_Twitch_Username",
  "status": 200
}
```

Raw JSON to **update variable value**

```json
{
  "type": "update-variable-value",
  "params": {
    "name": "customVar",
    "value": "Updated_value"
  }
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::
