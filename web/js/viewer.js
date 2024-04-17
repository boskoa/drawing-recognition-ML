const { samples, featureNames } = features;
const groups = utils.groupBy(samples, "student_id");

const chartContainer = document.getElementById("chartContainer");
const sketchPadContainer = document.getElementById("sketchPadContainer");
const sketchPadViewer = document.getElementById("sketchPadViewer");
const toggleinput = document.getElementById("toggleinput");

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

function onDrawingUpdate(paths) {
  const point = [
    featureFunctions.getPathCount(paths),
    featureFunctions.getPointCount(paths),
  ];
  console.log(point);
}

const sketchPad = new SketchPad(sketchPadContainer, onDrawingUpdate);
sketchPad.canvas.style.cssText += "outline: 100vh solid rgba(0, 0, 0, 0.3);";

toggleinput.addEventListener("click", toggleInput);
//2:11:00
