// GeoTag Pro runs entirely in the browser, so it needs a handful of modern
// web features. This reports any that are missing so we can show a clear
// message instead of failing mysteriously.
export function getUnsupportedFeatures() {
  const missing = [];
  if (typeof FileReader === "undefined") missing.push("reading files");
  if (typeof Blob === "undefined") missing.push("saving files");
  if (typeof URL === "undefined" || !URL.createObjectURL) {
    missing.push("downloads");
  }
  if (typeof TextEncoder === "undefined" || typeof TextDecoder === "undefined") {
    missing.push("text encoding");
  }
  if (typeof atob === "undefined") missing.push("image decoding");
  return missing;
}

export function isBrowserSupported() {
  return getUnsupportedFeatures().length === 0;
}
