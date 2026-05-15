/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

function discoverFeatureFiles(baseDir = process.cwd()) {
  const featuresDir = path.join(baseDir, "cypress/e2e/features");
  if (!fs.existsSync(featuresDir)) {
    console.error(`Features directory not found: ${featuresDir}`);
    process.exit(1);
  }
  return findFeatureFiles(featuresDir);
}

function findFeatureFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFeatureFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".feature")) {
      results.push(fullPath);
    }
  }
  return results;
}

function splitFeatures(files, groups) {
  const split = Array.from({ length: groups }, () => []);
  files.forEach((file, index) => {
    split[index % groups].push(file);
  });
  return split;
}

function printGroup(files, index) {
  console.log(`Group ${index}: ${files.length} feature(s)`);
  files.forEach((f) => console.log(`  ${f}`));
}

if (require.main === module) {
  const groups = parseInt(process.argv[2], 10) || 3;
  const groupIndex = parseInt(process.argv[3], 10);

  const files = discoverFeatureFiles();
  const split = splitFeatures(files, groups);

  if (groupIndex !== undefined && !isNaN(groupIndex)) {
    const specs = split[groupIndex] || [];
    if (specs.length === 0) {
      console.log("");
    } else {
      console.log(specs.join(","));
    }
  } else {
    console.log(`Total feature files: ${files.length}`);
    console.log(`Split into ${groups} groups\n`);
    split.forEach((g, i) => printGroup(g, i));
  }
}

module.exports = { discoverFeatureFiles, splitFeatures };
