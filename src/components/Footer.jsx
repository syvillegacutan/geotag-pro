import { BRAND } from "../constants/config";

const linkClass =
  "font-medium text-white underline transition-colors hover:text-brand-green";

// Dark navy footer with SySEO Lab attribution and a link to the free SEO tools.
export default function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-4 text-center text-sm sm:px-6">
        <p>
          <a
            href="https://syseolab.com/tools"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            See all free SEO tools
          </a>
        </p>
        <p className="mt-1">
          Built by{" "}
          <a
            href={BRAND.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {BRAND.companyName}
          </a>
        </p>
      </div>
    </footer>
  );
}
