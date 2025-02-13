# WordPress Icon Extractor

Programmatically export all the SVG icons from [@wordpress/icons](https://www.npmjs.com/package/@wordpress/icons).
This repository contains **305 icons** extracted from **@wordpress/icons@10.18.0**.

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
The last update was on: 2025-02-13
### Changelog

#### Changes from version 10.17.0 to 10.18.0

```

Differences between 10.17.0 (305) and 10.18.0 (305): 

Identical files: 305

Different files: 0

Added files: 0

Removed files: 0
```


### Changelog

#### Changes from version 10.16.0 to 10.17.0

```

Differences between 10.16.0 (305) and 10.17.0 (305): 

Identical files: 305

Different files: 0

Added files: 0

Removed files: 0
```


### Changelog

#### Changes from version 10.15.1 to 10.16.0

```

Differences between 10.15.1 (305) and 10.16.0 (305): 

Identical files: 305

Different files: 0

Added files: 0

Removed files: 0
```


### Changelog

#### Changes from version 10.14.0 to 10.15.1

```

Differences between 10.14.0 (303) and 10.15.1 (305): 

Identical files: 301

Different files: 1
- info.svg

Added files: 3
- caution-filled.svg
- caution.svg
- error.svg

Removed files: 1
- warning.svg
```


### Changelog

#### Changes from version 10.13.0 to 10.14.0

```

Differences between 10.13.0 (303) and 10.14.0 (303): 

Identical files: 303

Different files: 0

Added files: 0

Removed files: 0
```


### Changelog

#### Changes from version 10.12.0 to 10.13.0

```

Differences between 10.12.0 (303) and 10.13.0 (303): 

Identical files: 303

Different files: 0

Added files: 0

Removed files: 0
```


### Changelog

#### Changes from version 10.11.0 to 10.12.0

```

Differences between 10.11.0 (303) and 10.12.0 (303): 

Identical files: 303

Different files: 0

Added files: 0

Removed files: 0
```


### Changelog

#### Changes from version 10.10.0 to 10.11.0

```

Differences between 10.10.0 (298) and 10.11.0 (303): 

Identical files: 298

Different files: 0

Added files: 5
- justify-bottom.svg
- justify-center-vertical.svg
- justify-space-between-vertical.svg
- justify-stretch-vertical.svg
- justify-top.svg

Removed files: 0
```


### Changelog

#### Changes from version 10.9.0 to 10.10.0

```

Differences between 10.9.0 (297) and 10.10.0 (298): 

Identical files: 295

Different files: 2
- cloud-upload.svg
- unseen.svg

Added files: 1
- cloud-download.svg

Removed files: 0
```


### Changelog

#### Changes from version 10.8.0 to 10.9.0

```

Differences between 10.8.0 (294) and 10.9.0 (297): 

Identical files: 294

Different files: 0

Added files: 3
- arrow-down-right.svg
- arrow-up-left.svg
- envelope.svg

Removed files: 0
```


#### Changes from version 10.7.0 to 10.8.0

```

Differences between 10.7.0 (290) and 10.8.0 (294):

Identical files: 290

Different files: 0

Added files: 4
- background.svg
- bell-unread.svg
- bell.svg
- square.svg

Removed files: 0
```
