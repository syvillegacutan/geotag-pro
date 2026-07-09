// Low-level conversions between the different shapes JPEG data takes:
// File  ->  data URL (for piexifjs)  <->  raw bytes (for XMP splicing).

// Reads a File and returns a base64 data URL (what piexifjs expects).
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Reads a File and returns its raw bytes as a Uint8Array.
export async function fileToUint8Array(file) {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

// Decodes a base64 data URL ("data:image/jpeg;base64,....") to raw bytes.
export function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Turns raw bytes into a Latin-1 string (one char per byte). Used to scan a
// JPEG for text markers. Processes in chunks to avoid call-stack limits.
export function bytesToLatin1(bytes) {
  let result = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    result += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return result;
}
