import {
  JPEG_MIME_TYPES,
  JPEG_EXTENSIONS,
  WEBP_MIME_TYPE,
  WEBP_EXTENSION,
} from "../constants/config";

// User-facing error messages. Thrown as Error instances so callers can show
// err.message directly. Kept here so the wording stays in one place.
export const URL_IMPORT_ERRORS = {
  invalidUrl: "Please enter a valid image URL",
  notSupported: "Only JPEG or WebP images are supported",
  cors:
    "This image can't be loaded due to the website's security settings. " +
    "Try downloading it first, then upload the file directly.",
  notFound: "Could not load image from this URL",
};

// Detects the image format of a fetched blob. Prefers the blob's reported MIME
// type; if the server sent no type, falls back to the URL's extension. Returns
// "jpeg", "webp", or null when it's neither.
function detectFormat(blob, parsedUrl) {
  const type = (blob.type || "").toLowerCase();
  if (JPEG_MIME_TYPES.includes(type)) return "jpeg";
  if (type === WEBP_MIME_TYPE) return "webp";
  // Some hosts serve images with a missing or generic binary content-type; fall
  // back to the URL extension in that case (but not when the server positively
  // reports a different, non-matching type such as image/png).
  const generic =
    !type || type === "application/octet-stream" || type === "binary/octet-stream";
  if (generic) {
    const lower = parsedUrl.pathname.toLowerCase();
    if (JPEG_EXTENSIONS.some((ext) => lower.endsWith(ext))) return "jpeg";
    if (lower.endsWith(WEBP_EXTENSION)) return "webp";
  }
  return null;
}

// Derives a filename from a URL's path (e.g. photo.jpg / photo.webp). Falls back
// to "image" when the path has no usable last segment, then ensures the name
// carries the extension matching the detected format so downstream naming,
// display, and WebP-conversion detection stay consistent.
function filenameFromUrl(parsedUrl, format) {
  let name = "";
  try {
    const segments = parsedUrl.pathname.split("/");
    name = decodeURIComponent(segments[segments.length - 1] || "");
  } catch {
    name = "";
  }
  name = name.trim();

  const defaultExt = format === "webp" ? WEBP_EXTENSION : ".jpg";
  const validExts = format === "webp" ? [WEBP_EXTENSION] : JPEG_EXTENSIONS;

  if (!name) name = `image${defaultExt}`;
  const lower = name.toLowerCase();
  if (!validExts.some((ext) => lower.endsWith(ext))) name = `${name}${defaultExt}`;
  return name;
}

// Fetches an image from a web URL entirely client-side and returns a File that
// can be fed straight into the existing upload pipeline (usePhotos.addFiles).
// JPEG and WebP are accepted; a fetched WebP is returned as a WebP File, which
// addFiles then auto-converts to JPEG (and badges) exactly like a dropped WebP.
//
// Throws an Error whose message is one of URL_IMPORT_ERRORS on failure:
//   - invalid URL format             -> invalidUrl
//   - CORS / network failure          -> cors
//   - non-200 response (404 etc)      -> notFound
//   - fetched file isn't JPEG or WebP -> notSupported
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
  const format = detectFormat(blob, parsedUrl);
  if (!format) {
    throw new Error(URL_IMPORT_ERRORS.notSupported);
  }

  const filename = filenameFromUrl(parsedUrl, format);
  const mime = format === "webp" ? WEBP_MIME_TYPE : "image/jpeg";
  return new File([blob], filename, { type: mime });
}
