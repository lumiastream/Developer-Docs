---
sidebar_position: 1
---

# Clone the repo

## Javascript

To get started as fast as possible we're going to clone the example git repo that we have setup that can be found at: [https://github.com/lumiastream/lumiastream-socket-demo-js](https://github.com/lumiastream/lumiastream-socket-demo-js)

We will head to our terminal and we will enter:
> git clone https://github.com/lumiastream/lumiastream-socket-demo-js

Now we will `cd` into the directory with:
> cd lumiastream-socket-demo-js

and run:
> npm install

After this open up the main.js file in your favorite editor and edit line 3 by pasting in the token that we received in the **Get a token page**

Now let's run the script from the terminal with:
> npm run start

This sample repo will first send a twitch-follower alert to demonstrate that it can also send the same rest commands through Websockets and then it will stay on to listen to events that are coming in through Lumia Stream.

---

## Python

To get started as fast as possible we're going to clone the example git repo that we have setup that can be found at: [https://github.com/lumiastream/lumiastream-socket-demo-py](https://github.com/lumiastream/lumiastream-socket-demo-py)

We will head to our terminal and we will enter:
> git clone https://github.com/lumiastream/lumiastream-socket-demo-py

Now we will `cd` into the directory with:
> cd lumiastream-socket-demo-py

and run:
> pip install --requirement requirements.txt

After this open up the main.py file in your favorite editor and edit line 3 by pasting in the token that we received in the **Get a token page**

Now let's run the script from the terminal with:
> python main.py

This sample repo will first send a twitch-follower alert to demonstrate that it can also send the same rest commands through Websockets and then it will stay on to listen to events that are coming in through Lumia Stream.
