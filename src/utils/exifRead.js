import piexif from "piexifjs";
import { dmsRationalToDecimal } from "./coords";

// Reads EXIF from a JPEG (data URL or binary string) and returns:
//   { exifObj, gps: { lat, lng } | null }
// piexifjs returns empty tables for photos that have no EXIF, so this is safe
// to call on any JPEG.
export function readExif(jpegData) {
  let exifObj;
  try {
    exifObj = piexif.load(jpegData);
  } catch {
    return { exifObj: null, gps: null };
  }

  const gpsIfd = exifObj.GPS || {};
  const lat = gpsIfd[piexif.GPSIFD.GPSLatitude];
  const lng = gpsIfd[piexif.GPSIFD.GPSLongitude];
  const latRef = gpsIfd[piexif.GPSIFD.GPSLatitudeRef];
  const lngRef = gpsIfd[piexif.GPSIFD.GPSLongitudeRef];

  let gps = null;
  if (lat && lng) {
    const decLat = dmsRationalToDecimal(lat, latRef);
    const decLng = dmsRationalToDecimal(lng, lngRef);
    if (decLat != null && decLng != null) {
      gps = { lat: decLat, lng: decLng };
    }
  }

  return { exifObj, gps };
}
