const { samples, featureNames } = features;
const groups = utils.groupBy(samples, "student_id");

for (const [student_id, samples] of Object.entries(groups)) {
  const studentName = samples[0].student_name;
  createRow(container, studentName, samples);
}
