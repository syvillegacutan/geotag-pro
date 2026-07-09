import { formatCoords } from "../utils/coords";

// One before -> after row. The "after" (green) part only shows once optimized.
function Row({ label, before, after, optimized }) {
  return (
    <div className="grid grid-cols-[70px_1fr] gap-1">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="break-words">
        <span className="text-slate-500">{before || "—"}</span>
        {optimized && (
          <>
            {" "}
            <span className="text-slate-400">→</span>{" "}
            <span className="font-medium text-green-700">{after || "—"}</span>
          </>
        )}
      </span>
    </div>
  );
}

// Shows the metadata a photo has now, and (once optimized) what it became.
export default function PhotoDetails({ photo }) {
  const original = photo.original || {};
  const opt = photo.optimized;
  const optimized = !!opt;

  const beforeGps = original.gps
    ? formatCoords(original.gps.lat, original.gps.lng)
    : "none";
  const afterGps = opt ? formatCoords(opt.gps.lat, opt.gps.lng) : "";

  const beforeKeywords = original.keywords?.length
    ? original.keywords.join(", ")
    : "none";
  const afterKeywords = opt ? opt.seo.keywords.join(", ") : "";

  return (
    <div className="space-y-1 border-t border-slate-200 bg-slate-50 p-2 text-[11px] leading-snug">
      <Row label="GPS" before={beforeGps} after={afterGps} optimized={optimized} />
      <Row
        label="Title"
        before={original.title || "none"}
        after={opt?.seo.title}
        optimized={optimized}
      />
      <Row
        label="Desc"
        before={original.description || "none"}
        after={opt?.seo.description}
        optimized={optimized}
      />
      <Row
        label="Keywords"
        before={beforeKeywords}
        after={afterKeywords}
        optimized={optimized}
      />
      <Row
        label="Author"
        before="none"
        after={opt?.seo.author}
        optimized={optimized}
      />
    </div>
  );
}
