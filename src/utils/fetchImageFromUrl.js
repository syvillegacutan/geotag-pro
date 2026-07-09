import { JPEG_MIME_TYPES, JPEG_EXTENSIONS } from "../constants/config";

// User-facing error messages. Thrown as Error instances so callers can show
// err.message directly. Kept here so the wording stays in one place.
export const URL_IMPORT_ERRORS = {
  invalidUrl: "Please enter a valid image URL",
  notJpeg: "Only JPEG images are supported",
  cors:
    "This image can't be loaded due to the website's security settings. " +
    "Try downloading it first, then upload the file directly.",
  notFound: "Could not load image from this URL",
};

// Derives a sensible filename from a URL's path (e.g. photo.jpg). Falls back to
// "image.jpg" when the path has no usable last segment, and ensures the name
// ends in a .jpg/.jpeg extension so downstream naming/display stays consistent.
function filenameFromUrl(parsedUrl) {
  let name = "";
  try {
    const segments = parsedUrl.pathname.split("/");
    name = decodeURIComponent(segments[segments.length - 1] || "");
  } catch {
    name = "";
  }
  name = name.trim();
  if (!name) name = "image.jpg";

  const lower = name.toLowerCase();
  const hasJpegExt = JPEG_EXTENSIONS.some((ext) => lower.endsWith(ext));
  if (!hasJpegExt) name = `${name}.jpg`;
  return name;
}

// Returns true when the fetched image is a JPEG. Prefers the blob's reported
// MIME type; if the server sent no type, falls back to the URL's extension.
function isJpegBlob(blob, parsedUrl) {
  const type = (blob.type || "").toLowerCase();
  if (JPEG_MIME_TYPES.includes(type)) return true;
  if (!type) {
    const lower = parsedUrl.pathname.toLowerCase();
    return JPEG_EXTENSIONS.some((ext) => lower.endsWith(ext));
  }
  return false;
}

// Fetches an image from a web URL entirely client-side and returns a File that
// can be fed straight into the existing upload pipeline (usePhotos.addFiles).
//
// Throws an Error whose message is one of URL_IMPORT_ERRORS on failure:
//   - invalid URL format        -> invalidUrl
//   - CORS / network failure     -> cors
//   - non-200 response (404 etc) -> notFound
//   - fetched file isn't a JPEG  -> notJpeg
export async function fetchImageFromUrl(rawUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new Error(URL_IMPORT_ERRORS.invalidUrl);
  }
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error(URL_IMPORT_ERRORS.invalidUrl);
  }

  let response;
  try {
    // mode: "cors" — the browser performs the request; the image never touches
    // a server of ours. If the host doesn't allow cross-origin reads this
    // rejects (typically a TypeError), which we surface as a CORS error.
    response = await fetch(parsedUrl.href, { mode: "cors" });
  } catch {
    throw new Error(URL_IMPORT_ERRORS.cors);
  }

  if (!response.ok) {
    throw new Error(URL_IMPORT_ERRORS.notFound);
  }

  const blob = await response.blob();
  if (!isJpegBlob(blob, parsedUrl)) {
    throw new Error(URL_IMPORT_ERRORS.notJpeg);
  }

  const filename = filenameFromUrl(parsedUrl);
  return new File([blob], filename, { type: "image/jpeg" });
}
