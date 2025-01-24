---
sidebar_position: 5
title: Track subscribers
---

# Read/Write to a file to keep track of subscribers

You can read from a file and get values from it as well as write to a file.
This can be very useful if other apps are reading and writing to a text file. An example of this is OBS text sources

```js
async function() {
	// You have the ability to overwrite the whole file by setting append to false, or appending to the file in case you would like to keep a log of things
	await writeFile({ path: 'C:	\\Users\\Lumia\\Desktop\\lastSubscriber.txt', message: '{{username}}\n', append: true });

	// You can get your variable's value that you just set here
	const lastSubscribers = await readFile('C:\\Users\\Lumia\\Desktop\\lastSubscriber.txt');

	showToast({ message: 'The last subscribers were: ' + lastSubscribers });

	// always make sure this is the last line in the code otherwise your computer may get slower due to memory leaks
	done();
}
```

:::tip

**code blocks** like the one above 👆 have a copy button on the **top right corner** click it then paste in Lumia stream

:::
