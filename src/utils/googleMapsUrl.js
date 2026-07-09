// Extracts { lat, lng } from pasted input. Handles the common Google Maps URL
// shapes plus a plainly-typed "lat, lng". Returns null if no coordinates are
// found (e.g. a shortened goo.gl link, which hides the coordinates until opened).
export function parseGoogleMapsUrl(input) {
  if (!input) return null;
  const str = String(input).trim();

  // 1) Plainly typed "29.7604, -95.3698"
  const plain = /^(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/.exec(str);
  if (plain) return toCoords(plain[1], plain[2]);

  // 2) Place data "!3d<lat>!4d<lng>" — the most precise (the actual pin, not
  //    the map center). Checked first.
  const data = /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/.exec(str);
  if (data) return toCoords(data[1], data[2]);

  // 3) "@<lat>,<lng>" — the map viewport center (common in /maps/@... URLs)
  const at = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(str);
  if (at) return toCoords(at[1], at[2]);

  // 4) Query params: q= / query= / ll= / sll= / center=
  const query =
    /[?&](?:q|query|ll|sll|center)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(str);
  if (query) return toCoords(query[1], query[2]);

  return null;
}

function toCoords(latStr, lngStr) {
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}
