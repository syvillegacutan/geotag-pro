import { useEffect, useState } from "react";
import { parseGoogleMapsUrl } from "../utils/googleMapsUrl";

// Manual latitude/longitude fields plus a Google Maps URL paste box.
// Both feed the shared location via onSet(lat, lng). The fields also reflect
// changes that came from clicking the map or pasting a URL.
export default function LocationInputs({ location, onSet }) {
  const [latText, setLatText] = useState("");
  const [lngText, setLngText] = useState("");
  const [urlText, setUrlText] = useState("");
  const [urlError, setUrlError] = useState("");

  // Reflect externally-set locations (map click / URL) into the number fields.
  useEffect(() => {
    if (location) {
      setLatText(location.lat.toFixed(6));
      setLngText(location.lng.toFixed(6));
    }
  }, [location]);

  function handleLat(e) {
    const value = e.target.value;
    setLatText(value);
    const lat = parseFloat(value);
    const lng = parseFloat(lngText);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) onSet(lat, lng);
  }

  function handleLng(e) {
    const value = e.target.value;
    setLngText(value);
    const lat = parseFloat(latText);
    const lng = parseFloat(value);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) onSet(lat, lng);
  }

  function handleUrl(e) {
    const value = e.target.value;
    setUrlText(value);
    setUrlError("");
    if (!value.trim()) return;
    const parsed = parseGoogleMapsUrl(value);
    if (parsed) {
      onSet(parsed.lat, parsed.lng);
    } else {
      setUrlError(
        "Couldn't find coordinates in that link. Paste a full Google Maps URL, or type “lat, lng”."
      );
    }
  }

  const fieldClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">
            Latitude
          </span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="29.760427"
            value={latText}
            onChange={handleLat}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">
            Longitude
          </span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="-95.369804"
            value={lngText}
            onChange={handleLng}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600">
          Or paste a Google Maps link
        </span>
        <input
          type="text"
          placeholder="https://www.google.com/maps/place/..."
          value={urlText}
          onChange={handleUrl}
          className={fieldClass}
        />
      </label>
      {urlError && <p className="text-xs text-red-600">{urlError}</p>}
    </div>
  );
}
