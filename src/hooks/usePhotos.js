import { useCallback, useState } from "react";
import { validatePhotoFile, isWebpFile } from "../utils/fileValidation";
import { convertWebpToJpeg } from "../utils/convertWebpToJpeg";

// Central store for uploaded photos. Each photo is:
//   { id, file, name, size, previewUrl, convertedFromWebp }
// Later phases add metadata fields (GPS, keywords, optimized bytes) to these.
export function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState([]); // [{ name, message }]

  // Accepts a FileList (from drag-drop or the file picker), validates each
  // file, and adds the valid ones. WebP files are silently converted to JPEG
  // first (metadata can't be embedded into WebP) and flagged so the UI can
  // show a "Converted from WebP" badge. Rejections are recorded as errors.
  // Async because WebP conversion happens off the main pipeline via Canvas.
  const addFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList || []);
    const accepted = [];
    const rejected = [];

    for (const file of files) {
      const { valid, error } = validatePhotoFile(file);
      if (!valid) {
        rejected.push({ name: file.name, message: error });
        continue;
      }

      let finalFile = file;
      let convertedFromWebp = false;
      if (isWebpFile(file)) {
        try {
          finalFile = await convertWebpToJpeg(file);
          convertedFromWebp = true;
        } catch {
          rejected.push({
            name: file.name,
            message: "Couldn't convert this WebP image — try a different file.",
          });
          continue;
        }
      }

      accepted.push({
        id: crypto.randomUUID(),
        file: finalFile,
        name: finalFile.name,
        size: finalFile.size,
        previewUrl: URL.createObjectURL(finalFile),
        convertedFromWebp,
      });
    }

    if (accepted.length) setPhotos((prev) => [...prev, ...accepted]);
    setErrors(rejected);
    return { addedCount: accepted.length, rejectedCount: rejected.length };
  }, []);

  // Merges a patch into one photo (used to attach metadata, optimized bytes, etc.)
  const updatePhoto = useCallback((id, patch) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }, []);

  const removePhoto = useCallback((id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl); // free browser memory
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setPhotos((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      return [];
    });
    setErrors([]);
  }, []);

  const clearErrors = useCallback(() => setErrors([]), []);

  return {
    photos,
    errors,
    addFiles,
    updatePhoto,
    removePhoto,
    clearAll,
    clearErrors,
  };
}
