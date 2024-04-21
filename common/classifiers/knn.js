if (typeof utils === "undefined") {
  utils = require("../utils");
}

class KNN {
  constructor(samples, k) {
    this.samples = samples;
    this.k = k;
  }

  predict(point) {
    const samplePoints = this.samples.map((s) => s.point);
    const indices = utils.getNearest(point, samplePoints, this.k);
    const nearestSamples = indices.map((i) => this.samples[i]);
    const labels = nearestSamples.map((s) => s.label);
    const counts = {};
    labels.forEach((l) => (counts[l] ? counts[l]++ : (counts[l] = 1)));
    const maxCount = Math.max(...Object.values(counts));
    const label = labels.filter((l) => counts[l] === maxCount)[0];

    return {
      label,
      nearestSamples,
    };
  }
}

if (typeof module !== "undefined") {
  module.exports = KNN;
}
