import { useCallback, useState } from "react";
import { validatePhotoFile } from "../utils/fileValidation";

// Central store for uploaded photos. Each photo is:
//   { id, file, name, size, previewUrl }
// Later phases add metadata fields (GPS, keywords, optimized bytes) to these.
export function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState([]); // [{ name, message }]

  // Accepts a FileList (from drag-drop or the file picker), validates each
  // file, adds the valid ones, and records any rejections as errors.
  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList || []);
    const accepted = [];
    const rejected = [];

    for (const file of files) {
      const { valid, error } = validatePhotoFile(file);
      if (valid) {
        accepted.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          previewUrl: URL.createObjectURL(file),
        });
      } else {
        rejected.push({ name: file.name, message: error });
      }
    }

    if (accepted.length) setPhotos((prev) => [...prev, ...accepted]);
    setErrors(rejected);
    return { addedCount: accepted.length, rejectedCount: rejected.length };
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

  return { photos, errors, addFiles, removePhoto, clearAll, clearErrors };
}
