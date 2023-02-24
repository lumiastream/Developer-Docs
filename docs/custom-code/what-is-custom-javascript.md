---
sidebar_position: 1
title: What is custom javascript?
description: Custom Code allows you to extend Lumia Stream functionality by adding your own scenarios to commands and alerts with code all using JavaScript
---

Custom Javascript will allow you to extend Lumia Stream's functionality by adding conditions to what you want to happen. You can even make your own scenarios that trigger other commands/alerts with code.

Before we begin while being a coder helps, we will try to give as many examples for you to copy and paste so that you won't need to be a coder to do cool things. Let's begin

There are two areas within Lumia Stream which allow for custom javascript code to be run. Alerts and Commands. Both of them contain an "Advanced" category when editing where custom code can be utilized. The following is an example utilizing Commands.

Open Lumia Stream and head to `Commands` > `Chat` then `edit` or `add a new command` that you want to activate javascript code on.

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
