// Central configuration for GeoTag Pro.
// Keeping these values in one place makes them easy to find and change later.

// App identity
export const APP_NAME = "GeoTag Pro";
export const APP_TAGLINE =
  "Free photo geotagging & SEO optimization for Google Business Profile";

// Branding / lead-gen (SySEO Lab)
export const BRAND = {
  companyName: "SySEO Lab",
  websiteUrl: "https://syseolab.com",
  ctaHeadline: "Need help with local SEO? We can help.",
  ctaButtonLabel: "Talk to SySEO Lab",
};

// Brand colors (also defined in index.css as Tailwind classes)
export const COLORS = {
  navy: "#1a1a2e",
  green: "#22c55e",
  greenHover: "#16a34a",
};

// Photo upload rules

// JPEG-only set — used by the web-URL import, which fetches only JPEGs.
export const JPEG_MIME_TYPES = ["image/jpeg"];
export const JPEG_EXTENSIONS = [".jpg", ".jpeg"];

// The WebP MIME type. WebP uploads are accepted, then auto-converted to JPEG
// (metadata can't be reliably embedded into WebP).
export const WEBP_MIME_TYPE = "image/webp";
export const WEBP_EXTENSION = ".webp";

// Full set of formats accepted for upload (drag-drop / file picker).
export const ACCEPTED_MIME_TYPES = [...JPEG_MIME_TYPES, WEBP_MIME_TYPE];
export const ACCEPTED_EXTENSIONS = [...JPEG_EXTENSIONS, WEBP_EXTENSION];

// JPEG quality used when converting WebP to JPEG (near-lossless).
export const WEBP_JPEG_QUALITY = 0.95;

export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// "Very large batch" thresholds — a non-blocking warning appears when a batch
// exceeds either of these, since all processing happens in the browser.
export const BATCH_WARN_COUNT = 30;
export const BATCH_WARN_MB = 200;
export const BATCH_WARN_BYTES = BATCH_WARN_MB * 1024 * 1024;

// Map defaults (centered on the USA until the user picks a location)
export const MAP_DEFAULTS = {
  center: [39.8283, -98.5795], // geographic center of the contiguous USA
  zoom: 4,
  pinnedZoom: 15,
};

// The three-step instruction bar shown to users
export const STEPS = [
  { id: 1, label: "Upload photos" },
  { id: 2, label: "Set location & keywords" },
  { id: 3, label: "Download optimized photos" },
];
