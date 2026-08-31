# English Journey Listening Practice

Upload this folder's contents to the root of your GitHub repository and enable GitHub Pages if you want to publish it.

## Required brand assets

- `logo-intecap.png` — INTECAP logo shown at the top-left of the page.
- `logo-ingles-para-todos.png` — English Journey logo shown inside the banner.
- `favicon.svg` — site favicon.

These are referenced by filename in `index.html`; place them in the repository root alongside `index.html`.

## Data format

`listening.json` uses arrays for `level`, `subLevel`, and `unit` (e.g. `"level": ["A1"]`), matching the format used in the Master Catalog project. This keeps both catalogs consistent and supports lessons that could apply to more than one level, sub-level, or unit in the future.

## Adding media

- Put audio files in `assets/audio/` and set `audioFile` in `listening.json` to the filename only. The app resolves it as `assets/audio/<audioFile>`.
- Put lesson images in `assets/images/` and set `pictureName` to the filename only. The app resolves it as `assets/images/<pictureName>`.
- Fully qualified external sources can remain in `audioUrl`. Direct audio-file URLs play in the native player; lesson-page URLs are also offered as external links.

The `.gitkeep` files keep the empty media folders present in Git until you add your own files.# English Journey Listening Practice

Upload this folder's contents to the root of your GitHub repository and enable GitHub Pages if you want to publish it.

## Required brand assets

- `logo-intecap.png` — INTECAP logo shown at the top-left of the page.
- `logo-ingles-para-todos.png` — English Journey logo shown inside the banner.
- `favicon.svg` — site favicon.

These are referenced by filename in `index.html`; place them in the repository root alongside `index.html`.

## Data format

`listening.json` uses arrays for `level`, `subLevel`, and `unit` (e.g. `"level": ["A1"]`), matching the format used in the Master Catalog project. This keeps both catalogs consistent and supports lessons that could apply to more than one level, sub-level, or unit in the future.

## Adding media

- Put audio files in `assets/audio/` and set `audioFile` in `listening.json` to the filename only. The app resolves it as `assets/audio/<audioFile>`.
- Put lesson images in `assets/images/` and set `pictureName` to the filename only. The app resolves it as `assets/images/<pictureName>`.
- Fully qualified external sources can remain in `audioUrl`. Direct audio-file URLs play in the native player; lesson-page URLs are also offered as external links.

The `.gitkeep` files keep the empty media folders present in Git until you add your own files.
