---
sidebar_position: 3
title: Important notes
---

# Important notes

- You can use variables inside of your script that are replaced with the variables before the script is even ran. So if you do `tts({ message: "{{username}}" })`, it will replace the `"{{username}}"` with whoever is calling the command before the script is even ran. Take note that the variable is wrapped in quotes to be used as a string since when it is replaced it does not automatically add the quotes.

- By default variable values from the command/alert will be passed to the command/alert that you call. You can bypass those values as well as add new ones by passing in `variableValues` into the command. e.g: `callCommand({ value: 'cool-people', variableValues: { 'username': 'lumia' }})`

- Everything ran is in a safe JavaScript worker thread away from the Lumia Stream thread so no need to worry about scripts slowing down the app. Make sure you do avoid memory leaks by calling `done()` when you're done with your script

<!-- Come to our [**Discord**](https://discord.gg/R8rCaKb) to **share your code** with others to **extend Lumia's functionality** in a variety of ways -->

**Share your code** with our community in [**Discord**](https://discord.gg/R8rCaKb) and help **extending Lumia's functionality**

**Checkout the use case examples in the next section**
