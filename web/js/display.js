function createRow(container, studentName, samples) {
  const row = document.createElement("div");
  row.classList.add("row");
  container.appendChild(row);

  const rowLabel = document.createElement("div");
  rowLabel.innerText = studentName;
  rowLabel.classList.add("rowLabel");
  row.appendChild(rowLabel);

  for (const sample of samples) {
    const { id, label, student_id } = sample;

    const sampleContainer = document.createElement("div");
    sampleContainer.id = `sample_${id}`;
    sampleContainer.classList.add("sampleContainer");

    const sampleLabel = document.createElement("div");
    sampleLabel.innerText = label;
    sampleContainer.appendChild(sampleLabel);

    const img = document.createElement("img");
    img.src = `${constants.IMG_DIR}/${id}.png`;
    img.alt = `thumb ${label} ${id}`;
    img.classList.add("thumb");
    if (utils.flaggedUsers.includes(student_id)) {
      img.classList.add("blur");
    }
    sampleContainer.appendChild(img);
    row.appendChild(sampleContainer);
  }
}

if (typeof module !== "undefined") {
  module.exports = createRow;
}
