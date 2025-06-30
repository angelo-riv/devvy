const { decideTrade } = require("./tradeRouter");

// Multiple test sequences simulating different price feeds
const testSuites = [
  {
    name: "Test Sequence 1",
    inputs: [{ price: 80 }, { price: 150 }, { price: 99 }],
    expectedOutputs: ["HOLD", "SELL", "BUY"],
  },
  {
    name: "Test Sequence 2",
    inputs: [{ price: 100 }, { price: 90 }, { price: 85 }, { price: 95 }],
    expectedOutputs: ["HOLD", "BUY", "HOLD", "SELL"],
  },
  {
    name: "Test Sequence 3",
    inputs: [{ price: 120 }, { price: 115 }, { price: 125 }, { price: 130 }],
    expectedOutputs: ["HOLD", "BUY", "SELL", "HOLD"],
  },
];

for (const suite of testSuites) {
  // Reset internal state if your decideTrade supports it
  if (typeof decideTrade.reset === "function") {
    decideTrade.reset();
  }

  let passed = true;
  for (let i = 0; i < suite.inputs.length; i++) {
    const result = decideTrade(suite.inputs[i]);
    if (result !== suite.expectedOutputs[i]) {
      passed = false;
      break;
    }
  }

  console.log(passed ? "True" : "False");
}
