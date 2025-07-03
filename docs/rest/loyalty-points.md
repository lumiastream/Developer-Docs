---
sidebar_position: 18
---

# Loyalty Points

Lumia Stream has a Loyalty Points system that developers are free to update.

You can add / remove Loyalty Points using the same API like this:

```bash
POST http://localhost:39231/api/send?token=your_token
```

```json
{
	"type": "add-loyalty-points",
	"params": {
		"value": 100,
		"username": "AnyUser",
		"platform": "twitch"
	}
}
```

Or to decrement just use minus (`-`)

```json
{
	"type": "add-loyalty-points",
	"params": {
		"value": -100,
		"username": "BadUser",
		"platform": "kick"
	}
}
```
