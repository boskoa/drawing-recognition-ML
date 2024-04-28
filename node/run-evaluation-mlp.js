const constants = require("../common/constants");
const utils = require("../common/utils");
const MLP = require("../common/classifiers/mlp");
const fs = require("fs");
const { createCanvas } = require("canvas");

console.log("Running classification...");

const { samples: trainingSamples } = JSON.parse(
  fs.readFileSync(constants.TRAINING)
);

const mlp = new MLP(
  [trainingSamples[0].point.length, 10, utils.classes.length],
  utils.classes
);

if (fs.existsSync(constants.MODEL)) {
  mlp.load(JSON.parse(fs.readFileSync(constants.MODEL)));
}

mlp.fit(trainingSamples, 1000);

fs.writeFileSync(constants.MODEL, JSON.stringify(mlp));
fs.writeFileSync(constants.MODEL_JS, `const model = ${JSON.stringify(mlp)};`);

const { samples: testingSamples } = JSON.parse(
  fs.readFileSync(constants.TESTING)
);

let totalCount = 0;
let correctCount = 0;

for (const sample of testingSamples) {
  const { label: predictedLabel } = mlp.predict(sample.point);
  if (predictedLabel === sample.label) {
    correctCount++;
  }
  totalCount++;
}

console.log(
  `Accuracy: ${correctCount} / ${totalCount} --> ${utils.formatPercentage(
    correctCount / totalCount
  )}`
);

console.log("Generating decision boundary...");

const canvas = createCanvas(100, 100);
const ctx = canvas.getContext("2d");

for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    const point = [x / canvas.width, 1 - y / canvas.height];
    while (point.length < trainingSamples[0].point.length) {
      point.push(0.2);
    }
    const { label } = mlp.predict(point);
    const color = utils.styles[label].color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  utils.printProgress(x + 1, canvas.width);
}

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(constants.DECISION_BOUNDARY, buffer);

console.log("Done!");
