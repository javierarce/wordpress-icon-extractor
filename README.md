# WordPress Icon Extractor

Programmatically export all the SVG icons from [@wordpress/icons](https://www.npmjs.com/package/@wordpress/icons).
This repository contains **0 icons** extracted from **@wordpress/icons@10.27.0**.

<div style="text-align: center;">
<img src="icons/grid-latest.svg" style="width: 100%; height: auto;" alt="WordPress Icons Grid">
</div>

### How to use

1. Install dependencies with `yarn`.
2. Run `yarn start`.

If there's a new version of the npm package, the script will automatically
update the version in the `package.json` file and then download the new icons
into the `icons` folder. After that task, it will generate a sample grid file and
save it with the following name: `grid-{package-version}.svg`.

### What to do after running the script

Run `yarn compare <version> <version>` to compare the icons between two versions.

https://github.com/user-attachments/assets/eb03431a-6bd7-460a-85c7-550b6a8956ac

### Configuration

By default the script will generate a grid with 16 icons per row and 16px size per icon. You can change these values in the script.

```JavaScript
const ICONS_PER_ROW = 16;
const ICON_SIZE = 24;
```

### Last updated

This repository gets updated automatically with the latest version of @wordpress/icons.  
The last update was on: 2025-08-02