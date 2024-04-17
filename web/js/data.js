const inputContainer = document.getElementById("user-data");
const studentButton = document.getElementById("student-button");
const student = document.getElementById("student");
const sketchContainer = document.getElementById("sketchContainer");
const instructions = document.getElementById("instructions");
const instructionsContainer = document.getElementById("instructions-container");
const nextButton = document.getElementById("next");

let index = 0;
const labels = [
  "car",
  "fish",
  "house",
  "tree",
  "bicycle",
  "guitar",
  "pencil",
  "clock",
];

const data = {
  student: null,
  session: new Date().getTime(),
  drawings: {},
};

function start() {
  if (student.value === "") {
    alert("Please, type your name");
    return;
  }

  data.student = student.value;
  inputContainer.style.visibility = "hidden";
  sketchContainer.style.visibility = "visible";
  instructionsContainer.style.visibility = "visible";

  const label = labels[index];
  instructions.innerText = `Please, draw a ${label}.`;
}

function next() {
  if (!sketchPad.paths.length) {
    alert("Draw this one, first.");
    return;
  }

  const label = labels[index];
  data.drawings[label] = sketchPad.paths;
  sketchPad.reset();
  index++;

  if (index < labels.length) {
    const nextLabel = labels[index];
    instructions.innerText = `Please, draw a ${nextLabel}.`;
  } else {
    sketchContainer.style.visibility = "hidden";
    instructions.innerText = "Thank you!";
    nextButton.innerText = "Save";
    nextButton.removeEventListener("click", next);
    nextButton.onclick = save;
    return;
  }
}

function save() {
  nextButton.style.display = "none";
  instructions.innerText =
    "Save your download alongside others in the dataset.";
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
  );

  const fileName = data.session + ".json";
  element.setAttribute("download", fileName);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

studentButton.addEventListener("click", start);
nextButton.addEventListener("click", next);

const sketchPad = new SketchPad(document.getElementById("sketchPadContainer"));
