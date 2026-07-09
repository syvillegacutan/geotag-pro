# Design: Web URL image import

**Date:** 2026-07-09
**Feature:** Let users paste image URL(s) from the web; the app fetches them
client-side and feeds them into the existing geotagging pipeline.

## Goal

In the "Upload photos" section, add an input so a user can paste a direct image
URL (e.g. `https://example.com/photo.jpg`), click **Add**, and have the app
fetch the image in the browser, turn it into a `File`, and run it through the
same pipeline as drag-and-drop uploads — same thumbnail, same EXIF/keyword
badges, same optimize + download.

All processing stays 100% client-side: the browser fetches the image; no server
is involved.

## Existing pipeline (unchanged)

- `usePhotos().addFiles(fileList)` is the single entry point. It accepts any
  array-like of `File` objects, validates each with `validatePhotoFile`, and
  adds accepted ones (assigning `id`, `previewUrl`, etc.).
- `useExifData` automatically reads EXIF/keyword metadata for any newly added
  photo and drives the badges.

Because both are keyed off `File` objects, a fetched-from-URL `File` gets the
same treatment for free. No pipeline changes are required.

## New pieces

### `src/utils/fetchImageFromUrl.js` (pure async util)

`fetchImageFromUrl(url) -> Promise<File>`

1. Validate URL format with `new URL(url)`. Invalid → throw
   `"Please enter a valid image URL"`.
2. `fetch(url, { mode: "cors" })`.
   - Network / CORS failure (fetch rejects, typically `TypeError`) → throw
     `"This image can't be loaded due to the website's security settings. Try
     downloading it first, then upload the file directly."`
   - `!response.ok` (404 etc.) → throw `"Could not load image from this URL"`.
3. `blob = await response.blob()`. If `blob.type` is not `image/jpeg` (falling
   back to a `.jpg/.jpeg` URL extension check when the server sends no type) →
   throw `"Only JPEG images are supported"`.
4. Derive filename from the URL path (decode, strip query/hash; fallback
   `image.jpg`; ensure a `.jpg` extension).
5. Return `new File([blob], filename, { type: "image/jpeg" })`.

Errors are thrown as `Error` instances with the user-facing message so the
component can display `err.message` directly.

### `src/components/UrlImport.jsx`

Rendered directly below `<UploadZone>` in the "Upload photos" Section.

- Label: "Or paste image URL(s) from the web".
- Text input + green **Add** button (matches `brand-green`); submits on Enter or
  button click. Add is disabled while empty or loading.
- Local `loading` state → shows a spinner and disables the button while fetching.
- Local `error` state → inline red text directly under the input (separate from
  the shared `UploadErrors` alert, so the two error types never clobber each
  other — decision confirmed with user).
- On success: call `onFile(file)`, then clear the input and error so the next
  URL can be pasted.

### `App.jsx` wiring (one line)

`<UrlImport onFile={(file) => addFiles([file])} />` placed under `<UploadZone>`.

## Error-message mapping (per spec)

| Condition | Message |
| --- | --- |
| Not a JPEG | `Only JPEG images are supported` |
| CORS / network failure | `This image can't be loaded due to the website's security settings. Try downloading it first, then upload the file directly.` |
| 404 / bad response | `Could not load image from this URL` |
| Malformed URL | `Please enter a valid image URL` |

## Non-goals / YAGNI

- No batch/multi-URL textarea — user pastes one URL at a time (per spec).
- No server proxy to bypass CORS — that would break the client-side guarantee.
- No new test framework — the project has none; verification is end-to-end in
  the running app (paste a JPEG URL → thumbnail → geotag → download → confirm
  embedded EXIF/IPTC).

## Verification

Paste a direct JPEG URL, confirm it loads as a thumbnail with EXIF badges,
geotag it, download it, and confirm GPS/keyword metadata is embedded. Confirm
drag-and-drop upload still works unchanged.
