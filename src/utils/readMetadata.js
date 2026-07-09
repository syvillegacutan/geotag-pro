import { fileToDataUrl, fileToUint8Array } from "./binary";
import { readExif } from "./exifRead";
import { readXmp } from "./xmpRead";

// Reads all SEO-relevant metadata already present in a photo File.
// Returns a plain object stored on photo.original.
export async function readMetadata(file) {
  const dataUrl = await fileToDataUrl(file);
  const { gps } = readExif(dataUrl);

  const bytes = await fileToUint8Array(file);
  const xmp = readXmp(bytes);

  return {
    gps, // { lat, lng } | null
    keywords: xmp.keywords,
    title: xmp.title,
    description: xmp.description,
    hasGps: !!gps,
    hasKeywords: xmp.keywords.length > 0 || xmp.hasIptc,
  };
}
