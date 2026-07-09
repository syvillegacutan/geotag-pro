import { BRAND } from "../constants/config";

// Dark navy footer with SySEO Lab attribution.
export default function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-4 text-center text-sm sm:px-6">
        Built by{" "}
        <a
          href={BRAND.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white underline transition-colors hover:text-brand-green"
        >
          {BRAND.companyName}
        </a>
      </div>
    </footer>
  );
}
