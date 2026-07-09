# GeoTag Pro

Free, browser-based photo geotagging & SEO optimization for Google Business Profile.
Built by [SySEO Lab](https://syseolab.com).

Upload JPEG photos, pick a business location on a map, enter your business name +
keywords, and download optimized copies with **GPS coordinates** and **keyword
metadata** embedded — all **100% in your browser**. No server, no backend, no
database. Your photos never leave your device.

## How it works

- **GPS** is written into standard EXIF metadata via `piexifjs`.
- **Keywords / title / description / author** are written into an **XMP** packet
  (the format Lightroom, most photo apps, and Google read).
- Both are inserted into the JPEG **losslessly** — the image pixels are never
  re-compressed, so photo quality is untouched.

## Tech stack

React + Vite · Leaflet + OpenStreetMap (no API key) · piexifjs · JSZip ·
Tailwind CSS. Plain JavaScript.

## Run locally

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
npm run lint     # run the linter
```

## Deploy

Any static host works. This repo deploys cleanly on Vercel's free tier
(framework preset: **Vite**, build command `npm run build`, output `dist`).

## Privacy

All photo processing happens locally in the browser. The only network requests
are OpenStreetMap map tiles (map background imagery) — your photos are never
uploaded anywhere.
