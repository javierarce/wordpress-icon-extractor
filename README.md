### WordPress Icon Extractor

Programmatically export all the SVG icons from [@wordpress/icons](https://www.npmjs.com/package/@wordpress/icons).

![Sample grid](grid.png)

### How to use

1. Install dependencies with `yarn`.
2. Run `yarn start`.

If there's a new version of the npm package, the script will automatically update the version in the `package.json` file and download the new icons.
The script will then download all the icons into the `icons` folder and generate a sample grid SVG file at `grid-{package version}.svg`.

### What to do after running the script

If there are changes in the icons, you'll be able to see the SVG differences running git diff.

### Configuration

By default the script will generate a grid with 16 icons per row and 16px size per icon. You can change these values in the script.

```JavaScript
const ICONS_PER_ROW = 16;
const ICON_SIZE = 24;
```
