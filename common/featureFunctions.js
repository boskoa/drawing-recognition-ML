const featureFunctions = {};

featureFunctions.getPathCount = function (paths) {
  return paths.length;
};

featureFunctions.getPointCount = function (paths) {
  return paths.flat().length;
};

if (typeof module !== "undefined") {
  module.exports = featureFunctions;
}
