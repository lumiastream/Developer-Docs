---
sidebar_position: 2
title: Custom Javascript Feature
description: Custom Javascript will allow you to extend Lumia Stream functionality by adding your own scenarios to commands and alerts with code
---

# Custom javascript code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

export const Highlight = ({children}) => (
<span
style={{
      backgroundColor: '#F57FAE',
      color:'#fff',
      borderRadius: '2px',
      padding: '0.2rem',
    }}>
{children}
</span>
);

<TOCInline toc={toc} />

## What is custom javascript code

Custom Code will allow you to extend Lumia Stream's functionality by adding conditions to what you want to happen. You can even make your own scenarios that trigger other commands/alerts with code.

Before we begin while being a coder helps, we will try to give as many examples for you to copy and paste so that you won't need to be a coder to do cool things. Let's begin

Open Lumia Stream and head to `Commands` > `Chat` then <Highlight>edit</Highlight> or <Highlight>add a new command</Highlight> that you want to activate javascript code on.

![Add Command](/img/code/add-command.jpg)

Next on the tabs at the top click on `Custom Javascript`

![Custom Code Tab](/img/code/custom-code-tab.jpg)

You'll see an input where you can put all the code that you copy from the sections below like this

![Code Input](/img/code/code-prompt.jpg)

:::tip

**code blocks** like the one below 👇 have a copy button on the **top right corner** click it then paste in Lumia stream

:::

```js
async function() {

    // put your code inside here

    // always make sure this is the last line in the code otherwise your computer may get slower due to memory leaks
    done();

}
```

## Important Notes

* You can use variables inside of your script that are replaced with the variables before the script is even ran. So if you do `tts({ message: "{{username}}" })`, it will replace the `"{{username}}"` with whoever is calling the command before the script is even ran. Take note that the variable is wrapped in quotes to be used as a string since when it is replaced it does not automatically add the quotes.
* By default variable values from the command/alert will be passed to the command/alert that you call. You can bypass those values as well as add new ones by passing in `variableValues` into the command. e.g: `callCommand({ value: 'cool-people', variableValues: { 'username': 'lumia' }})`
* Everything ran is in a safe JavaScript worker thread away from the Lumia Stream thread so no need to worry about scripts slowing down the app. Make sure you do avoid memory leaks by calling `done()` when you're done with your script
* Come to our Discord to share your code with others to extend Lumia's functionality in a variety of ways
  
## Helper functions

