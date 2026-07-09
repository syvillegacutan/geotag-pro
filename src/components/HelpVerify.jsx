import { APP_NAME } from "../constants/config";

// Collapsible help panel explaining how to confirm a photo's embedded GPS +
// keywords. Uses native <details> so it needs no JavaScript state.
export default function HelpVerify() {
  return (
    <details className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-brand-navy">
        How to verify your photos are tagged
        <span className="text-sm text-slate-400 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>

      <div className="mt-4 space-y-4 text-sm text-slate-600">
        <div>
          <p className="font-medium text-brand-navy">
            1. On Windows (fastest)
          </p>
          <p>
            Right-click the downloaded photo → <strong>Properties</strong> →{" "}
            <strong>Details</strong> tab. Look for <strong>GPS</strong> (Latitude
            / Longitude), plus <strong>Title</strong>, <strong>Tags</strong>{" "}
            (your keywords), and <strong>Authors</strong>.
          </p>
        </div>

        <div>
          <p className="font-medium text-brand-navy">
            2. On any device — free online viewer
          </p>
          <p>
            Upload a downloaded photo to{" "}
            <a
              href="https://exifdata.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-green underline"
            >
              exifdata.com
            </a>
            . It shows a map pin at the GPS location and lists the keywords,
            title, and author.
          </p>
        </div>

        <div>
          <p className="font-medium text-brand-navy">
            3. Right here in {APP_NAME}
          </p>
          <p>
            Re-upload a downloaded photo above — it will show green{" "}
            <strong>“Has GPS”</strong> and <strong>“Has Keywords”</strong>{" "}
            badges, and the <strong>▸ Details</strong> panel lists everything
            that was embedded.
          </p>
        </div>

        <p className="rounded-md bg-slate-50 p-3 text-xs text-slate-500">
          Tip: Some platforms (including Google Business Profile) strip metadata
          when you upload images to them. Keep these tagged originals for your
          records and asset library — that&apos;s where the embedded data lives.
        </p>
      </div>
    </details>
  );
}
