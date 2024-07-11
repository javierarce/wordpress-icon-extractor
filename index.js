const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const libraryDir = path.join(
  __dirname,
  "node_modules",
  "@wordpress",
  "icons",
  "src",
  "library",
);

const ICONS_PER_ROW = 16;
const ICON_SIZE = 24;

const files = fs.readdirSync(libraryDir);
const data = [];
const outputDir = path.join(__dirname, "icons");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

files
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const filePath = path.join(libraryDir, file);
    let fileContents = fs.readFileSync(filePath, "utf8");
    try {
      fileContents = fileContents.replace(/{ {/g, '"').replace(/} }/g, '"');
      const dom = new JSDOM(`<body>${fileContents}</body>`);
      const svgElement = dom.window.document.querySelector("svg");

      if (svgElement) {
        let innerSVGContent = "";
        const viewBox = svgElement.getAttribute("viewBox");
        let minWidth = 0;
        let minHeight = 0;
        let width = ICON_SIZE;
        let height = ICON_SIZE;

        if (viewBox) {
          [minWidth, minHeight, width, height] = viewBox.split(" ").map(Number);
        }

        Array.from(svgElement.children).forEach((child) => {
          const serializer = new dom.window.XMLSerializer();
          innerSVGContent += serializer.serializeToString(child);
        });

        const name = path.basename(file, ".js");
        const iconPath = innerSVGContent
          .replace(/fillrule/g, "fill-rule")
          .replace(/cliprule/g, "clip-rule")
          .replace(/xmlns=\"(.*?)\" /g, "");

        data.push({ name, path: iconPath, minWidth, minHeight, width, height });
      }
    } catch (error) {
      console.error(`Error processing ${file}: ${error}`);
    }
  });

data.forEach((icon) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.minWidth} ${icon.minHeight} ${icon.width} ${icon.height}">${icon.path}</svg>`;
  fs.writeFileSync(path.join(__dirname, "icons", `${icon.name}.svg`), svg);
});

console.log(
  "- SVG icons have been successfully created and saved to the icons directory.",
);

const allIconsSvgContent = data
  .map((icon, index) => {
    const x = (index % ICONS_PER_ROW) * ICON_SIZE;
    const y = Math.floor(index / ICONS_PER_ROW) * ICON_SIZE;
    return `<svg id="${icon.name}" x="${x}" y="${y}" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="${icon.minWidth} ${icon.minHeight} ${icon.width} ${icon.height}">${icon.path}</svg>`;
  })
  .join("");

// Calculate the grid width and height
const totalIcons = data.length;
const rows = Math.ceil(totalIcons / ICONS_PER_ROW);
const gridWidth = ICONS_PER_ROW * ICON_SIZE;
const gridHeight = rows * ICON_SIZE;

const allIconsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${gridWidth}" height="${gridHeight}" viewBox="0 0 ${gridWidth} ${gridHeight}">${allIconsSvgContent}</svg>`;
fs.writeFileSync(path.join(outputDir, "all.svg"), allIconsSvg);

console.log(
  "- SVG icons have been successfully created and compiled into a grid.",
);
