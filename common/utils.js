const utils = {};

utils.formatPercentage = function (ratio) {
  return `${(ratio * 100).toFixed(1)} %\n`;
};

utils.printProgress = function (count, max) {
  process.stdout.clearLine();
  process.stdout.moveCursor(0);
  const percentage = utils.formatPercentage(count / max);
  process.stdout.write(`${count}/${max} - ${percentage}`);
};

utils.groupBy = function (arr, key) {
  const groups = {};
  for (const obj of arr) {
    const groupKey = obj[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(obj);
  }

  return groups;
};

utils.flaggedUsers = [1713106169257, 1713106169255, 1713106169256];
utils.flaggedSamples = [];

utils.styles = {
  car: { color: "gray", text: "🚗" },
  fish: { color: "red", text: "🐠" },
  house: { color: "yellow", text: "🏠" },
  tree: { color: "green", text: "🌳" },
  bicycle: { color: "cyan", text: "🚲" },
  guitar: { color: "blue", text: "🎸" },
  pencil: { color: "magenta", text: "✏️" },
  clock: { color: "lightgray", text: "🕒" },
};
utils.styles["?"] = { color: "red", text: "❓" };

utils.distance = (p1, p2) => {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
};

utils.getNearest = (loc, points, k = 1) => {
  const obj = points.map((val, ind) => ({ ind, val }));
  const sorted = obj.sort(
    (a, b) => utils.distance(loc, a.val) - utils.distance(loc, b.val)
  );
  const indices = sorted.map((s) => s.ind);
  return indices.slice(0, k);
};

utils.invLerp = function (a, b, v) {
  return (v - a) / (b - a);
};

utils.normalizePoints = function (points, minMax) {
  let min, max;
  const dimensions = points[0].length;

  if (minMax) {
    min = minMax.min;
    max = minMax.max;
  } else {
    min = [...points[0]];
    max = [...points[0]];

    for (let i = 1; i < points.length; i++) {
      for (let j = 0; j < dimensions; j++) {
        min[j] = Math.min(min[j], points[i][j]);
        max[j] = Math.max(max[j], points[i][j]);
      }
    }
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < dimensions; j++) {
      points[i][j] = utils.invLerp(min[j], max[j], points[i][j]);
    }
  }

  return { min, max };
};

utils.toCSV = function (headers, samples) {
  let str = headers.join(",") + "\n";
  for (const sample of samples) {
    str += sample.join(",") + "\n";
  }

  return str;
};

if (typeof module !== "undefined") {
  module.exports = utils;
}
