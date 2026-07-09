import { useCallback, useState } from "react";
import { writeMetadata } from "../utils/writeMetadata";

// Applies the chosen GPS location + SEO metadata to every uploaded photo.
// Each photo is processed independently: a failure on one is recorded on that
// photo and does not stop the rest. Awaiting between photos lets the UI update
// each badge progressively.
export function useOptimizer(photos, location, metadata, updatePhoto) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const optimizeAll = useCallback(async () => {
    setIsOptimizing(true);
    setProgress({ done: 0, total: photos.length });

    const seoData = {
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords,
      author: metadata.author,
    };

    let done = 0;
    for (const photo of photos) {
      try {
        const { blob, bytes } = await writeMetadata(photo.file, {
          gps: location,
          seo: seoData,
        });
        updatePhoto(photo.id, {
          optimized: {
            blob,
            bytes,
            size: blob.size,
            gps: { ...location },
            seo: seoData,
          },
          optimizeError: false,
        });
      } catch {
        updatePhoto(photo.id, { optimizeError: true });
      }
      done += 1;
      setProgress({ done, total: photos.length });
    }

    setIsOptimizing(false);
  }, [photos, location, metadata, updatePhoto]);

  return { isOptimizing, progress, optimizeAll };
}
