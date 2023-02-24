---
sidebar_position: 3
title: Custom actions
description: Custom Actions allow you to tap into how Lumia Stream calls actions from the inside
---

`Custom Actions` allow you to tap into how Lumia Stream calls actions from the inside.
`Custom Actions` are mainly meant for things that we haven't added as a `Helper function` yet. For instance, actions for Spotify, Twitch, Streamer.Bot etc are all actions that we do not have a have helper functions for. This is where an action will step in.

You can use actions by just passing in one object, or an array of objects.
If you pass in an array of actions then any action that can be awaited will be wait until the promise has been resolved.

This documentation for every action we use in Lumia can get extremely broad, so we will give examples for different actions, but if you get stuck please visit our [**Discord**](https://discord.gg/R8rCaKb) to ask us any questions.

Let's get started:

### Generic Action

`actions([ { base: "lumia", type: "tts", value: { message: "Hello" }, variables: {} } ]);`:

#### Before we begin, let's dissect this.

`base`: will be the base of actions that can be used with Custom Code. The different bases are:
`delay, lumia, overlay, api, websocket, commandRunner, inputEvent, obs, slobs, twitch, twitter, streamerbot, midi, osc, artnet, mqtt, serial, broadlink, spotify, vlc, voicemod`

`type`: Every base has different action types. For instance, the base `lumia` has: `chatbot, tts, setStreamMode, toggleStreamMode` and much more.
To find the list of types that each base has below. Check in the side bar to quickly get to the base you're interested in.

`value`: can sometimes be an object and sometimes a string, it all depends on the `base` and `type`

`variables`: allows you to send in different variables for each action. But do note that the variables that are already on the command/alert will also be spread on to this variables object. Variables are not required

There are more fields that are sometimes used in actions. We will try to list out as many common examples down below along with the schema for them

#### More documentation coming soon
