import ThumbnailCard from "./ThumbnailCard";
import { formatFileSize } from "../utils/formatFileSize";

// Displays all uploaded photos as a responsive grid of thumbnails, with a
// header showing the count + combined file size and a "Clear all" button.
export default function ThumbnailGrid({ photos, onRemove, onClearAll, onDownload }) {
  if (photos.length === 0) return null;

  const totalBytes = photos.reduce((sum, p) => sum + (p.size || 0), 0);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-brand-navy">
          {photos.length} photo{photos.length === 1 ? "" : "s"}{" "}
          <span className="font-normal text-slate-500">
            · {formatFileSize(totalBytes)} total
          </span>
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-slate-500 underline hover:text-red-600"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo) => (
          <ThumbnailCard
            key={photo.id}
            photo={photo}
            onRemove={onRemove}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
}
