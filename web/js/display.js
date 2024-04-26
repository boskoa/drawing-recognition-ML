function createRow(container, studentName, samples) {
  const row = document.createElement("div");
  row.classList.add("row");
  container.appendChild(row);

  const rowLabel = document.createElement("div");
  rowLabel.innerText = studentName;
  rowLabel.classList.add("rowLabel");
  row.appendChild(rowLabel);

  for (const sample of samples) {
    const { id, label, student_id, correct } = sample;

    const sampleContainer = document.createElement("div");
    sampleContainer.id = `sample_${id}`;
    sampleContainer.addEventListener("click", (e) =>
      handleClick(e, sample, false)
    );
    sampleContainer.classList.add("sampleContainer");

    if (correct) {
      sampleContainer.style.backgroundColor = "lightgreen";
    }

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

function handleClick(e, sample, doScroll = true) {
  if (e.ctrlKey) {
    toggleFlaggedSample(sample);
  } else {
    if (sample === null) {
      [...document.querySelectorAll(".emphasize")].forEach((e) =>
        e.classList.remove("emphasize")
      );
      return;
    }
    const el = document.getElementById(`sample_${sample.id}`);
    if (el.classList.contains("emphasize")) {
      el.classList.remove("emphasize");
      chart.selectSample(null);
      return;
    }
    [...document.querySelectorAll(".emphasize")].forEach((e) =>
      e.classList.remove("emphasize")
    );
    el.classList.add("emphasize");
    if (doScroll) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    chart.selectSample(sample);
  }
}

function toggleInput() {
  if (sketchPadViewer.style.display === "none") {
    sketchPadViewer.style.display = "flex";
    sketchPad.triggerUpdate();
  } else {
    sketchPadViewer.style.display = "none";
    chart.hideDynamicPoint();
  }
}

function toggleOutput() {
  if (confusionContainer.style.display === "none") {
    confusionContainer.style.display = "flex";
  } else {
    confusionContainer.style.display = "none";
  }
}
