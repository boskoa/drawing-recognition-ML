if (typeof geometry === "undefined") {
  geometry = require("./geometry");
}

if (typeof draw === "undefined") {
  draw = require("./draw");
}

if (typeof utils === "undefined") {
  utils = require("./utils");
}

const featureFunctions = {};

featureFunctions.getPathCount = function (paths) {
  return paths.length;
};

featureFunctions.getPointCount = function (paths) {
  return paths.flat().length;
};

featureFunctions.getWidth = function (paths) {
  if (!paths.length) {
    return 0;
  }
  const x = paths.flat().map((p) => p[0]);
  return Math.max(...x) - Math.min(...x);
};

featureFunctions.getHeight = function (paths) {
  if (!paths.length) {
    return 0;
  }
  const y = paths.flat().map((p) => p[1]);
  return Math.max(...y) - Math.min(...y);
};

featureFunctions.getElongation = function (paths) {
  const { width, height } = geometry.minimumBoundingBox({
    points: paths.flat(),
  });

  return (Math.max(width, height) + 1) / (Math.min(width, height) + 1);
  //return (Math.min(width, height) + 1) / (Math.max(width, height) + 1);
};

featureFunctions.getRoundness = function (paths) {
  const { hull } = geometry.minimumBoundingBox({ points: paths.flat() });

  return geometry.roundness(hull);
};

featureFunctions.getPixels = function (paths, size = 400, expand = true) {
  let canvas = null;

  try {
    canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
  } catch {
    const { createCanvas } = require("../node/node_modules/canvas");
    canvas = createCanvas(size, size);
  }

  const ctx = canvas.getContext("2d");

  if (expand) {
    const points = paths.flat();

    const bounds = {
      left: Math.min(...points.map((p) => p[0])),
      right: Math.max(...points.map((p) => p[0])),
      top: Math.min(...points.map((p) => p[1])),
      bottom: Math.max(...points.map((p) => p[1])),
    };

    const newPaths = [];
    for (const path of paths) {
      const newPoints = path.map((p) => [
        utils.invLerp(bounds.left, bounds.right, p[0]) * size,
        utils.invLerp(bounds.top, bounds.bottom, p[1]) * size,
      ]);

      newPaths.push(newPoints);
    }

    draw.paths(ctx, newPaths);
  } else {
    draw.paths(ctx, paths);
  }

  const imgData = ctx.getImageData(0, 0, size, size);

  return imgData.data.filter((pd, i) => i % 4 === 3);
};

featureFunctions.getComplexity = function (paths) {
  const pixels = featureFunctions.getPixels(paths);
  const complexity = pixels.filter((c) => c !== 0).length;
  return complexity;
};

featureFunctions.inUse = [
  {
    name: "Pixel Array",
    function: (paths) => featureFunctions.getPixels(paths, 20),
  },
  //{ name: "Path Count", function: featureFunctions.getPathCount },
  //{ name: "Point Count", function: featureFunctions.getPointCount },
  /* { name: "Width", function: featureFunctions.getWidth },
  { name: "Height", function: featureFunctions.getHeight },
  { name: "Elongation", function: featureFunctions.getElongation },
  { name: "Roundness", function: featureFunctions.getRoundness },
  { name: "Complexity", function: featureFunctions.getComplexity }, */
];

if (typeof module !== "undefined") {
  module.exports = featureFunctions;
}
