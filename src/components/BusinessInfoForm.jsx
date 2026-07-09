// The four business-info fields. Calls onField(fieldName, value) on every edit.
export default function BusinessInfoForm({ businessInfo, onField }) {
  const fieldClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green";

  const fields = [
    {
      name: "businessName",
      label: "Business Name",
      placeholder: "CJS Locksmith",
      hint: "Your business's name — also used as the photo's author/credit.",
    },
    {
      name: "primaryService",
      label: "Primary Service / Keyword",
      placeholder: "Emergency Locksmith",
      hint: "The main thing you want to be found for.",
    },
    {
      name: "city",
      label: "City / Location",
      placeholder: "Houston, TX",
      hint: "Where you operate — key for local search.",
    },
    {
      name: "additionalKeywords",
      label: "Additional Keywords",
      placeholder: "car lockout, 24/7 locksmith, lock replacement",
      hint: "Comma-separated. Other services or terms customers search for.",
    },
  ];

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">
            {field.label}
          </span>
          <input
            type="text"
            placeholder={field.placeholder}
            value={businessInfo[field.name]}
            onChange={(e) => onField(field.name, e.target.value)}
            className={fieldClass}
          />
          <span className="mt-0.5 block text-[11px] text-slate-400">
            {field.hint}
          </span>
        </label>
      ))}
    </div>
  );
}
