const featureFunctions = {};

featureFunctions.getPathCount = function (paths) {
  return paths.length;
};

featureFunctions.getPointCount = function (paths) {
  return paths.flat().length;
};

featureFunctions.getWidth = function (paths) {
  const x = paths.flat().map((p) => p[0]);
  return Math.max(...x) - Math.min(...x);
};

featureFunctions.getHeight = function (paths) {
  const y = paths.flat().map((p) => p[1]);
  return Math.max(...y) - Math.min(...y);
};

featureFunctions.inUse = [
  { name: "Path Count", function: featureFunctions.getPathCount },
  { name: "Point Count", function: featureFunctions.getPointCount },
  //{ name: "Width", function: featureFunctions.getWidth },
  //{ name: "Height", function: featureFunctions.getHeight },
];

if (typeof module !== "undefined") {
  module.exports = featureFunctions;
}
