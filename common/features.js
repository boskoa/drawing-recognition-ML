const features = {};

features.getPathCount = function (paths) {
  return paths.length;
};

features.getPointCount = function (paths) {
  return paths.flat().length;
};

if (typeof module !== "undefined") {
  module.exports = features;
}
