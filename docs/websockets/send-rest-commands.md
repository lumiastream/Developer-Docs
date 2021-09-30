---
sidebar_position: 2
---

# Sending Commands

If you've been following along in our last chapter we showed you how to send commands using our Rest API. You can still do this by using the same Body of the commands in the **[Rest section](../rest/get-settings)**

To send a command you will just send a stringified body on after connecting to your websocket:
```
{
	"type": "chat-command",
	"params: {
		"value": "blue"
	}
}
```