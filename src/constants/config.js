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
export const ACCEPTED_MIME_TYPES = ["image/jpeg"];
export const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg"];
export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

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
