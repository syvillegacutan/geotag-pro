// GPS coordinates live in photos as EXIF "rationals" — degrees, minutes, and
// seconds, each written as a [numerator, denominator] pair. Maps and humans use
// plain decimal degrees (e.g. 29.760427). These helpers convert between them.

// Decimal degrees -> EXIF DMS rational triplet.
export function decimalToDmsRational(decimal) {
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const secondsFloat = (minutesFloat - minutes) * 60;
  // Keep seconds precise to ~4 decimals (well under a meter).
  const secondsNumerator = Math.round(secondsFloat * 10000);
  return [
    [degrees, 1],
    [minutes, 1],
    [secondsNumerator, 10000],
  ];
}

// EXIF DMS rational triplet + reference ("N"/"S"/"E"/"W") -> decimal degrees.
export function dmsRationalToDecimal(dms, ref) {
  if (!dms || dms.length !== 3) return null;
  const [d, m, s] = dms.map(([num, den]) => (den ? num / den : 0));
  let decimal = d + m / 60 + s / 3600;
  if (ref === "S" || ref === "W") decimal = -decimal;
  return decimal;
}

// Human-readable coordinates, e.g. "29.760427, -95.369804".
export function formatCoords(lat, lng) {
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    return "—";
  }
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}
