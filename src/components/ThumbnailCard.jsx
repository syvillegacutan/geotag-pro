import { useState } from "react";
import { formatFileSize } from "../utils/formatFileSize";
import MetadataBadge from "./MetadataBadge";
import PhotoDetails from "./PhotoDetails";

// One photo tile: preview image, filename, size, metadata badges, an
// expandable before/after details panel, a per-photo download (once
// optimized), and a remove (×) button.
export default function ThumbnailCard({ photo, onRemove, onDownload }) {
  const [showDetails, setShowDetails] = useState(false);

  const meta = photo.original; // undefined until metadata has been read
  const loading = !meta;
  const optimized = !!photo.optimized;
  const failed = !!photo.optimizeError;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => onRemove(photo.id)}
        title="Remove photo"
        aria-label={`Remove ${photo.name}`}
        className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-sm text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
      >
        ×
      </button>

      <div className="aspect-square w-full bg-slate-100">
        <img
          src={photo.previewUrl}
          alt={photo.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-2">
        <p className="truncate text-xs font-medium text-brand-navy" title={photo.name}>
          {photo.name}
        </p>
        <p className="text-xs text-slate-400">{formatFileSize(photo.size)}</p>

        <div className="mt-1.5 flex flex-wrap gap-1">
          {optimized ? (
            <>
              <MetadataBadge label="GPS ✓" active loading={false} />
              <MetadataBadge label="Keywords ✓" active loading={false} />
            </>
          ) : (
            <>
              <MetadataBadge
                label={meta?.hasGps ? "Has GPS" : "No GPS"}
                active={meta?.hasGps}
                loading={loading}
              />
              <MetadataBadge
                label={meta?.hasKeywords ? "Has Keywords" : "No Keywords"}
                active={meta?.hasKeywords}
                loading={loading}
              />
            </>
          )}
          {failed && (
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium leading-none text-red-700">
              Failed
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowDetails((s) => !s)}
            className="text-[11px] font-medium text-slate-500 hover:text-brand-navy"
          >
            {showDetails ? "▾ Hide details" : "▸ Details"}
          </button>
          {optimized && (
            <button
              type="button"
              onClick={() => onDownload(photo)}
              className="text-[11px] font-medium text-brand-green hover:underline"
            >
              ⬇ Download
            </button>
          )}
        </div>
      </div>

      {showDetails && <PhotoDetails photo={photo} />}
    </div>
  );
}
