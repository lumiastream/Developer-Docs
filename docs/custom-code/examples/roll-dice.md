---
sidebar_position: 3
title: Roll dice
---

# Roll a dice with Text To Speech

You can use Javascript to randomly pick a number and if it lands on your chosen number the user will get a special Text To Speech shoutout

```js
async function() {
	const diceRoll = Math.ceil(Math.random()*6);

	if (diceRoll === 3) {
			tts({ message: "Congratulations {{username}}! You rolled a 3", voice: "default", volume: 100 })
			// you can switch between all the tts option that we support
			// tts({ message: "Congratulations {{username}}! You rolled a 3", voice: "Brian", volume: 100 })
	}

	// always make sure this is the last line in the code otherwise your computer may get slower due to memory leaks
	done();
}
```

:::tip

**code blocks** like the one above 👆 have a copy button on the **top right corner** click it then paste in Lumia stream

:::
