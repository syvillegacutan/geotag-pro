// Live preview of the metadata that will be embedded into each photo.
// Title and description are editable; a "reset to auto" link appears once edited.
export default function MetadataPreview({
  metadata,
  onEditTitle,
  onEditDescription,
  onResetTitle,
  onResetDescription,
  isTitleEdited,
  isDescriptionEdited,
}) {
  const fieldClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green";

  return (
    <div className="space-y-3 rounded-md bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Preview — what gets embedded
      </p>

      {/* Title (editable) */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">Image Title</span>
          <EditState edited={isTitleEdited} onReset={onResetTitle} />
        </div>
        <input
          type="text"
          value={metadata.title}
          onChange={(e) => onEditTitle(e.target.value)}
          placeholder="Fill in the fields to generate a title"
          className={fieldClass}
        />
      </div>

      {/* Description (editable) */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">
            Image Description
          </span>
          <EditState edited={isDescriptionEdited} onReset={onResetDescription} />
        </div>
        <textarea
          rows={3}
          value={metadata.description}
          onChange={(e) => onEditDescription(e.target.value)}
          placeholder="Fill in the fields to generate a description"
          className={`${fieldClass} resize-y`}
        />
      </div>

      {/* Keyword tags (read-only chips) */}
      <div>
        <span className="mb-1 block text-xs font-medium text-slate-600">
          Keyword Tags{" "}
          <span className="text-slate-400">({metadata.keywords.length})</span>
        </span>
        {metadata.keywords.length ? (
          <div className="flex flex-wrap gap-1.5">
            {metadata.keywords.map((kw, i) => (
              <span
                key={`${kw}-${i}`}
                className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800"
              >
                {kw}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No keywords yet.</p>
        )}
      </div>

      {/* Author / copyright */}
      <div>
        <span className="mb-1 block text-xs font-medium text-slate-600">
          Author / Copyright
        </span>
        <p className="text-sm text-brand-navy">
          {metadata.author || <span className="text-slate-400">—</span>}
        </p>
      </div>
    </div>
  );
}

function EditState({ edited, onReset }) {
  if (!edited) {
    return <span className="text-[11px] text-slate-400">auto-generated</span>;
  }
  return (
    <button
      type="button"
      onClick={onReset}
      className="text-[11px] font-medium text-brand-green underline"
    >
      edited — reset to auto
    </button>
  );
}
