---
sidebar_position: 4
title: Different Chatbot message for user levels
---

# Different Chatbot message for user levels

You can check the different userlevels for the person chatting and do different things based on their user level.
In this example we'll be sending different chatbot messages based on the users level.

```js
async function() {
	// {{userLevelsRaw}} returns an object with the various user levels on it. Since we want the original object here we're using getVariable instead of using template variables
	const userLevels = await getVariable('userLevelsRaw');

	if (!userLevels) {
		chatbot({ message: `Thanks for lurking in my stream {{username}}. You triggered {{command}}!` });
	} else if (userLevels.isSelf) {
		chatbot({ message: "Don't worry it's just me triggering a command named !{{command}}" });
	} else if (userLevels.subscriber || userLevels.tier3 || userLevels.tier2 || userLevels.tier1) {
		chatbot({ message: "Wow, you're a subscriber? Thanks for triggering {{command}}. Have a nice day!" });
	} else if (userLevels.mod) {
		chatbot({ message: 'Thank you for being a wonderful mod. My mod {{username}} triggered {{command}}!' });
	} else if (userLevels.vip) {
		chatbot({ message: 'VIPS raise the roof! {{username}}, the real VIP, triggered {{command}}!' });
	} else if (userLevels.follower) {
		chatbot({ message: `Thanks for being a loyal follower {{username}}. You triggered {{command}}!` });
	} else {
		chatbot({ message: `Thanks for lurking in my stream {{username}}. You triggered {{command}}!` });
	}

	// always make sure this is the last line in the code otherwise your computer may get slower due to memory leaks
	done();
}
```

:::tip

**code blocks** like the one above 👆 have a copy button on the **top right corner** click it then paste in Lumia stream

:::
