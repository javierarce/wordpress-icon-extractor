const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const { keywords } = require("./keywords");

const libraryDir = path.join(
  __dirname,
  "node_modules",
  "@wordpress",
  "icons",
  "src",
  "library",
);

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

        Array.from(svgElement.children).forEach((child) => {
          const serializer = new dom.window.XMLSerializer();
          innerSVGContent += serializer.serializeToString(child);
        });

        const name = path.basename(file, ".js");
        const iconKeywords = keywords[name] || [];
        const iconPath = innerSVGContent
          .replace(/fillrule/g, "fill-rule")
          .replace(/cliprule/g, "clip-rule")
          .replace(/xmlns=\"(.*?)\" /g, "");

        data.push({ name, path: iconPath, keywords: iconKeywords });
      }
    } catch (error) {
      console.error(`Error processing ${file}: ${error}`);
    }
  });

fs.writeFileSync(
  path.join(__dirname, "icons.ts"),
  `export const iconsData = ${JSON.stringify(data, null, 2)};`,
);

data.forEach((icon) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${icon.path}</svg>`;
  fs.writeFileSync(path.join(__dirname, "icons", `${icon.name}.svg`), svg);
});

const iconsPerRow = 16;
const iconSize = 24;
const allIconsSvgContent = data
  .map((icon, index) => {
    const x = (index % iconsPerRow) * iconSize;
    const y = Math.floor(index / iconsPerRow) * iconSize;
    return `<svg id="${icon.name}" x="${x}" y="${y}" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">${icon.path}</svg>`;
  })
  .join("");

const gridWidth = iconsPerRow * iconSize;
const gridHeight = Math.ceil(data.length / iconsPerRow) * iconSize;
const allIconsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${gridWidth}" height="${gridHeight}" viewBox="0 0 ${gridWidth} ${gridHeight}">${allIconsSvgContent}</svg>`;
fs.writeFileSync(path.join(outputDir, "all.svg"), allIconsSvg);

console.log(
  "SVG icons have been successfully created and compiled into a grid.",
);
