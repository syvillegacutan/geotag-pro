// Shows a red alert listing files that were rejected during upload
// (e.g. a PNG). Dismissible via the × button.
export default function UploadErrors({ errors, onDismiss }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="relative rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss errors"
        className="absolute right-2 top-2 text-red-400 hover:text-red-600"
      >
        ×
      </button>
      <p className="font-medium">Some files were skipped:</p>
      <ul className="mt-1 list-inside list-disc space-y-0.5">
        {errors.map((err, i) => (
          <li key={i}>
            <span className="font-medium">{err.name}</span> — {err.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
