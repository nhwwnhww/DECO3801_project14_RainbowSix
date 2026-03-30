const { analyzePage } = require("./src/analyzer");
const { calculateScores } = require("./src/scorer");

const fs = require("fs").promises;
const path = require("path");

const url = process.argv[2];

if (!url) {
  console.log("❌ Please provide a URL");
  process.exit(1);
}

analyzePage(url).then(async (result) => {
  
  result.scores = calculateScores(result.analysis);

  const output = JSON.stringify(result, null, 2);
  console.log(output);

  // create outputs folder
  const outputDir = path.join(__dirname, "outputs");
  await fs.mkdir(outputDir, { recursive: true });

  // filename = URL + timestamp
  const safeUrl = url.replace(/https?:\/\//, "").replace(/[\/:?&=]/g, "_");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const filename = `${safeUrl}-${timestamp}.json`;
  const filePath = path.join(outputDir, filename);

  await fs.writeFile(filePath, output, "utf8");
  console.log(`✅ Result has been saved to the file: ${filePath}`);
}).catch(err => {
  console.error("❌ Analysis failed:", err.message);
  process.exit(1);
});