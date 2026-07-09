import {
  ACCEPTED_MIME_TYPES,
  ACCEPTED_EXTENSIONS,
  WEBP_MIME_TYPE,
  WEBP_EXTENSION,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from "../constants/config";
import { formatFileSize } from "./formatFileSize";

// Returns true for any format we accept for upload (JPEG or WebP).
// We check the file's reported type first; if the browser reports no type
// (which happens occasionally), we fall back to checking the file extension.
export function isSupportedImageFile(file) {
  const type = (file.type || "").toLowerCase();
  if (ACCEPTED_MIME_TYPES.includes(type)) return true;
  if (!type) {
    const lowerName = file.name.toLowerCase();
    return ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  }
  return false;
}

// Returns true only for WebP files (which get auto-converted to JPEG on upload).
export function isWebpFile(file) {
  const type = (file.type || "").toLowerCase();
  if (type === WEBP_MIME_TYPE) return true;
  if (!type) return file.name.toLowerCase().endsWith(WEBP_EXTENSION);
  return false;
}

// Validates a single file for upload. Returns { valid, error }.
export function validatePhotoFile(file) {
  if (!isSupportedImageFile(file)) {
    return {
      valid: false,
      error: "Unsupported format — only .jpg / .jpeg / .webp photos are supported.",
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
