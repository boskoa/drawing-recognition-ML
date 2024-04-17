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

if (typeof module !== "undefined") {
  module.exports = utils;
}
