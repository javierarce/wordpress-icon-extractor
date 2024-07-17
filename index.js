const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

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

function getVersion() {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf8"),
  );
  return packageJson.dependencies["@wordpress/icons"].replace(/[\^~]/, "");
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

function generateIconFiles(data) {
  data.forEach((icon) => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.minWidth} ${icon.minHeight} ${icon.width} ${icon.height}">${icon.path}</svg>`;
    fs.writeFileSync(path.join(OUTPUT_DIR, `${icon.name}.svg`), svgContent);
  });

  console.log(
    `- ${data.length} icons have been successfully created and saved to the icons directory.`,
  );
}

function generateGrid(data, version) {
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

  fs.writeFileSync(`grid-${version}.svg`, allIconsSvg);
  fs.writeFileSync(`grid-latest.svg`, allIconsSvg);
  console.log("- Icons successfully compiled into a grid.");
}

function start() {
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

  console.log(
    `Extracting ${data.length} icons from @wordpress/icons@${version}...`,
  );
  generateIconFiles(data);
  generateGrid(data, version);
  updateReadme(version, data.length);

  return data;
}
function updateReadme(version, iconCount) {
  const readmeBasePath = path.join(__dirname, "README.base.md");
  const readmePath = path.join(__dirname, "README.md");

  const readmeContent = `# WordPress Icon Extractor

Programmatically export all the SVG icons from [@wordpress/icons](https://www.npmjs.com/package/@wordpress/icons).
This repository contains **${iconCount} icons** extracted from **@wordpress/icons@${version}**.

<div style="text-align: center;">
  <img src="grid-latest.svg" style="width: 100%; height: auto;" alt="WordPress Icons Grid">
</div>
`;

  const readmeBaseContent = fs.readFileSync(readmeBasePath, "utf8");
  const content =
    readmeContent +
    "\n" +
    readmeBaseContent +
    "\n" +
    `### Last updated\n\n${new Date().toISOString().split("T")[0]}`;

  fs.writeFileSync(readmePath, content);
  console.log(
    "- README.md has been updated with the current version and icon count.",
  );
}

start();
