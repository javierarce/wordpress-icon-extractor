### WordPress Icon Extractor

Programmatically export all the SVG icons from [@wordpress/icons](https://www.npmjs.com/package/@wordpress/icons).

![Sample grid](grid.png)

### How to use

1. Install dependencies with `yarn`.
2. Run `yarn start`.

The script will download all the icons into the `icons` folder and generate a sample grid in `icons/all.svg`.

### Configuration

By default the script will generate a grid with 16 icons per row and 16px size per icon. You can change these values in the script.

```JavaScript
const ICONS_PER_ROW = 16;
const ICON_SIZE = 24;
```
