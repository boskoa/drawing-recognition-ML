const fs = require("fs");
const constants = require("../common/constants");
const draw = require("../common/draw");
const { createCanvas } = require("canvas");
const utils = require("../common/utils");

const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

function generateImageFile(outputFile, paths) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw.paths(ctx, paths);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputFile, buffer);
}

fileNames.forEach((fn) => {
  const content = fs.readFileSync(`${constants.RAW_DIR}/${fn}`);
  const { session, student, drawings } = JSON.parse(content);

  for (const label in drawings) {
    samples.push({
      id,
      label,
      student_name: student,
      student_id: session,
    });

    const paths = drawings[label];
    fs.writeFileSync(`${constants.JSON_DIR}/${id}.json`, JSON.stringify(paths));

    generateImageFile(`${constants.IMG_DIR}/${id}.png`, paths);

    utils.printProgress(id, fileNames.length * Object.keys(drawings).length);
    id++;
  }
});

fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));
