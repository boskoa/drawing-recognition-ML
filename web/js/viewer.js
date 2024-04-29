const { samples, featureNames } = features;
const trainingSamples = training.samples;
const testingSamples = testing.samples;
const chartContainer = document.getElementById("chartContainer");
const sketchPadContainer = document.getElementById("sketchPadContainer");
const sketchPadViewer = document.getElementById("sketchPadViewer");
const toggleinput = document.getElementById("toggleinput");
const prediction = document.getElementById("prediction");
const statistics = document.getElementById("statistics");
const networkCanvas = document.getElementById("networkCanvas");

//const k = 10;
//const kNN = new KNN(trainingSamples, k);
const mlp = new MLP([], []);
mlp.load(model);

networkCanvas.width = 400;
networkCanvas.height = 400;
networkCtx = networkCanvas.getContext("2d");

let correctCount = 0;
let totalCount = 0;

for (const testSample of testingSamples) {
  testSample.truth = testSample.label;
  testSample.label = "?";
  //const { label } = kNN.predict(testSample.point);
  const { label } = mlp.predict(testSample.point);
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
  //hideSamples: true,
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

const outputLabels = Object.values(utils.styles).map((s) => s.image);
Visualizer.drawNetwork(networkCtx, mlp.network, outputLabels);

function onDrawingUpdate(paths) {
  const functions = featureFunctions.inUse.map((f) => f.function);
  //point = functions.map((f) => f(paths));
  point = functions[0](paths);
  utils.normalizePoints([point], minMax);
  //const { label, nearestSamples } = kNN.predict(point);
  const { label, nearestSamples } = mlp.predict(point);
  Visualizer.drawNetwork(networkCtx, mlp.network, outputLabels);
  prediction.innerText = `Is it a ${label}?`;
  chart.showDynamicPoint(point, label, nearestSamples);
}

const sketchPad = new SketchPad(sketchPadContainer, onDrawingUpdate);
//sketchPad.canvas.style.cssText += "outline: 100vh solid rgba(0, 0, 0, 0.3);";

toggleInput();
toggleinput.addEventListener("click", toggleInput);
toggleoutput.addEventListener("click", toggleOutput);
