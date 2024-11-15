---
sidebar_position: 13
---

# Control Queue State

To pause, resume, or clear queue you will just send a POST request to:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to **pause queue**

```json
{
  "type": "pause-queue"
}
```

Raw JSON to **resume queue**

```json
{
  "type": "resume-queue"
}
```

Raw JSON to **clear queue**

```json
{
  "type": "clear-queue"
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::
