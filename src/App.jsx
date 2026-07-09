import { useState } from "react";
import { APP_NAME, APP_TAGLINE, STEPS } from "./constants/config";
import { usePhotos } from "./hooks/usePhotos";
import { useExifData } from "./hooks/useExifData";
import { useMapLocation } from "./hooks/useMapLocation";
import { useSeoMetadata } from "./hooks/useSeoMetadata";
import { useOptimizer } from "./hooks/useOptimizer";
import UploadZone from "./components/UploadZone";
import UploadErrors from "./components/UploadErrors";
import ThumbnailGrid from "./components/ThumbnailGrid";
import MapPicker from "./components/MapPicker";
import LocationInputs from "./components/LocationInputs";
import BusinessInfoForm from "./components/BusinessInfoForm";
import MetadataPreview from "./components/MetadataPreview";
import OptimizeButton from "./components/OptimizeButton";
import { formatCoords } from "./utils/coords";

export default function App() {
  const {
    photos,
    errors,
    addFiles,
    updatePhoto,
    removePhoto,
    clearAll,
    clearErrors,
  } = usePhotos();

  const { location, setLocation } = useMapLocation();
  const seo = useSeoMetadata();

  // Read existing GPS/keyword metadata for each uploaded photo.
  useExifData(photos, updatePhoto);

  const { isOptimizing, optimizeAll } = useOptimizer(
    photos,
    location,
    seo.metadata,
    updatePhoto
  );
  const [showOverwrite, setShowOverwrite] = useState(false);

  // What must be true before optimizing (also drives the "missing" hints).
  const hasBusinessName = seo.businessInfo.businessName.trim().length > 0;
  const canOptimize = photos.length > 0 && !!location && hasBusinessName;

  const missing = [];
  if (photos.length === 0) missing.push("Upload at least one photo");
  if (!location) missing.push("Select a location on the map");
  if (!hasBusinessName) missing.push("Enter a business name");

  const optimizedCount = photos.filter((p) => p.optimized).length;

  function handleOptimizeClick() {
    const anyTagged = photos.some(
      (p) => p.original && (p.original.hasGps || p.original.hasKeywords)
    );
    if (anyTagged) {
      setShowOverwrite(true);
    } else {
      optimizeAll();
    }
  }

  function confirmOverwrite() {
    setShowOverwrite(false);
    optimizeAll();
  }

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
        {/* Phase 4 — Interactive map (real) */}
        <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">
            Business location
          </h2>
          <MapPicker location={location} onPick={setLocation} />
          <p className="text-sm text-slate-600">
            Selected:{" "}
            <span className="font-medium text-brand-navy">
              {location ? formatCoords(location.lat, location.lng) : "none yet — click the map"}
            </span>
          </p>
          <LocationInputs location={location} onSet={setLocation} />
        </section>

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

        {/* Phase 5 — SEO metadata form (real) */}
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">
            Business info &amp; SEO keywords
          </h2>
          <BusinessInfoForm
            businessInfo={seo.businessInfo}
            onField={seo.setField}
          />
          <MetadataPreview
            metadata={seo.metadata}
            onEditTitle={seo.setTitleOverride}
            onEditDescription={seo.setDescriptionOverride}
            onResetTitle={seo.resetTitle}
            onResetDescription={seo.resetDescription}
            isTitleEdited={seo.isTitleEdited}
            isDescriptionEdited={seo.isDescriptionEdited}
          />
        </section>
        {/* Phase 6 — Optimize (download comes in Phase 7) */}
        <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-navy">
            Optimize &amp; download
          </h2>

          {showOverwrite && (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-medium">
                Some photos already contain GPS or keyword data.
              </p>
              <p className="mt-1">
                Optimizing will overwrite that existing data.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={confirmOverwrite}
                  className="rounded bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
                >
                  Overwrite &amp; optimize
                </button>
                <button
                  type="button"
                  onClick={() => setShowOverwrite(false)}
                  className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <OptimizeButton
            canOptimize={canOptimize}
            isOptimizing={isOptimizing}
            missing={missing}
            onClick={handleOptimizeClick}
          />

          {optimizedCount > 0 && (
            <p className="text-sm font-medium text-green-700">
              ✓ {optimizedCount} of {photos.length} photo
              {photos.length === 1 ? "" : "s"} optimized. (Download comes in the
              next step.)
            </p>
          )}
        </section>
      </main>

      {/* Footer (built for real in Phase 8) */}
      <footer className="bg-brand-navy px-6 py-4 text-center text-sm text-slate-300">
        Built by SySEO Lab
      </footer>
    </div>
  );
}
