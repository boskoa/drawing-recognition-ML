const { samples, featureNames } = features;
const trainingSamples = training.samples;
const testingSamples = testing.samples;
const chartContainer = document.getElementById("chartContainer");
const sketchPadContainer = document.getElementById("sketchPadContainer");
const sketchPadViewer = document.getElementById("sketchPadViewer");
const toggleinput = document.getElementById("toggleinput");
const prediction = document.getElementById("prediction");
const statistics = document.getElementById("statistics");

const k = 8;
const kNN = new KNN(trainingSamples, k);
let correctCount = 0;
let totalCount = 0;

for (const testSample of testingSamples) {
  testSample.truth = testSample.label;
  testSample.label = "?";
  const { label } = kNN.predict(testSample.point);
  testSample.label = label;

  if (testSample.label === testSample.truth) {
    correctCount++;
    testSample.correct = true;
  } else {
    testSample.correct = false;
  }
  totalCount++;
}

statistics.innerHTML = `<span>Total: ${totalCount} / Correct: ${correctCount} --> Accuracy: ${utils.formatPercentage(
  correctCount / totalCount
)}</span>`;

const trainingGroups = utils.groupBy(trainingSamples, "student_id");
for (const [student_id, samples] of Object.entries(trainingGroups)) {
  const studentName = samples[0].student_name;
  createRow(container, studentName, samples);
}

const subtitle = document.createElement("h2");
subtitle.innerText = "Testing";
container.appendChild(subtitle);

const testingGroups = utils.groupBy(testingSamples, "student_id");
for (const [student_id, samples] of Object.entries(testingGroups)) {
  const studentName = samples[0].student_name;
  createRow(container, studentName, samples);
}

const options = {
  size: 400,
  axesLabels: featureNames,
  styles: utils.styles,
  transparency: 0.7,
  icon: "image",
  bg: new Image(),
};
options.bg.src = constants.DECISION_BOUNDARY;
graphics.generateImages(utils.styles);

const chart = new Chart(chartContainer, trainingSamples, options, handleClick);

const confusion = new Confusion(
  confusionContainer,
  testingSamples,
  utils.classes,
  options
);

function onDrawingUpdate(paths) {
  const functions = featureFunctions.inUse.map((f) => f.function);
  point = functions.map((f) => f(paths));
  utils.normalizePoints([point], minMax);
  const { label, nearestSamples } = kNN.predict(point);
  prediction.innerText = `Is it a ${label}?`;
  chart.showDynamicPoint(point, label, nearestSamples);
}

const sketchPad = new SketchPad(sketchPadContainer, onDrawingUpdate);
//sketchPad.canvas.style.cssText += "outline: 100vh solid rgba(0, 0, 0, 0.3);";

toggleInput();
toggleinput.addEventListener("click", toggleInput);
toggleoutput.addEventListener("click", toggleOutput);
