import { WEBP_JPEG_QUALITY, WEBP_EXTENSION } from "../constants/config";

// Swaps a .webp filename to .jpg (case-insensitive). Falls back to appending
// .jpg when there's no .webp extension to replace.
export function webpNameToJpg(name) {
  const safe = (name || "image.webp").trim() || "image.webp";
  if (safe.toLowerCase().endsWith(WEBP_EXTENSION)) {
    return `${safe.slice(0, safe.length - WEBP_EXTENSION.length)}.jpg`;
  }
  const dot = safe.lastIndexOf(".");
  const base = dot === -1 ? safe : safe.slice(0, dot);
  return `${base}.jpg`;
}

// Converts a WebP File into a JPEG File entirely in the browser using the
// Canvas API: the WebP is decoded into an <img>, drawn onto a canvas, and
// re-encoded as JPEG at near-lossless quality. EXIF/IPTC can then be embedded
// into the result exactly like any other JPEG.
//
// The output File is renamed to a .jpg extension so downloads land as .jpg.
// Returns a Promise<File>; rejects if the image can't be decoded or encoded.
export function convertWebpToJpeg(file, quality = WEBP_JPEG_QUALITY) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");

        // JPEG has no alpha channel — paint white first so any transparency in
        // the WebP flattens to white instead of black.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("WebP conversion failed"));
              return;
            }
            const name = webpNameToJpg(file.name);
            resolve(new File([blob], name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode WebP image"));
    };

    img.src = url;
  });
}
