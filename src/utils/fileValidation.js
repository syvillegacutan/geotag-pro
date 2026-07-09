import {
  ACCEPTED_MIME_TYPES,
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from "../constants/config";
import { formatFileSize } from "./formatFileSize";

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
export function validatePhotoFile(file) {
  if (!isJpegFile(file)) {
    return {
      valid: false,
      error: "Not a JPEG — only .jpg / .jpeg photos are supported.",
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Too large (${formatFileSize(file.size)}) — max ${MAX_FILE_SIZE_MB} MB per photo.`,
    };
  }
  return { valid: true, error: null };
}
