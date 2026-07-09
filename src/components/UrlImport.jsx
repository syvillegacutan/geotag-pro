import { useState } from "react";
import { fetchImageFromUrl } from "../utils/fetchImageFromUrl";

// Lets users paste a direct image URL from the web. On "Add" it fetches the
// image client-side, turns it into a File, and hands it to onFile() — which
// feeds the same upload pipeline as drag-and-drop. Fetch errors show inline
// (kept separate from the shared upload-errors alert). One URL at a time.
export default function UrlImport({ onFile }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canAdd = url.trim().length > 0 && !loading;

  async function handleAdd() {
    const value = url.trim();
    if (!value || loading) return;

    setLoading(true);
    setError("");
    try {
      const file = await fetchImageFromUrl(value);
      onFile(file);
      setUrl(""); // clear so the next URL can be pasted
    } catch (err) {
      setError(err?.message || "Could not load image from this URL");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div>
      <label
        htmlFor="url-import-input"
        className="block text-sm font-medium text-brand-navy"
      >
        Or paste image URL(s) from the web
      </label>

      <div className="mt-1 flex gap-2">
        <input
          id="url-import-input"
          type="url"
          inputMode="url"
          placeholder="https://example.com/photo.jpg"
          value={url}
          disabled={loading}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green disabled:bg-slate-50"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors ${
            canAdd
              ? "bg-brand-green hover:bg-brand-green-hover"
              : "cursor-not-allowed bg-slate-300"
          }`}
        >
          {loading && (
            <svg
              className="h-4 w-4 animate-spin text-white"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
              />
            </svg>
          )}
          {loading ? "Loading…" : "Add"}
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
