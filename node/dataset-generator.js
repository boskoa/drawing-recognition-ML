const fs = require("fs");
const constants = require("../common/constants");
const draw = require("../common/draw");
const { createCanvas } = require("canvas");
const utils = require("../common/utils");
const geometry = require("../common/geometry");
const featureFunctions = require("../common/featureFunctions");

const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

function generateImageFile(outputFile, paths) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw.paths(ctx, paths);

  /* const { vertices, hull } = geometry.minimumBoundingBox({
    points: paths.flat(),
  });
  const roundness = geometry.roundness(hull);
  const R = Math.floor(255 * roundness ** 3);
  const B = Math.floor(255 * (1 - roundness ** 3));
  draw.path(ctx, [...hull, hull[0]], `rgb(${R}, 0, ${B})`, 7); */

  const pixels = featureFunctions.getPixels(paths);
  const size = Math.sqrt(pixels.length);
  const imgData = ctx.getImageData(0, 0, size, size);

  for (let i = 0; i < pixels.length; i++) {
    const alpha = pixels[i];
    const startIndex = i * 4;
    imgData.data[startIndex] = 0;
    imgData.data[startIndex + 1] = 0;
    imgData.data[startIndex + 2] = 0;
    imgData.data[startIndex + 3] = alpha;
  }

  ctx.putImageData(imgData, 0, 0);

  /* const complexity = pixels.filter((c) => c !== 0).length;
  draw.text(ctx, complexity, "blue"); */

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputFile, buffer);
}

fileNames.forEach((fn) => {
  const content = fs.readFileSync(`${constants.RAW_DIR}/${fn}`);
  const { session, student, drawings } = JSON.parse(content);

  for (const label in drawings) {
    if (!utils.flaggedSamples.includes(id)) {
      samples.push({
        id,
        label,
        student_name: student,
        student_id: session,
      });

      const paths = drawings[label];
      fs.writeFileSync(
        `${constants.JSON_DIR}/${id}.json`,
        JSON.stringify(paths)
      );

      generateImageFile(`${constants.IMG_DIR}/${id}.png`, paths);
    }

    utils.printProgress(id, fileNames.length * Object.keys(drawings).length);
    id++;
  }
});

fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));

fs.writeFileSync(
  constants.SAMPLES_JS,
  `const samples = ${JSON.stringify(samples)};`
);