* `done()`: Done tell Lumia Stream that the script is complete and that the thread is safe to close now
* `showToast({ message: string; time?: number })`: Show toast will show a popup notification in Lumia. The time for how long it shows is in milliseconds. Leave it 0 to show forever
* `addLog(message: string)`: Show a log in the dashboard to keep track of things
* `getVariable(name: string)`: Retrieve a variables value based on it's name
* `setVariable({ name: string; value: string | number })`: Retrieve a variables value based on it's name
* `callAlert({ name: string; variation?: string; variableValues?: {[key: string]: string|number } })`: Call an alert based on your conditions. You can also call a variation given it's name. When calling an alert/command from custom code the variableValues will be inherited from the parent, but you can also override variable values by passing it in to the call function.
* `callCommand({ name: string; variableValues?: {[key: string]: string|number } })`: Call a command based on your conditions. When calling an alert/command from custom code the variableValues will be inherited from the parent, but you can also override variable values by passing it in to the call function.
* `callTwitchPoint({ name: string; variableValues?: {[key: string]: string|number } })`: Call a twitch point command based on your conditions. When calling an alert/command from custom code the variableValues will be inherited from the parent, but you can also override variable values by passing it in to the call function.
* `callTwitchExtension({ name: string; variableValues?: {[key: string]: string|number } })`: Call a twitch extension command based on your conditions. When calling an alert/command from custom code the variableValues will be inherited from the parent, but you can also override variable values by passing it in to the call function.
* `callTrovoSpell({ name: string; variableValues?: {[key: string]: string|number } })`: Call a trovo spell command based on your conditions. When calling an alert/command from custom code the variableValues will be inherited from the parent, but you can also override variable values by passing it in to the call function.
* `readFile(filePath: string)`: Read from a file on your local computer to get the contents of it to be displayed in your code. This is useful for other Apps that write and read to files so you can combine the usage of them in Lumia. To keep things consistent, try to use an absolute file path
* `writeFile({ filePath: string; value: string | number; append?: boolean })`: Read from a file on your local computer to get the contents of it to be displayed in your code. This is useful for other Apps that write and read to files so you can combine the usage of them in Lumia. OBS Text source is a great exmaple of this. You can optionally pass in an `append` to append to a text file instead of overwriting the whole file. When using append you can create a new line by starting with a blank line`
* `tts({ message: string; voice?: string; volume?: number })`: You can trigger Text To Speech directly inside of your code. You can even choose the voice and set the volume optionally
* `chatbot({ message: string; site?: 'twitch' | 'youtube' | 'facebook' | 'trovo' | 'glimesh'; color?: string; chatAsSelf?: boolean })`: You can trigger a Chat bot directly inside of your code. You can even change the color of the message, whether to chat as your self or the bot, and the ability to change the site.
* `getToken(connection: "twitch" | "twitchChatbot" | "youtube" | "facebook" | "glimesh" | "trovo" | "streamlabs" | "streamelements" | "treatstream" | "tipeeestream" | "tiltify" | "patreon" | "woocommerce" | "discord" | "twitter" | "spotify" | "pulsoid" | "wyze" | "homeassistant" | "govee" | "wled" )`: When you need to call a request that we don't directly support you can get the access token from Lumia before making the call. This is helpful for things where you need to call for instance the Twitch API, but you don't want to handle tokens and refreshing inside of your scripts. More examples of this below
* `getClientId(connection: "twitch")`: When calling requests with Twitch's API you will need to pass in a Client-ID to the headers. We provide a Client ID that you can use to call the different api's with the permissions the user has selected. Check out [Twitch's developers docs](https://dev.twitch.tv/docs/api/reference) to learn what you can do

## Code Examples

### Roll a dice with Text To Speech

You can use Javascript to randomly pick a number and if it lands on your chosen number the user will get a special Text To Speech shoutout

```js
async function() {
	const diceRoll = Math.ceil(Math.random()*6);

	if (diceRoll === 3) {
			tts({ message: "Congratulations {{username}}! You rolled a 3", voice: "Brian", volume: 100 })
	}

	// always make sure this is the last line in the code otherwise your computer may get slower due to memory leaks
	done();
}
```

### Counter

You can set up a manual counter so that you can trigger multiple things based on the counter value

e.g. the code below will trigger a command named **'money-12'** when the **counter = 12**

```js
async function() {

	// You can get your variable's value that you just set here
	let redeemCount = await getVariable('redeemCount');

	if (!redeemCount) {
		// If variable does not exist it will create it
		redeemCount = await setVariable('redeemCount', 10);
	}

	redeemCount++;

	if (redeemCount === 12) {
			// call the command named money-12
			callCommand({ value: 'money-12' });
			// show a popup message in the Lumia stream app with '{{username}} is the 12th redeemer' inside
			showToast({ message: '{{username}} is the 12th redeemer' });
	}

	// always make sure this is the last line in the code otherwise your computer may get slower due to memory leaks
	done();
}
```

### Read/Write to a file to keep track of subscribers

You can read from a file and get values from it as well as write to a file.
This can be very useful if other apps are reading and writing to a text file. An example of this is OBS text sources

```js
async function() {
	// You have the ability to overwrite the whole file by setting append to false, or appending to the file in case you would like to keep a log of things
	await writeFile({ file: 'C:\\Users\\Lumia\\Desktop\\lastSubscriber.txt', value: '{{username}}', append: true });

	// You can get your variable's value that you just set here
	const lastSubscribers = await readFile('C:\\Users\\Lumia\\Desktop\\lastSubscriber.txt');

	showToast({ message: 'The last subscribers were: ' + lastSubscribers });

	// always make sure this is the last line in the code otherwise your computer may get slower due to memory leaks
	done();
}
```

### Randomly getting the latest Twitch Clip from a user

You can call requests from integrations that we support that have an access token. You can also pass in variable values when calling other commands/alerts to pass in extra data that you may need in that command.

```js
async function() {
	try {
		const twitchToken = await getToken('twitch');
		const twitchClientId = await getClientId('twitch');

		// userId is a variable that comes from chat commands. This will get the clips of the user who's chatting
		const clipsRes = await fetch('https://api.twitch.tv/helix/clips?broadcaster_id={{userId}}', {
			headers: {
				Authorization: `Bearer ${twitchToken}`,
				'Client-ID': twitchClientId
			}
		});
		const clips = (await clipsRes.json())?.data;
		const randomClip = clips[Math.floor(Math.random() * clips.length)];
		showToast({ message: 'Random clip chosen: ' + randomClip.title });
		chatbot({ message: `${randomClip.title}: ${randomClip.url}` });
	} catch (err) {
		showToast({ message: 'error: ' + err.message });
	}

	done();
}
```
