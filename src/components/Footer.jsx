import { BRAND } from "../constants/config";

const linkClass =
  "font-medium text-white underline transition-colors hover:text-brand-green";

// Dark navy footer with SySEO Lab attribution and cross-links to the other free tools.
export default function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-4 text-center text-sm sm:px-6">
        <p>
          More free SEO tools:{" "}
          <a
            href="https://syseolab.com/tools/schema/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Schema Pro
          </a>{" "}
          ·{" "}
          <a
            href="https://syseolab.com/tools/serp/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            SERP Pro
          </a>{" "}
          ·{" "}
          <a
            href="https://syseolab.com/tools/exif/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            EXIF Pro
          </a>{" "}
          ·{" "}
          <a
            href="https://syseolab.com/tools/local-seo-score/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Local SEO Score
          </a>{" "}
          ·{" "}
          <a
            href="https://syseolab.com/tools/webp/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            WebP Pro
          </a>{" "}
          ·{" "}
          <a
            href="https://syseolab.com/tools/content/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Content Pro
          </a>{" "}
          ·{" "}
          <a
            href="https://syseolab.com/tools/rename/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Rename Pro
          </a>{" "}
          ·{" "}
          <a
            href="https://syseolab.com/tools/ai-readiness/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            AI Search Readiness
          </a>{" "}
          ·{" "}
          <a
            href="https://syseolab.com/tools"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            All Free Tools
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
