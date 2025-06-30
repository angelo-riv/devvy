# 🪙 Node.js Trading Bot Challenge

Welcome to the Trading Bot Challenge! Your task is to implement a smart decision-making function for a trading bot using Node.js.

---

## 🚀 Objective

You must implement the `decideTrade()` function inside:


This function will receive a single object called `marketData`, which contains **real-time price data**. Based on this input, your bot must decide one of three actions:

- `"BUY"` – if the bot detects a good buying opportunity
- `"SELL"` – if the bot detects a good selling opportunity
- `"HOLD"` – if no action should be taken

---

## 🧠 Example Input

Your function will be called like this:

```js
decideTrade({ price: 123.45 })
