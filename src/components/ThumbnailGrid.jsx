import ThumbnailCard from "./ThumbnailCard";
import { formatFileSize } from "../utils/formatFileSize";
import { BATCH_WARN_COUNT, BATCH_WARN_BYTES } from "../constants/config";

// Displays all uploaded photos as a responsive grid of thumbnails, with a
// header showing the count + combined file size and a "Clear all" button.
export default function ThumbnailGrid({ photos, onRemove, onClearAll, onDownload }) {
  if (photos.length === 0) return null;

  const totalBytes = photos.reduce((sum, p) => sum + (p.size || 0), 0);
  const isLargeBatch =
    photos.length > BATCH_WARN_COUNT || totalBytes > BATCH_WARN_BYTES;

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

      {isLargeBatch && (
        <div className="mb-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          That&apos;s a large batch. Since everything is processed right in your
          browser, optimizing this many photos at once may be slow or memory-heavy.
          For best results, consider doing it in smaller groups.
        </div>
      )}

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
