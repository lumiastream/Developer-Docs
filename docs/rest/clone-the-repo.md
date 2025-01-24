---
sidebar_position: 1
---

# Clone the repo

## Javascript

To get started as fast as possible we're going to clone the example git repo that we have setup that can be found at: [https://github.com/lumiastream/lumiastream-api-demo-js](https://github.com/lumiastream/lumiastream-api-demo-js)

We will head to our terminal and we will enter:

```bash
git clone https://github.com/lumiastream/lumiastream-api-demo-js
```

Now we will `cd` into the directory with:

```bash
cd lumiastream-api-demo-js
```

and run:

```bash
npm install
```

After this open up the main.js file in your favorite editor and edit line 3 by pasting in the token that we received in the **Get a token page**

Now let's run the script from the terminal with:

```bash
npm run start
```

This sample repo will first grab your configuration that you have setup in Lumia and then first trigger the command blue if it exists and then it will trigger a generic color for a duration of 4 seconds

---

## Python

To get started as fast as possible we're going to clone the example git repo that we have setup that can be found at: [https://github.com/lumiastream/lumiastream-api-demo-py](https://github.com/lumiastream/lumiastream-api-demo-py)

We will head to our terminal and we will enter:

```bash
git clone https://github.com/lumiastream/lumiastream-api-demo-py
```

Now we will `cd` into the directory with:

```bash
cd lumiastream-api-demo-py
```

and run:

```bash
pip install --requirement requirements.txt
```

After this open up the main.py file in your favorite editor and edit line 3 by pasting in the token that we received in the **Get a token page**

Now let's run the script from the terminal with:

```bash
python main.py
```

This sample repo will first grab your configuration that you have setup in Lumia and then first trigger the command blue if it exists and then it will trigger a generic color for a duration of 4 seconds
