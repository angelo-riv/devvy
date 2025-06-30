const { decideTrade } = require("./tradeRouter");

const testSuites = [
  {
    inputs: [{ price: 80 }, { price: 150 }, { price: 99 }],
    expectedOutputs: ["HOLD", "SELL", "BUY"],
  },
  {
    inputs: [{ price: 100 }, { price: 90 }, { price: 85 }, { price: 95 }],
    expectedOutputs: ["HOLD", "BUY", "HOLD", "SELL"],
  },
  {
    inputs: [{ price: 120 }, { price: 115 }, { price: 125 }, { price: 130 }],
    expectedOutputs: ["HOLD", "BUY", "SELL", "HOLD"],
  },
];

for (const suite of testSuites) {
  // Optionally reset state here if decideTrade has a reset method
  if (typeof decideTrade.reset === "function") {
    decideTrade.reset();
  }

  for (let i = 0; i < suite.inputs.length; i++) {
    const result = decideTrade(suite.inputs[i]);
    console.log(result === suite.expectedOutputs[i] ? "True" : "False");
  }
}
