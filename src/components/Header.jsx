import { APP_NAME, APP_TAGLINE } from "../constants/config";

// Dark navy app header with name + tagline.
export default function Header() {
  return (
    <header className="bg-brand-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
        <span className="text-2xl" aria-hidden="true">
          📍
        </span>
        <div>
          <h1 className="text-xl font-bold leading-tight sm:text-2xl">
            {APP_NAME}
          </h1>
          <p className="text-xs text-slate-300 sm:text-sm">{APP_TAGLINE}</p>
        </div>
      </div>
    </header>
  );
}
