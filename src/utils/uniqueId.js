// Generates a unique id for an uploaded photo.
//
// crypto.randomUUID() is only defined in *secure contexts* (HTTPS or
// localhost). When the app is opened over plain HTTP on a network address
// (e.g. Vite's http://192.168.x.x "Network" URL, or a LAN/preview host),
// crypto.randomUUID is undefined and would throw. We fall back to
// crypto.getRandomValues (available in insecure contexts) to build a v4-style
// UUID, and finally to a timestamp+random id if Web Crypto is missing entirely.
export function uniqueId() {
  const c = typeof crypto !== "undefined" ? crypto : undefined;

  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }

  if (c && typeof c.getRandomValues === "function") {
    const b = c.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40; // version 4
    b[8] = (b[8] & 0x3f) | 0x80; // variant 10
    const h = Array.from(b, (x) => x.toString(16).padStart(2, "0"));
    return `${h[0]}${h[1]}${h[2]}${h[3]}-${h[4]}${h[5]}-${h[6]}${h[7]}-${h[8]}${h[9]}-${h[10]}${h[11]}${h[12]}${h[13]}${h[14]}${h[15]}`;
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
