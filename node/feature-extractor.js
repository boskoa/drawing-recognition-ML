const fs = require("fs");
const constants = require("../common/constants");
const featureFunctions = require("../common/featureFunctions");

console.log("Extracting feature functions...");

const samples = JSON.parse(fs.readFileSync(constants.SAMPLES));

for (const sample of samples) {
  const paths = JSON.parse(
    fs.readFileSync(`${constants.JSON_DIR}/${sample.id}.json`)
  );

  sample.point = [
    featureFunctions.getPathCount(paths),
    featureFunctions.getPointCount(paths),
  ];
}

const featureNames = ["Path count", "Point count"];

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

console.log("Done!");
