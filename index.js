const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')
const { keywords } = require('./keywords')

const libraryDir = path.join(__dirname, 'node_modules', '@wordpress', 'icons', 'src', 'library')
const files = fs.readdirSync(libraryDir)

const data = []

files.filter(file => file.endsWith('.js')).forEach(file => {
  const filePath = path.join(libraryDir, file)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  try {
    const dom = new JSDOM(`<body>${fileContents}</body>`)
    const svgElement = dom.window.document.querySelector('svg')

    if (svgElement) {
      let innerSVGContent = ''

      Array.from(svgElement.children).forEach(child => {
        const serializer = new dom.window.XMLSerializer()
        innerSVGContent += serializer.serializeToString(child)
      })

      const name = path.basename(file, '.js')
      const iconKeywords = keywords[name] || []
      const iconPath = innerSVGContent
        .replace(/fillrule/g, 'fill-rule')
        .replace(/cliprule/g, 'clip-rule')
        .replace(/xmlns=\"(.*?)\" /g, '')

      data.push({ name, path: iconPath, keywords: iconKeywords })
    }
  } catch (error) {
    console.error(`Error processing ${file}: ${error}`)
  }
})

fs.writeFileSync(path.join(__dirname, 'icons.ts'), `export const iconsData = ${JSON.stringify(data, null, 2)};`)
