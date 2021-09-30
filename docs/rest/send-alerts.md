---
sidebar_position: 5
---

# Sending Alerts

There is a way to simulate alerts in Lumia Stream by sending a POST request to:

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "alert",
	"params": {
			"value": "twitch-follower"
	}
}
```

*Make sure you replace **your_token** with your actual token*

The users possible alerts may vary so you will want to retrieve their settings first as mentioned in the **[Getting Settings](./get-settings.md)** tutorial to make sure you're triggering the correct alerts.

The valid types for sending an alert are:

* twitch-follower
* twitch-subscriber
* twitch-bits
* twitch-host
* twitch-raid
* youtube-subscriber
* youtube-superchat
* youtube-supersticker
* youtube-member
* facebook-follower
* facebook-reaction
* facebook-star
* facebook-support
* facebook-share
* facebook-fan
* trovo-follower
* trovo-subscriber
* streamlabs-donation
* streamlabs-merch
* streamlabs-redemption
* streamlabs-primegift
* streamelements-donation
* obs-switchProfile
* obs-switchScene
* obs-switch-transition
* obs-streamStarting
* obs-streamStopping
* slobs-switchScene
* treatstream-treat
* pulse-heartrate
* pulse-calories

---

## Extra Settings

Certain alerts normally take in extra variables to determine the variation, the TTS, as well as what the Chat Bot will say. You can pass in Extra Settings by adding it to params in the POST request:

```
POST http://localhost:39231/api/send?token=your_token
{
	"type": "alert",
	"params": {
			"value": "twitch-follower",
			"extraSettings": {
				"username": "lumia",
				"bits": 1000
			}
	}
}
```
