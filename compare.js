import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
if (args.length < 2 || args.length > 4) {
  console.error(
    "Usage: node compare.js <version1> <version2> [--verbose] [--no-color]",
  );
  process.exit(1);
}

const version1 = args[0];
const version2 = args[1];
const verbose = args.includes("--verbose");
const noColor = args.includes("--no-color");

const colors = {
  reset: noColor ? "" : "\x1b[0m",
  bright: noColor ? "" : "\x1b[1m",
  dim: noColor ? "" : "\x1b[2m",
  underscore: noColor ? "" : "\x1b[4m",
  blink: noColor ? "" : "\x1b[5m",
  reverse: noColor ? "" : "\x1b[7m",
  hidden: noColor ? "" : "\x1b[8m",
  fg: {
    black: noColor ? "" : "\x1b[30m",
    red: noColor ? "" : "\x1b[31m",
    green: noColor ? "" : "\x1b[32m",
    yellow: noColor ? "" : "\x1b[33m",
    blue: noColor ? "" : "\x1b[34m",
    magenta: noColor ? "" : "\x1b[35m",
    cyan: noColor ? "" : "\x1b[36m",
    white: noColor ? "" : "\x1b[37m",
  },
  bg: {
    black: noColor ? "" : "\x1b[40m",
    red: noColor ? "" : "\x1b[41m",
    green: noColor ? "" : "\x1b[42m",
    yellow: noColor ? "" : "\x1b[43m",
    blue: noColor ? "" : "\x1b[44m",
    magenta: noColor ? "" : "\x1b[45m",
    cyan: noColor ? "" : "\x1b[46m",
    white: noColor ? "" : "\x1b[47m",
  },
};

const dir1 = path.resolve(`icons/${version1}/`);
const dir2 = path.resolve(`icons/${version2}/`);

if (!fs.existsSync(dir1)) {
  console.error(`${dir1} does not exist.`);
  process.exit(1);
}
if (!fs.existsSync(dir2)) {
  console.error(`${dir2} does not exist.`);
  process.exit(1);
}

const files1 = fs.readdirSync(dir1).filter((file) => file.endsWith(".svg"));
const files2 = fs.readdirSync(dir2).filter((file) => file.endsWith(".svg"));
const commonFiles = files1.filter((file) => files2.includes(file));
const addedFiles = files2.filter((file) => !files1.includes(file));
const removedFiles = files1.filter((file) => !files2.includes(file));
const differences = [];
const differentFiles = [];
let sameCount = 0;
let diffCount = 0;

commonFiles.forEach((file) => {
  const filePath1 = path.join(dir1, file);
  const filePath2 = path.join(dir2, file);
  if (!fs.existsSync(filePath1)) {
    console.error(`File ${filePath1} does not exist in ${version1} directory.`);
    return;
  } else if (!fs.existsSync(filePath2)) {
    console.error(`File ${filePath2} does not exist in ${version2} directory.`);
    return;
  } else if (!fs.statSync(filePath1).isFile()) {
    console.error(`Path is not a file: ${filePath1}`);
    return;
  } else if (!fs.statSync(filePath2).isFile()) {
    console.error(`Path is not a file: ${filePath2}`);
    return;
  }
  try {
    execSync(
      `diff ${noColor ? "" : "--color=always"} ${filePath1} ${filePath2}`,
      {
        encoding: "utf8",
      },
    );
    sameCount++;
  } catch (error) {
    if (error.status === 1) {
      if (verbose) {
        differences.push({ file, output: error.stdout });
      }
      differentFiles.push(file);
      diffCount++;
    } else {
      console.error(
        `${colors.fg.red}Error comparing ${file}:${colors.reset}`,
        error.message,
      );
    }
  }
});

console.log(
  `\n${colors.bright}${colors.fg.white}Differences between ${version1} (${files1.length}) and ${version2} (${files2.length}): ${colors.reset}`,
);
console.log(`\n${colors.fg.green}Identical files: ${sameCount}${colors.reset}`);
console.log(`\n${colors.fg.red}Different files: ${diffCount}${colors.reset}`);
if (differentFiles.length) {
  differentFiles.forEach((file) =>
    console.log(`- ${colors.fg.red}${file}${colors.reset}`),
  );
}
console.log(
  `\n${colors.fg.blue}Added files: ${addedFiles.length}${colors.reset}`,
);
if (addedFiles.length) {
  addedFiles.forEach((file) =>
    console.log(`- ${colors.fg.blue}${file}${colors.reset}`),
  );
}
console.log(
  `\n${colors.fg.magenta}Removed files: ${removedFiles.length}${colors.reset}`,
);
if (removedFiles.length) {
  removedFiles.forEach((file) =>
    console.log(`- ${colors.fg.magenta}${file}${colors.reset}`),
  );
}
if (verbose && differences.length) {
  console.log(
    `\n\n${colors.fg.white}${colors.bright}Differences:${colors.reset}\n`,
  );
  differences.forEach((diff) => {
    console.log(
      `${colors.fg.red}${colors.bright}${diff.file}${colors.reset}:\n`,
    );
    console.log(diff.output);
  });
}
