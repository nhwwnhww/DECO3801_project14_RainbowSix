function scoreSection(metrics) {
  const keys = Object.keys(metrics);
  const total = keys.length;

  let issues = 0;

  keys.forEach(key => {
    const value = metrics[key];

    if (
      value === false ||
      value === 0 ||
      value === null ||
      value === undefined
    ) {
      issues++;
    }
  });

  const score = Math.max(0, 100 - (issues / total) * 100);
  return Math.round(score);
}

function calculateScores(artifacts) {
  const sections = [];
  let total = 0;

  for (const [name, metrics] of Object.entries(artifacts)) {
    const score = scoreSection(metrics);

    sections.push({
      category: name,
      score,
      status: getStatus(score),
      metrics
    });

    total += score;
  }

  const overall = Math.round(total / sections.length);

  return {
    overallScore: overall,
    overallStatus: getStatus(overall),
    sections
  };
}

function getStatus(score) {
  if (score >= 80) return "good";
  if (score >= 50) return "warning";
  return "poor";
}

module.exports = { calculateScores };
