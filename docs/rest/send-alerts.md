---
sidebar_position: 5
---

# Sending Alerts

There is a way to simulate alerts in Lumia Stream by sending a POST request to:

```bash
POST http://localhost:39231/api/send?token=your_token
```

Raw JSON to send:

```json
{
  "type": "alert",
  "params": {
    "value": "twitch-follower"
  }
}
```

:::tip

Make sure you replace **your_token** with your actual token

:::

The users possible alerts may vary so you will want to retrieve their settings first as mentioned in the **[Getting Settings](./get-settings.md)** tutorial to make sure you're triggering the correct alerts.

The valid types for sending an alert are:

- lumiastream-donation
- lumiastream-lumiaOpened
- lumiastream-lumiaClosed
- lumiastream-streammodeOn
- lumiastream-streammodeOff
- lumiastream-raffleStart
- lumiastream-raffleStop
- lumiastream-raffleWinner
- lumiastream-spinwheelWinner
- lumiastream-pollStarted
- lumiastream-pollProgressed
- lumiastream-pollEnded
- lumiastream-viewerqueueStarted
- lumiastream-viewerqueueEnded
- twitch-extension
- twitch-points
- twitch-streamLive
- twitch-streamOffline
- twitch-firstChatter
- twitch-entrance
- twitch-follower
- twitch-subscriber
- twitch-giftSubscription
- twitch-raid
- twitch-bits
- twitch-redemption
- twitch-hypetrainStarted
- twitch-hypetrainProgressed
- twitch-hypetrainLevelProgressed
- twitch-hypetrainEnded
- twitch-pollStarted
- twitch-pollProgressed
- twitch-pollEnded
- twitch-predictionStarted
- twitch-predictionProgressed
- twitch-predictionLocked
- twitch-predictionEnded
- twitch-goalStarted
- twitch-goalProgressed
- twitch-goalEnded
- twitch-charityDonation
- twitch-charityCampaignStarted
- twitch-charityCampaignProgressed
- twitch-charityCampaignStopped
- twitch-categoryChanged
- twitch-clip
- twitch-channelJoin
- twitch-channelLeave
- twitch-banned
- twitch-timeout
- twitch-timeoutOver
- twitch-shoutoutReceive
- twitch-adStarted
- twitch-adStopped
- twitch-powerups
- youtube-streamLive
- youtube-streamOffline
- youtube-firstChatter
- youtube-entrance
- youtube-member
- youtube-subscriber
- youtube-superchat
- youtube-supersticker
- facebook-streamLive
- facebook-streamOffline
- facebook-firstChatter
- facebook-entrance
- facebook-follower
- facebook-reaction
- facebook-star
- facebook-support
- facebook-subscriptionGift
- facebook-share
- facebook-fan
- trovo-streamLive
- trovo-streamOffline
- trovo-firstChatter
- trovo-entrance
- trovo-channelJoin
- trovo-subscriber",
- trovo-follower",
- trovo-spell",
- trovo-giftSubscription
- trovo-raid
- tiktok-firstChatter
- tiktok-entrance
- tiktok-follower
- tiktok-like
- tiktok-gift
- tiktok-subscriber
- tiktok-share
- tiktok-streamEnd
- tiktok-newVideo
- kick-firstChatter
- kick-entrance
- kick-follower
- kick-subscriber
- kick-subscriptionGift
- kick-host
- kick-banned
- kick-unbanned
- discord-firstChatter
- discord-entrance
- streamlabs-donation
- streamlabs-charity
- streamlabs-merch
- streamlabs-redemption
- streamlabs-primegift
- streamelements-donation
- streamelements-merch
- streamelements-redemption
- extralife-donation
- donordrive-donation
- tiltify-campaignDonation
- tipeeestream-donation
- treatstream-treat
- patreon-campaignPledge
- obs-switchProfile
- obs-switchScene
- obs-sceneItemVisibility
- obs-sceneItemHidden
- obs-switch-transition
- obs-transitionBegin
- obs-transitionEnd
- obs-streamStarting
- obs-streamStopping
- obs-recordingStarting
- obs-recordingStopping
- obs-replayBufferSaved
- obs-verticalBacktrackSaved
- obs-vendorEvent
- slobs-switchSceneCollection
- slobs-switchScene
- slobs-sceneItemVisibility
- slobs-sceneItemHidden
- spotify-switchSong
- spotify-songPlayed
- spotify-songPaused
- youtubemusic-switchSong
- youtubemusic-songPlayed
- youtubemusic-songPaused
- nowplaying-switchSong
- nowplaying-songPlayed
- nowplaying-songPaused
- vlc-switchSong
- vlc-songPlayed
- vlc-songPaused
- pulse-heartrate
- pulse-calories
- twitter-follower
- twitter-like
- twitter-retweet
- woocommerce-order
- kofi-donation
- kofi-subscription
- kofi-commission
- kofi-shopOrder
- streamerbot-action
- fourthwall-shopOrder
- fourthwall-donation
- fourthwall-subscription
- fourthwall-giftpurchase
- crowdcontrol-effect
- vtubestudio-hotkeyTriggered
- vtubestudio-modelLoaded
- vtubestudio-animationStart
- vtubestudio-animationEnd
- vtubestudio-itemAdded
- vtubestudio-itemRemoved
- vtubestudio-backgroundChange

---

## Extra Settings

Certain alerts normally take in extra variables to determine the variation, the TTS, as well as what the Chat Bot will say. You can pass in Extra Settings by adding it to params in the POST request JSON:

```json
{
  "type": "alert",
  "params": {
    "value": "twitch-bits",
    "extraSettings": {
      "username": "lumia",
      "bits": 1000
    }
  }
}
```
