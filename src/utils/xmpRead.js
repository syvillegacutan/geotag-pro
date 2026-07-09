import { bytesToLatin1 } from "./binary";
import { XMP_NAMESPACE } from "./xmpWrite";

// Reads SEO-relevant metadata already embedded in a JPEG.
// Returns { keywords, title, description, hasXmp, hasIptc }.
// Keywords come from the XMP dc:subject field. We also do a lightweight check
// for a legacy IPTC block (APP13) so the "Has Keywords" badge is accurate even
// for photos tagged by older tools.
export function readXmp(bytes) {
  const latin1 = bytesToLatin1(bytes);

  // Lightweight legacy-IPTC presence check (badge only — we don't parse it).
  const hasIptc = latin1.includes("Photoshop 3.0") && latin1.includes("8BIM");

  const nsIndex = latin1.indexOf(XMP_NAMESPACE);
  if (nsIndex === -1) {
    return { keywords: [], title: "", description: "", hasXmp: false, hasIptc };
  }

  const start = latin1.indexOf("<x:xmpmeta", nsIndex);
  const endMarker = "</x:xmpmeta>";
  const end = latin1.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    return { keywords: [], title: "", description: "", hasXmp: true, hasIptc };
  }

  // Latin-1 indices equal byte offsets, so we can decode the exact XML slice as
  // UTF-8 to recover correct text (including accented characters).
  const xml = new TextDecoder("utf-8").decode(
    bytes.subarray(start, end + endMarker.length)
  );

  return {
    keywords: extractSubject(xml),
    title: extractAltText(xml, "dc:title"),
    description: extractAltText(xml, "dc:description"),
    hasXmp: true,
    hasIptc,
  };
}

function decodeEntities(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function extractSubject(xml) {
  const block = /<dc:subject>[\s\S]*?<\/dc:subject>/.exec(xml);
  if (!block) return [];
  const items = block[0].match(/<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>/g) || [];
  return items
    .map((li) => decodeEntities(li.replace(/<[^>]+>/g, "").trim()))
    .filter(Boolean);
}

function extractAltText(xml, tag) {
  const block = new RegExp(`<${tag}>[\\s\\S]*?</${tag}>`).exec(xml);
  if (!block) return "";
  const li = /<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>/.exec(block[0]);
  const raw = li ? li[1] : block[0];
  return decodeEntities(raw.replace(/<[^>]+>/g, "").trim());
}
