import { formatFileSize } from "../utils/formatFileSize";
import MetadataBadge from "./MetadataBadge";

// One photo tile: preview image, filename, size, metadata badges, and a
// remove (×) button.
export default function ThumbnailCard({ photo, onRemove }) {
  const meta = photo.original; // undefined until metadata has been read
  const loading = !meta;
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
        </div>
      </div>
    </div>
  );
}
