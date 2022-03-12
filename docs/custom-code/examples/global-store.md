---
sidebar_position: 6
title: Global Store (Persistent Storage)
---

# Storing data for Custom Code

We expose a global store that you can use with your custom code to store any data type that you need to and it will be persisted. This is useful to store things like arrays and objects without needing to store them in variables.

There are 4 different functions that you can use with the Store:

```md
- getStore()
- getStoreItem(name: string)
- setStore({ name: string; value: any })
- resetStore()
```

```js
async function() {
	let tempUsers = await getStoreItem('users');
	if (!tempUsers) {
		tempUsers = [];
	}
	tempUsers.push("{{username}}");
	await setStore({ name: 'users', value: tempUsers });
	showToast({ message: tempUsers.length, time: 10000 });
	done();
}
```

:::tip

**code blocks** like the one above 👆 have a copy button on the **top right corner** click it then paste in Lumia stream

:::
