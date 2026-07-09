// Custom XMP writer. XMP is the modern, widely-read metadata standard that
// Lightroom, Bridge, most photo viewers, and Google understand. We build a
// small XMP packet and splice it into the JPEG as an APP1 segment WITHOUT
// touching the image pixels, so there is zero quality loss.

export const XMP_NAMESPACE = "http://ns.adobe.com/xap/1.0/";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Builds the XMP XML packet from SEO fields. Any empty field is omitted.
export function buildXmpPacket({ title, description, keywords = [], author } = {}) {
  const keywordItems = keywords
    .filter(Boolean)
    .map((kw) => `<rdf:li>${escapeXml(kw)}</rdf:li>`)
    .join("");

  const titleXml = title
    ? `<dc:title><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(title)}</rdf:li></rdf:Alt></dc:title>`
    : "";
  const descXml = description
    ? `<dc:description><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(description)}</rdf:li></rdf:Alt></dc:description>`
    : "";
  const subjectXml = keywordItems
    ? `<dc:subject><rdf:Bag>${keywordItems}</rdf:Bag></dc:subject>`
    : "";
  const creatorXml = author
    ? `<dc:creator><rdf:Seq><rdf:li>${escapeXml(author)}</rdf:li></rdf:Seq></dc:creator>`
    : "";
  const rightsXml = author
    ? `<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">© ${escapeXml(author)}</rdf:li></rdf:Alt></dc:rights>`
    : "";
  const creditXml = author
    ? `<photoshop:Credit>${escapeXml(author)}</photoshop:Credit>`
    : "";

  return (
    `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>` +
    `<x:xmpmeta xmlns:x="adobe:ns:meta/">` +
    `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">` +
    `<rdf:Description rdf:about="" ` +
    `xmlns:dc="http://purl.org/dc/elements/1.1/" ` +
    `xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/">` +
    titleXml +
    descXml +
    subjectXml +
    creatorXml +
    rightsXml +
    creditXml +
    `</rdf:Description></rdf:RDF></x:xmpmeta>` +
    `<?xpacket end="w"?>`
  );
}

// Finds the correct byte offset to insert our XMP segment: right after the
// SOI marker and any existing APPn segments (JFIF, EXIF, etc.), before the
// image data. This keeps the JPEG structurally valid.
function findInsertOffset(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return 2; // not a JPEG SOI: fallback
  let offset = 2;
  while (offset + 4 <= bytes.length && bytes[offset] === 0xff) {
    const marker = bytes[offset + 1];
    if (marker >= 0xe0 && marker <= 0xef) {
      const segLength = (bytes[offset + 2] << 8) | bytes[offset + 3];
      offset += 2 + segLength;
    } else {
      break;
    }
  }
  return offset;
}

// Splices an XMP packet into JPEG bytes and returns new bytes.
// If the packet is somehow too large for a single segment, returns the
// original bytes unchanged (keyword lists never approach this limit).
export function insertXmp(bytes, xmpPacket) {
  const payload = new TextEncoder().encode(XMP_NAMESPACE + "\x00" + xmpPacket);
  const segmentLength = payload.length + 2; // includes the 2 length bytes
  if (segmentLength > 0xffff) return bytes;

  const segment = new Uint8Array(4 + payload.length);
  segment[0] = 0xff; // APP1 marker
  segment[1] = 0xe1;
  segment[2] = (segmentLength >> 8) & 0xff;
  segment[3] = segmentLength & 0xff;
  segment.set(payload, 4);

  const insertAt = findInsertOffset(bytes);
  const out = new Uint8Array(bytes.length + segment.length);
  out.set(bytes.subarray(0, insertAt), 0);
  out.set(segment, insertAt);
  out.set(bytes.subarray(insertAt), insertAt + segment.length);
  return out;
}
