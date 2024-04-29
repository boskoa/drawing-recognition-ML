const fs = require("fs");
const constants = require("../common/constants");
const featureFunctions = require("../common/featureFunctions");
const utils = require("../common/utils");

console.log("Extracting feature functions...");

const samples = JSON.parse(fs.readFileSync(constants.SAMPLES));

for (const sample of samples) {
  const paths = JSON.parse(
    fs.readFileSync(`${constants.JSON_DIR}/${sample.id}.json`)
  );

  const functions = featureFunctions.inUse.map((f) => f.function);
  //sample.point = functions.map((f) => f(paths));
  sample.point = Object.values(functions[0](paths));
}

//const featureNames = featureFunctions.inUse.map((f) => f.name);
const featureNames = Array(samples[0].point.length).fill(0);

console.log("Generating splits...");

const trainingAmount = samples.length * 0.5;
const training = samples.slice(0, trainingAmount);
const testing = samples.slice(trainingAmount);

const minMax = utils.normalizePoints(training.map((s) => s.point));

utils.normalizePoints(
  testing.map((s) => s.point),
  minMax
);

fs.writeFileSync(
  constants.FEATURES,
  JSON.stringify({
    featureNames,
    samples: samples.map((s) => ({ point: s.point, label: s.label })),
  })
);

fs.writeFileSync(
  constants.FEATURES_JS,
  `const features = ${JSON.stringify({ featureNames, samples })};`
);

fs.writeFileSync(
  constants.TRAINING,
  JSON.stringify({
    featureNames,
    samples: training.map((s) => ({ point: s.point, label: s.label })),
  })
);

fs.writeFileSync(
  constants.TRAINING_CSV,
  utils.toCSV(
    [...featureNames, "Label"],
    training.map((t) => [...t.point, t.label])
  )
);

fs.writeFileSync(
  constants.TRAINING_JS,
  `const training = ${JSON.stringify({ featureNames, samples: training })};`
);

fs.writeFileSync(
  constants.TESTING_CSV,
  utils.toCSV(
    [...featureNames, "Label"],
    testing.map((t) => [...t.point, t.label])
  )
);

fs.writeFileSync(
  constants.TESTING,
  JSON.stringify({
    featureNames,
    samples: testing.map((s) => ({ point: s.point, label: s.label })),
  })
);

fs.writeFileSync(
  constants.TESTING_JS,
  `const testing = ${JSON.stringify({ featureNames, samples: testing })};`
);

fs.writeFileSync(
  constants.MIN_MAX_JS,
  `const minMax = ${JSON.stringify(minMax)};`
);

console.log("Done!");
