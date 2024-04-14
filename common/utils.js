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

if (typeof module !== "undefined") {
  module.exports = utils;
}
