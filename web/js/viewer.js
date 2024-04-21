const { samples, featureNames } = features;
const groups = utils.groupBy(samples, "student_id");

const chartContainer = document.getElementById("chartContainer");
const sketchPadContainer = document.getElementById("sketchPadContainer");
const sketchPadViewer = document.getElementById("sketchPadViewer");
const toggleinput = document.getElementById("toggleinput");
const prediction = document.getElementById("prediction");

for (const [student_id, samples] of Object.entries(groups)) {
  const studentName = samples[0].student_name;
  createRow(container, studentName, samples);
}

const options = {
  size: 400,
  axesLabels: featureNames,
  styles: utils.styles,
  transparency: 0.7,
  icon: "image",
};
graphics.generateImages(utils.styles);

const chart = new Chart(chartContainer, samples, options, handleClick);

function classify(point) {
  const samplePoints = samples.map((s) => s.point);
  const indices = utils.getNearest(point, samplePoints, 5);
  const nearestSamples = indices.map((i) => samples[i]);
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

function onDrawingUpdate(paths) {
  const functions = featureFunctions.inUse.map((f) => f.function);
  point = functions.map((f) => f(paths));
  utils.normalizePoints([point], minMax);
  const { label, nearestSamples } = classify(point);
  prediction.innerText = `Is it a ${label}?`;
  chart.showDynamicPoint(point, label, nearestSamples);
}

const sketchPad = new SketchPad(sketchPadContainer, onDrawingUpdate);
sketchPad.canvas.style.cssText += "outline: 100vh solid rgba(0, 0, 0, 0.3);";

toggleinput.addEventListener("click", toggleInput);
//2:44:00
