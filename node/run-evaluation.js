const constants = require("../common/constants");
const utils = require("../common/utils");
const KNN = require("../common/classifiers/knn");
const fs = require("fs");
const { createCanvas } = require("canvas");

console.log("Running classification...");

const { samples: trainingSamples } = JSON.parse(
  fs.readFileSync(constants.TRAINING)
);

const kNN = new KNN(trainingSamples, 8);

const { samples: testingSamples } = JSON.parse(
  fs.readFileSync(constants.TESTING)
);

let totalCount = 0;
let correctCount = 0;

for (const sample of testingSamples) {
  const { label: predictedLabel } = kNN.predict(sample.point);
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

const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext("2d");

for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    const point = [x / canvas.width, 1 - y / canvas.height];
    const { label } = kNN.predict(point);
    const color = utils.styles[label].color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }
}

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(constants.DECISION_BOUNDARY, buffer);

console.log("Done!");
