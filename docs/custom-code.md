---
sidebar_position: 2
title: Custom Javascript Feature
description: Custom Javascript will allow you to extend Lumia Stream functionality by adding your own senario with code
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

Before you freakout about coding we tell you that this page is not just for developers so you can follow and copy what you need and past it directly in your Lumia Stream app so easily.

This feature will allow you to extend Lumia Stream functionality by adding condition to what you want to happen and you can even make your own senario with code so let's get started.

Open Lumia Stream go to `Commands` then <Highlight>edit</Highlight> or <Highlight>add new command</Highlight> that you want to activate javascript code on.

Next on the tabs at the top click on `Custom Javascript`

You'll see an input where you can put all the code that you copy from the sections below like this

// img of the input from lumia <Highlight>here</Highlight>

<!-- ![Api Settings](/img/tutorial/api-docs-location.jpg) -->

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

## Code Examples

### Counter

You can set up a custom counter so that you can trigger multiple things based on the counter value

e.g. the code bellow will trigger a command named **'luky-number-35'** when the **counter = 35**

```js
async function() {

	// You can also get your variable's value that you just set here
	let myCount = await getVariable('mycount');

	if (!myCount) {
		// If variable does not exist it will create it
		myCount = await setVariable('mycount', 10);
	}

	myCount++;

	if (myCount === 35) {
        // call the command named luky-number-35
		callCommand({ value: 'luky-number-35' });
        // show a popup message in the Lumia stream app with '{{username}} is the luky one' inside
        showToast('{{username}} is the luky one');
	}

	// always make sure this is the last line in the code otherwise your computer may get slower due to memory leaks
	done();

}
```
