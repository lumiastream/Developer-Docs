---
sidebar_position: 10
---

# Back to default state

To trigger back to default state just send a POST request to:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON

```json
{
  "type": "to-default"
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::
