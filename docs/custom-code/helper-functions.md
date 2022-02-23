---
sidebar_position: 2
title: Helper functions
description: Helper functions are a premade code that helps you build your custom scripts
---

These helper functions are a premade code using it will help you build your custom code like you want you can use as many or as low as you want, also you'll find `use case examples` in the next section

`done({ shouldStop?: boolean; variables?: {[key: string]: string | number }}?)`: Done tell Lumia Stream that the script is complete and that the thread is safe to close now. You can also stop the command/alert in it's track by passing shouldStop true into the parameters.
If you would like to modify/add variables that other actions could use, you can return them in the variables parameter.

```js
// Baisc done
async function() {
    done();
}
// Should stop
async function() {
    done({ shouldStop: true });
}
// Passing variables
async function() {
    done({ variables: { message: "Message changed" } });
}
```

:::tip

**code blocks** like the one above 👆 have a copy button on the **top right corner** click it then paste in Lumia stream

:::

`showToast({ message: string; time?: number })`: Show toast will show a popup message notification in Lumia. The time for how long it shows is in milliseconds. Leave it 0 to show forever

```js
async function() {
	// shows a message popup saying command used for 200 milliseconds and the popup will close
    showToast({ message: "command used", time: 200 })

	// doing the same as the above but the popup does not close automaticaly
    showToast({ message: "command used"; time: 0 })

	// you can also just send the message which by default the popup does not close automaticaly
    showToast({ message: "command used"})
}
```

`addLog(message: string)`: Show a log in the dashboard to keep track of things

```js
async function() {
	//shows in the logs section when this command is executed
    addLog('log this command used')
}
```

`getVariable(name: string)`: Retrieve a variables value based on it's name

```js
async function() {
	//so if you have a variable named "my variable" in the variable page this code will get it's value
    getVariable('my variable')
}
```

`setVariable({ name: string; value: string | number })`: creates a variable with name and value provided

```js
async function() {
	//this creates a variable named "coins" with the value of 3
    setVariable({ name: 'coins'; value: 3 })
}
```

`callAlert({ name: string; variation?: string; variableValues?: {[key: string]: string|number } })`: Call an alert based on your conditions. You can also call a variation given it's name. When calling an alert/command from custom code the variableValues will be inherited from the parent, but you can also override variable values by passing it in to the call function.

```js
async function() {
	//this will call alert called 'police' and call the variation of it named 'policePurple' and change the variable named siren to 3
    callAlert({ name: 'police', variation: 'policePurple', variableValues: {'siren': 3 } })
}
```

`callCommand({ name: string; variableValues?: {[key: string]: string|number } })`: Call a command based on your conditions. When calling an alert/command from custom code the variableValues will be inherited from the parent, but you can also override variable values by passing it in to the call function.

```js
async function() {
	//this will call command called 'cheers' and change the variable named "message" to the value "you are awesome"
    callCommand({ name: 'cheers', variableValues: {'message': 'you are awesome' } })
}
```

`callTwitchPoint({ name: string; variableValues?: {[key: string]: string|number } })`: Call a twitch point command based on your conditions. When calling an alert/command from custom code the variableValues will be inherited from the parent, but you can also override variable values by passing it in to the call function.

```js
async function() {
	//this will call Twitch Point called 'point' and change the variable named "message" to the value "you are awesome"
    callTwitchPoint({ name: 'point', variableValues: {'message': "you are awesome" } })
}
```

`callTwitchExtension({ name: string; variableValues?: {[key: string]: string|number } })`: Call a twitch extension command based on your conditions. When calling an alert/command from custom code the variableValues will be inherited from the parent, but you can also override variable values by passing it in to the call function.

```js
async function() {
	//this will call Twitch Extension called 'point' and change the variable named "message" to the value "you are awesome"
    callTwitchExtension({ name: 'point', variableValues: {'message': "you are awesome" } })
}
```

`callTrovoSpell({ name: string; variableValues?: {[key: string]: string|number } })`: Call a trovo spell command based on your conditions. When calling an alert/command from custom code the variableValues will be inherited from the parent, but you can also override variable values by passing it in to the call function.

```js
async function() {
	//this will call trovo spell called 'patronus' and change the variable named "message" to the value "you are awesome"
    callTrovoSpell({ name: 'patronus', variableValues: {'message': "you are awesome" } })
}
```

`readFile(path: string)`: Read from a file on your local computer to get the contents of it to be displayed in your code. This is useful for other Apps that write and read to files so you can combine the usage of them in Lumia. To keep things consistent, try to use an absolute file path

```js
async function() {
	//this will read the file from this path
    readFile('C:\Documents\Lumiastream\helper.txt')
}
```

`writeFile({ path: string; value: string | number; append?: boolean })`: Read from a file on your local computer to get the contents of it to be displayed in your code. This is useful for other Apps that write and read to files so you can combine the usage of them in Lumia. OBS Text source is a great exmaple of this. You can optionally pass in an `append` to append to a text file instead of overwriting the whole file. When using append you can create a new line by starting with a blank line

```js
async function() {
	//this will create a new file in the 'C:\Documents\Lumiastream\' named helper.txt and add the text "text inside this file" inside that file
	writeFile({ path: 'C:\Documents\Lumiastream\helper.txt', value: 'text inside this file', append: true })
}
```

`tts({ message: string; voice?: string; volume?: number })`: You can trigger Text To Speech directly inside of your code. You can even choose the voice and set the volume optionally

```js
async function() {
	//this will read the message with text to speach using the voice that you added with the volume 60%
    tts({ message: 'Lumia stream loves you',voice: 'Brian', volume: 60 })
}
```

`chatbot({ message: string; site?: 'twitch' | 'youtube' | 'facebook' | 'trovo' | 'glimesh'; color?: string; chatAsSelf?: boolean })`: You can trigger a Chat bot directly inside of your code. You can even change the color of the message, whether to chat as your self or the bot, and the ability to change the site.

```js
async function() {
	//this will send a custom chatbot message "hello from Lumia Stream" to twitch colored with this hex code "#F57FAE" shown in the chat as your self
    chatbot({ message: 'hello from Lumia Stream', site: "twitch",color:"#F57FAE",chatAsSelf:true })
}
```

`getToken(connection: "twitch" | "twitchChatbot" | "youtube" | "facebook" | "glimesh" | "trovo" | "streamlabs" | "streamelements" | "treatstream" | "tipeeestream" | "tiltify" | "patreon" | "woocommerce" | "discord" | "twitter" | "spotify" | "pulsoid" | "wyze" | "homeassistant" | "govee" | "wled" )`: When you need to call a request that we don't directly support you can get the access token from Lumia before making the call. This is helpful for things where you need to call for instance the Twitch API, but you don't want to handle tokens and refreshing inside of your scripts. More examples of this below

```js
async function() {
	//This will generate a Lumia access token
    getToken('twitch')
}
```

`getClientId(connection: "twitch")`: When calling requests with Twitch's API you will need to pass in a Client-ID to the headers. We provide a Client ID that you can use to call the different api's with the permissions the user has selected. Check out [Twitch's developers docs](https://dev.twitch.tv/docs/api/reference) to learn what you can do

```js
async function() {
	//this will generate a client id
    getClientId('twitch')
}
```
