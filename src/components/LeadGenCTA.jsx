import { BRAND } from "../constants/config";

// Subtle, non-intrusive lead-gen band above the footer.
export default function LeadGenCTA() {
  return (
    <section className="border-t border-slate-200 bg-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p className="text-sm text-slate-600">{BRAND.ctaHeadline}</p>
        <a
          href={BRAND.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-md border border-brand-green px-4 py-2 text-sm font-medium text-brand-green transition-colors hover:bg-brand-green hover:text-white"
        >
          {BRAND.ctaButtonLabel}
        </a>
      </div>
    </section>
  );
}
