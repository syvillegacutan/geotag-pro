import { APP_NAME } from "../constants/config";

// Shown instead of the app when the browser is missing required features.
export default function UnsupportedBrowser({ missing }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-bold text-brand-navy">{APP_NAME}</h1>
        <p className="mt-3 text-sm text-slate-600">
          Your browser doesn&apos;t support everything {APP_NAME} needs
          {missing.length ? ` (${missing.join(", ")})` : ""}.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Please use the latest version of{" "}
          <span className="font-medium">Chrome, Edge, Firefox, or Safari</span>{" "}
          and try again.
        </p>
      </div>
    </div>
  );
}
