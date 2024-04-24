let flaggedSamples = [];

function toggleFlaggedSample(sample) {
  if (flaggedSamples.includes(sample.id)) {
    flaggedSamples = flaggedSamples.filter((fs) => fs !== sample.id);
  } else {
    flaggedSamples.push(sample.id);
  }

  [...document.querySelectorAll(".flagged")].forEach((f) =>
    f.classList.remove("flagged")
  );

  for (const id of flaggedSamples) {
    const el = document.getElementById(`sample_${id}`);
    el.classList.add("flagged");
  }
}
