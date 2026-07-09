import { APP_NAME, APP_TAGLINE, STEPS } from "./constants/config";
import { usePhotos } from "./hooks/usePhotos";
import UploadZone from "./components/UploadZone";
import UploadErrors from "./components/UploadErrors";
import ThumbnailGrid from "./components/ThumbnailGrid";

// Placeholder for sections not yet built (replaced phase by phase).
function PlaceholderSection({ phase, title, children }) {
  return (
    <section className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-6">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-green">
        {phase}
      </div>
      <h2 className="text-lg font-semibold text-brand-navy">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{children}</p>
    </section>
  );
}

export default function App() {
  const { photos, errors, addFiles, removePhoto, clearAll, clearErrors } =
    usePhotos();

  return (
    <div className="flex min-h-full flex-col">
      {/* Header (built for real in Phase 8) */}
      <header className="bg-brand-navy px-6 py-5 text-white">
        <h1 className="text-2xl font-bold">{APP_NAME}</h1>
        <p className="mt-1 text-sm text-slate-300">{APP_TAGLINE}</p>
      </header>

      {/* Three-step instruction bar (built for real in Phase 8) */}
      <nav className="flex flex-wrap gap-3 border-b border-slate-200 bg-white px-6 py-3">
        {STEPS.map((step) => (
          <span key={step.id} className="text-sm text-slate-500">
            <span className="font-semibold text-brand-navy">{step.id}.</span>{" "}
            {step.label}
          </span>
        ))}
      </nav>

      {/* Main content */}
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-4 p-6 md:grid-cols-2">
        <PlaceholderSection phase="Phase 4" title="Location map">
          Interactive map to pick your business location.
        </PlaceholderSection>

        {/* Phase 2 — Photo upload system (real) */}
        <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Upload photos</h2>
          <UploadZone onFiles={addFiles} />
          <UploadErrors errors={errors} onDismiss={clearErrors} />
          <ThumbnailGrid
            photos={photos}
            onRemove={removePhoto}
            onClearAll={clearAll}
          />
        </section>

        <PlaceholderSection phase="Phase 5" title="Business info & SEO keywords">
          Business name, service, city, and keywords.
        </PlaceholderSection>
        <PlaceholderSection phase="Phase 6 / 7" title="Optimize & download">
          Embed GPS + keywords, then download optimized photos.
        </PlaceholderSection>
      </main>

      {/* Footer (built for real in Phase 8) */}
      <footer className="bg-brand-navy px-6 py-4 text-center text-sm text-slate-300">
        Built by SySEO Lab
      </footer>
    </div>
  );
}
