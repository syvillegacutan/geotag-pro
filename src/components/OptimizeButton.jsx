// The main call-to-action. Disabled until the required inputs exist; when
// disabled it lists exactly what's still missing.
export default function OptimizeButton({ canOptimize, isOptimizing, missing, onClick }) {
  const disabled = !canOptimize || isOptimizing;

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`w-full rounded-md px-4 py-3 text-sm font-semibold text-white transition-colors ${
          disabled
            ? "cursor-not-allowed bg-slate-300"
            : "bg-brand-green hover:bg-brand-green-hover"
        }`}
      >
        {isOptimizing ? "Optimizing…" : "Optimize All Photos"}
      </button>

      {!canOptimize && missing.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs text-slate-500">
          {missing.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
