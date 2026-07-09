import { useEffect, useRef } from "react";
import { readMetadata } from "../utils/readMetadata";

// Watches the photo list and reads existing metadata (GPS + keywords) for any
// photo that hasn't been analyzed yet, storing the result on photo.original.
// A ref tracks in-flight reads so we never process the same photo twice.
export function useExifData(photos, updatePhoto) {
  const processing = useRef(new Set());

  useEffect(() => {
    photos.forEach((photo) => {
      if (photo.original || processing.current.has(photo.id)) return;
      processing.current.add(photo.id);

      readMetadata(photo.file)
        .then((meta) => updatePhoto(photo.id, { original: meta }))
        .catch(() =>
          updatePhoto(photo.id, {
            original: {
              gps: null,
              keywords: [],
              title: "",
              description: "",
              hasGps: false,
              hasKeywords: false,
              error: true,
            },
          })
        )
        .finally(() => processing.current.delete(photo.id));
    });
  }, [photos, updatePhoto]);
}
