import { useRef, useState } from "react";

// The drag-and-drop upload box. Also opens the file picker when clicked.
// Calls onFiles(fileList) whenever the user drops or selects files.
export default function UploadZone({ onFiles }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
  }

  function handleChange(e) {
    if (e.target.files?.length) onFiles(e.target.files);
    e.target.value = ""; // reset so selecting the same file again still fires
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        dragActive
          ? "border-brand-green bg-green-50"
          : "border-slate-300 bg-white hover:border-slate-400"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/webp,.jpg,.jpeg,.webp"
        multiple
        hidden
        onChange={handleChange}
      />

      {/* upload icon */}
      <svg
        className="mb-3 h-10 w-10 text-brand-green"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 7.5 7.5 12M12 7.5V21"
        />
      </svg>

      <p className="font-medium text-brand-navy">
        Drag &amp; drop photos here
      </p>
      <p className="mt-1 text-sm text-slate-500">
        or <span className="text-brand-green underline">click to browse</span>
      </p>
      <p className="mt-2 text-xs text-slate-400">
        JPEG &amp; WebP photos (.jpg, .jpeg, .webp)
      </p>
    </div>
  );
}
