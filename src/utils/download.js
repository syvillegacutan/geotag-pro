import JSZip from "jszip";

// Triggers a browser "Save file" for a Blob with the given filename.
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Ensures a filename is unique within the zip (e.g. two "photo.jpg" ->
// "photo.jpg" and "photo-2.jpg").
function uniqueName(name, used) {
  if (!used.has(name)) return name;
  const dot = name.lastIndexOf(".");
  const base = dot === -1 ? name : name.slice(0, dot);
  const ext = dot === -1 ? "" : name.slice(dot);
  let i = 2;
  while (used.has(`${base}-${i}${ext}`)) i++;
  return `${base}-${i}${ext}`;
}

// Packages all optimized photos into a ZIP and downloads it, keeping original
// filenames. Returns the number of photos included.
export async function downloadZip(photos, zipName = "geotag-pro-optimized.zip") {
  const zip = new JSZip();
  const used = new Set();
  let count = 0;

  for (const photo of photos) {
    if (!photo.optimized) continue;
    const name = uniqueName(photo.name, used);
    used.add(name);
    zip.file(name, photo.optimized.bytes);
    count += 1;
  }

  const content = await zip.generateAsync({ type: "blob" });
  downloadBlob(content, zipName);
  return count;
}
