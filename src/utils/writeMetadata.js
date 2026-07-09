import piexif from "piexifjs";
import { decimalToDmsRational } from "./coords";
import { fileToDataUrl, dataUrlToUint8Array } from "./binary";
import { buildXmpPacket, insertXmp } from "./xmpWrite";

// EXIF ImageDescription/Artist/Copyright are ASCII-only fields. We drop any
// non-ASCII characters here so piexifjs can't choke — the full, correct text
// (including accents) still lives in the XMP block.
function asciiSafe(value) {
  let result = "";
  const str = String(value);
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) <= 127) result += str[i];
  }
  return result;
}

// Writes GPS + SEO metadata into a JPEG File, LOSSLESSLY (no pixel re-encode).
//   options.gps = { lat, lng } | null
//   options.seo = { title, description, keywords: [], author } | null
// Returns { blob, bytes } for the optimized photo. All ORIGINAL EXIF is
// preserved; we only add/overwrite GPS and our text/keyword fields.
export async function writeMetadata(file, { gps, seo } = {}) {
  const originalDataUrl = await fileToDataUrl(file);

  // 1) EXIF — load existing data (preserved), then add GPS + text fields.
  let exifObj;
  try {
    exifObj = piexif.load(originalDataUrl);
  } catch {
    exifObj = { "0th": {}, Exif: {}, GPS: {}, "1st": {}, thumbnail: null };
  }
  exifObj["0th"] = exifObj["0th"] || {};
  exifObj.GPS = exifObj.GPS || {};

  if (gps && gps.lat != null && gps.lng != null) {
    exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef] = gps.lat < 0 ? "S" : "N";
    exifObj.GPS[piexif.GPSIFD.GPSLatitude] = decimalToDmsRational(gps.lat);
    exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef] = gps.lng < 0 ? "W" : "E";
    exifObj.GPS[piexif.GPSIFD.GPSLongitude] = decimalToDmsRational(gps.lng);
  }

  if (seo) {
    if (seo.description) {
      exifObj["0th"][piexif.ImageIFD.ImageDescription] = asciiSafe(seo.description);
    }
    if (seo.author) {
      exifObj["0th"][piexif.ImageIFD.Artist] = asciiSafe(seo.author);
      exifObj["0th"][piexif.ImageIFD.Copyright] = asciiSafe(`© ${seo.author}`);
    }
  }

  const exifStr = piexif.dump(exifObj);
  const withExifDataUrl = piexif.insert(exifStr, originalDataUrl);

  // 2) XMP — splice keyword/title/description/author block (lossless).
  let bytes = dataUrlToUint8Array(withExifDataUrl);
  if (seo) {
    const packet = buildXmpPacket({
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      author: seo.author,
    });
    bytes = insertXmp(bytes, packet);
  }

  const blob = new Blob([bytes], { type: "image/jpeg" });
  return { blob, bytes };
}
