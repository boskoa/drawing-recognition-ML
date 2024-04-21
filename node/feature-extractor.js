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
  sample.point = functions.map((f) => f(paths));
}

const minMax = utils.normalizePoints(samples.map((s) => s.point));

const featureNames = featureFunctions.inUse.map((f) => f.name);

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
  constants.MIN_MAX_JS,
  `const minMax = ${JSON.stringify(minMax)};`
);

console.log("Done!");
