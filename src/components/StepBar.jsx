import { STEPS } from "../constants/config";

// Horizontal 1-2-3 progress bar. The active step is green; completed steps
// show a check; upcoming steps are muted.
export default function StepBar({ currentStep }) {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        {STEPS.map((step) => {
          const active = step.id === currentStep;
          const done = step.id < currentStep;
          return (
            <li key={step.id} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  active
                    ? "bg-brand-green text-white"
                    : done
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {done ? "✓" : step.id}
              </span>
              <span
                className={`text-sm transition-colors ${
                  active ? "font-semibold text-brand-navy" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
