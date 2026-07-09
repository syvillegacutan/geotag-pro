// Turns the business-info form fields into the actual metadata text that gets
// embedded in each photo. Each generator handles missing fields gracefully so
// the preview stays sensible while the user is still typing.

// "car lockout, 24/7 locksmith" -> ["car lockout", "24/7 locksmith"]
export function parseKeywords(text) {
  if (!text) return [];
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// "Emergency Locksmith - CJS Locksmith Houston, TX"
export function generateTitle({ businessName, primaryService, city } = {}) {
  const service = (primaryService || "").trim();
  const nameCity = [businessName, city].map((s) => (s || "").trim()).filter(Boolean).join(" ");
  if (service && nameCity) return `${service} - ${nameCity}`;
  return service || nameCity || "";
}

// "CJS Locksmith providing Emergency Locksmith in Houston, TX. car lockout, 24/7 locksmith."
export function generateDescription({ businessName, primaryService, city, additionalKeywords } = {}) {
  const name = (businessName || "").trim();
  const service = (primaryService || "").trim();
  const place = (city || "").trim();

  let sentence = "";
  if (name && service && place) sentence = `${name} providing ${service} in ${place}.`;
  else if (name && service) sentence = `${name} providing ${service}.`;
  else if (service && place) sentence = `${service} in ${place}.`;
  else if (name) sentence = `${name}.`;
  else if (service) sentence = `${service}.`;

  const keywords = parseKeywords(additionalKeywords);
  const keywordText = keywords.length ? ` ${keywords.join(", ")}.` : "";
  return (sentence + keywordText).trim();
}

// [Business Name, Primary Service, City, ...Additional Keywords], de-duplicated.
export function generateKeywords({ businessName, primaryService, city, additionalKeywords } = {}) {
  const base = [businessName, primaryService, city]
    .map((s) => (s || "").trim())
    .filter(Boolean);
  const all = [...base, ...parseKeywords(additionalKeywords)];

  const seen = new Set();
  const result = [];
  for (const kw of all) {
    const key = kw.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(kw);
    }
  }
  return result;
}

// Full auto-generated metadata bundle from the business-info fields.
export function buildMetadata(info = {}) {
  return {
    title: generateTitle(info),
    description: generateDescription(info),
    keywords: generateKeywords(info),
    author: (info.businessName || "").trim(),
  };
}
