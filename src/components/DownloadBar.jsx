// "Download All" button — only shown once at least one photo is optimized.
export default function DownloadBar({ optimizedCount, isZipping, onDownloadAll }) {
  if (optimizedCount === 0) return null;

  return (
    <button
      type="button"
      disabled={isZipping}
      onClick={onDownloadAll}
      className={`w-full rounded-md px-4 py-3 text-sm font-semibold text-white transition-colors ${
        isZipping
          ? "cursor-not-allowed bg-slate-300"
          : "bg-brand-navy hover:bg-slate-800"
      }`}
    >
      {isZipping
        ? "Preparing ZIP…"
        : `Download All (${optimizedCount}) as ZIP`}
    </button>
  );
}
