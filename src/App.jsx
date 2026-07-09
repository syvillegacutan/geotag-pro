import { useState } from "react";
import { usePhotos } from "./hooks/usePhotos";
import { useExifData } from "./hooks/useExifData";
import { useMapLocation } from "./hooks/useMapLocation";
import { useSeoMetadata } from "./hooks/useSeoMetadata";
import { useOptimizer } from "./hooks/useOptimizer";
import Header from "./components/Header";
import StepBar from "./components/StepBar";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import LeadGenCTA from "./components/LeadGenCTA";
import UploadZone from "./components/UploadZone";
import UrlImport from "./components/UrlImport";
import UploadErrors from "./components/UploadErrors";
import ThumbnailGrid from "./components/ThumbnailGrid";
import MapPicker from "./components/MapPicker";
import LocationInputs from "./components/LocationInputs";
import BusinessInfoForm from "./components/BusinessInfoForm";
import MetadataPreview from "./components/MetadataPreview";
import OptimizeButton from "./components/OptimizeButton";
import DownloadBar from "./components/DownloadBar";
import HelpVerify from "./components/HelpVerify";
import { formatCoords } from "./utils/coords";
import { downloadBlob, downloadZip } from "./utils/download";

// Consistent white card wrapper for each content section.
function Section({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <h2 className="mb-3 text-lg font-semibold text-brand-navy">{title}</h2>
      {children}
    </section>
  );
}

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

  const { isOptimizing, progress, optimizeAll } = useOptimizer(
    photos,
    location,
    seo.metadata,
    updatePhoto
  );
  const [showOverwrite, setShowOverwrite] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // What must be true before optimizing (also drives the "missing" hints).
  const hasBusinessName = seo.businessInfo.businessName.trim().length > 0;
  const canOptimize = photos.length > 0 && !!location && hasBusinessName;

  const missing = [];
  if (photos.length === 0) missing.push("Upload at least one photo");
  if (!location) missing.push("Select a location on the map");
  if (!hasBusinessName) missing.push("Enter a business name");

  const optimizedCount = photos.filter((p) => p.optimized).length;
  const failedCount = photos.filter((p) => p.optimizeError).length;

  // Drives the highlighted step in the progress bar.
  let currentStep = 1;
  if (photos.length > 0) currentStep = 2;
  if (optimizedCount > 0) currentStep = 3;

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

  async function handleDownloadAll() {
    setIsZipping(true);
    try {
      await downloadZip(photos);
    } finally {
      setIsZipping(false);
    }
  }

  function handleDownloadOne(photo) {
    if (photo.optimized) downloadBlob(photo.optimized.blob, photo.name);
  }

  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <Header />
      <StepBar currentStep={currentStep} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* LEFT column — location + business info */}
          <div className="space-y-4">
            <Section title="Business location">
              <div className="space-y-3">
                <ErrorBoundary
                  fallback={
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
                      The map couldn&apos;t load. You can still set your location
                      using the coordinate fields or Google Maps link below.
                    </div>
                  }
                >
                  <MapPicker location={location} onPick={setLocation} />
                </ErrorBoundary>
                <p className="text-sm text-slate-600">
                  Selected:{" "}
                  <span className="font-medium text-brand-navy">
                    {location
                      ? formatCoords(location.lat, location.lng)
                      : "none yet — click the map"}
                  </span>
                </p>
                <LocationInputs location={location} onSet={setLocation} />
              </div>
            </Section>

            <Section title="Business info & SEO keywords">
              <div className="space-y-4">
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
              </div>
            </Section>
          </div>

          {/* RIGHT column — upload + photo grid */}
          <div className="space-y-4">
            <Section title="Upload photos">
              <div className="space-y-3">
                <UploadZone onFiles={addFiles} />
                <UrlImport onFile={(file) => addFiles([file])} />
                <UploadErrors errors={errors} onDismiss={clearErrors} />
                <ThumbnailGrid
                  photos={photos}
                  onRemove={removePhoto}
                  onClearAll={clearAll}
                  onDownload={handleDownloadOne}
                />
              </div>
            </Section>
          </div>
        </div>

        {/* Full-width action bar — optimize + download */}
        <Section title="Optimize & download" className="mt-4">
          <div className="space-y-3">
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
                    className="rounded bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-700"
                  >
                    Overwrite &amp; optimize
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOverwrite(false)}
                    className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <OptimizeButton
                canOptimize={canOptimize}
                isOptimizing={isOptimizing}
                progress={progress}
                missing={missing}
                onClick={handleOptimizeClick}
              />
              <DownloadBar
                optimizedCount={optimizedCount}
                isZipping={isZipping}
                onDownloadAll={handleDownloadAll}
              />
            </div>

            {failedCount > 0 && (
              <p className="text-sm font-medium text-red-600">
                {failedCount} photo{failedCount === 1 ? "" : "s"} couldn&apos;t
                be optimized and {failedCount === 1 ? "was" : "were"} skipped.
              </p>
            )}

            {optimizedCount > 0 && (
              <>
                <p className="text-sm font-medium text-green-700">
                  ✓ {optimizedCount} of {photos.length} photo
                  {photos.length === 1 ? "" : "s"} optimized.
                </p>
                <p className="text-xs text-slate-500">
                  Tip: verify the embedded data by uploading a downloaded photo
                  to a free viewer like{" "}
                  <a
                    href="https://exifdata.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-green underline"
                  >
                    exifdata.com
                  </a>
                  .
                </p>
              </>
            )}
          </div>
        </Section>

        <div className="mt-4">
          <HelpVerify />
        </div>
      </main>

      <LeadGenCTA />
      <Footer />
    </div>
  );
}
