// A small status pill shown on each thumbnail, e.g. "Has GPS" / "No GPS".
// While metadata is still being read, it shows a neutral loading state.
export default function MetadataBadge({ label, active, loading }) {
  let classes = "bg-slate-100 text-slate-400"; // loading / neutral
  if (!loading) {
    classes = active
      ? "bg-green-100 text-green-700"
      : "bg-slate-100 text-slate-500";
  }
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium leading-none ${classes}`}
    >
      {loading ? "…" : label}
    </span>
  );
}
