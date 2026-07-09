import { ACCEPTED_MIME_TYPES, ACCEPTED_EXTENSIONS } from "../constants/config";

// Returns true only for JPEG photos.
// We check the file's reported type first; if the browser reports no type
// (which happens occasionally), we fall back to checking the file extension.
export function isJpegFile(file) {
  const type = (file.type || "").toLowerCase();
  if (ACCEPTED_MIME_TYPES.includes(type)) return true;
  if (!type) {
    const lowerName = file.name.toLowerCase();
    return ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  }
  return false;
}

// Validates a single file for upload. Returns { valid, error }.
// (File-size limits are added later, in Phase 9.)
export function validatePhotoFile(file) {
  if (!isJpegFile(file)) {
    return {
      valid: false,
      error: "Not a JPEG — only .jpg / .jpeg photos are supported.",
    };
  }
  return { valid: true, error: null };
}
