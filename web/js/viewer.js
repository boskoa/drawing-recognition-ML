const { samples, featureNames } = features;
const groups = utils.groupBy(samples, "student_id");

const chartContainer = document.getElementById("chartContainer");

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
