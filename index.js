import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIBRARY_DIR = path.join(
  __dirname,
  "node_modules",
  "@wordpress",
  "icons",
  "src",
  "library",
);

const ICONS_PER_ROW = 16;
const ICON_SIZE = 24;
const OUTPUT_DIR = path.join(__dirname, "icons");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

let spinner = null;

function getVersion() {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf8"),
  );
  return packageJson.dependencies["@wordpress/icons"].replace(/[\^~]/, "");
}

function compareVersions(v1, v2) {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
}

function parseSvgContent(filePath) {
  const fileContents = fs
    .readFileSync(filePath, "utf8")
    .replace(/{ {/g, '"')
    .replace(/} }/g, '"');
  const dom = new JSDOM(`<body>${fileContents}</body>`);
  const svgElement = dom.window.document.querySelector("svg");

  if (svgElement) {
    const viewBox = svgElement.getAttribute("viewBox");

    const [minWidth, minHeight, width, height] = viewBox
      ? viewBox.split(" ").map(Number)
      : [0, 0, ICON_SIZE, ICON_SIZE];

    const iconPath = Array.from(svgElement.children)
      .map((child) => new dom.window.XMLSerializer().serializeToString(child))
      .join("")
      .replace(/fillrule/g, "fill-rule")
      .replace(/cliprule/g, "clip-rule")
      .replace(/xmlns=\"(.*?)\" /g, "");

    return { minWidth, minHeight, width, height, path: iconPath };
  }

  return null;
}

function generateIconFiles(data, version) {
  try {
    if (!fs.existsSync(path.join(OUTPUT_DIR, version))) {
      fs.mkdirSync(path.join(OUTPUT_DIR, version));
    }

    data.forEach((icon) => {
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.minWidth} ${icon.minHeight} ${icon.width} ${icon.height}">${icon.path}</svg>`;
      fs.writeFileSync(
        path.join(OUTPUT_DIR, version, `${icon.name}.svg`),
        svgContent,
      );
    });

    spinner.succeed(
      `${data.length} icons have been successfully created and saved to the icons directory.`,
    );
  } catch (error) {
    spinner.fail(`Error generating icon files: ${error.message}`);
    throw error;
  }
}

function generateGrid(data, version, updateLatest = false) {
  spinner.text = "Compiling icons into a grid";

  try {
    const allIconsSvgContent = data
      .map((icon, index) => {
        const x = (index % ICONS_PER_ROW) * ICON_SIZE;
        const y = Math.floor(index / ICONS_PER_ROW) * ICON_SIZE;
        return `<svg id="${icon.name}" x="${x}" y="${y}" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="${icon.minWidth} ${icon.minHeight} ${icon.width} ${icon.height}">${icon.path}</svg>`;
      })
      .join("");

    const gridWidth = ICONS_PER_ROW * ICON_SIZE;
    const gridHeight = Math.ceil(data.length / ICONS_PER_ROW) * ICON_SIZE;
    const allIconsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${gridWidth}" height="${gridHeight}" viewBox="0 0 ${gridWidth} ${gridHeight}">${allIconsSvgContent}</svg>`;

    fs.writeFileSync(path.join(OUTPUT_DIR, `grid-${version}.svg`), allIconsSvg);

    if (updateLatest) {
      fs.writeFileSync(path.join(OUTPUT_DIR, `grid-latest.svg`), allIconsSvg);
      spinner.succeed(
        `${data.length} icons have been successfully compiled into a grid and saved as grid-${version}.svg and updated as grid-latest.svg.`,
      );
    } else {
      spinner.succeed(
        `${data.length} icons have been successfully compiled into a grid and saved as grid-${version}.svg.`,
      );
    }
  } catch (error) {
    spinner.fail(`Error compiling icons into a grid: ${error.message}`);
    throw error;
  }
}

function updateReadme(version, iconCount) {
  spinner.text = "Updating README.md";

  try {
    const readmeBasePath = path.join(__dirname, "README.base.md");
    const readmePath = path.join(__dirname, "README.md");

    const readmeContent = `# WordPress Icon Extractor

Programmatically export all the SVG icons from [@wordpress/icons](https://www.npmjs.com/package/@wordpress/icons).
This repository contains **${iconCount} icons** extracted from **@wordpress/icons@${version}**.

<div style="text-align: center;">
<img src="icons/grid-latest.svg" style="width: 100%; height: auto;" alt="WordPress Icons Grid">
</div>
`;

    const readmeBaseContent = fs.readFileSync(readmeBasePath, "utf8");
    const content =
      readmeContent +
      "\n" +
      readmeBaseContent +
      "\n" +
      `### Last updated\n\nThis repository gets updated automatically. The last update was on: ${new Date().toISOString().split("T")[0]}`;

    fs.writeFileSync(readmePath, content);

    spinner.succeed(
      "README.md has been updated with the current version and icon count.",
    );
  } catch (error) {
    spinner.fail(`Error updating README: ${error.message}`);
    throw error;
  }
}

function start() {
  spinner = ora("Generating icon files...").start();

  try {
    const files = fs
      .readdirSync(LIBRARY_DIR)
      .filter((file) => file.endsWith(".js"));

    const data = files
      .map((file) => {
        const filePath = path.join(LIBRARY_DIR, file);
        const svgData = parseSvgContent(filePath);
        if (svgData) {
          return { name: path.basename(file, ".js"), ...svgData };
        }
        return null;
      })
      .filter(Boolean);

    const version = getVersion();
    const latestVersion = fs.readFileSync("latest-version.txt", "utf8");
    let updateLatest = compareVersions(version, latestVersion) >= 0;

    if (updateLatest) {
      fs.writeFileSync("latest-version.txt", version);
    }

    generateIconFiles(data, version);
    generateGrid(data, version, updateLatest);
    updateReadme(version, data.length);
  } catch (error) {
    spinner.fail(`Error extracting icons: ${error.message}`);
    throw error;
  }
}

start();
