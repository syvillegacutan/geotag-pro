import ThumbnailCard from "./ThumbnailCard";

// Displays all uploaded photos as a responsive grid of thumbnails,
// with a header showing the count and a "Clear all" button.
export default function ThumbnailGrid({ photos, onRemove, onClearAll }) {
  if (photos.length === 0) return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-brand-navy">
          {photos.length} photo{photos.length === 1 ? "" : "s"} uploaded
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
          <ThumbnailCard key={photo.id} photo={photo} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}
