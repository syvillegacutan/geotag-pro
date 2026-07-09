import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker icon paths (they break under bundlers like Vite).
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { MAP_DEFAULTS } from "../constants/config";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Calls onPick whenever the user clicks the map.
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Pans (and gently zooms in) to keep the current pin in view when the location
// changes from any source. Never fights the user's own zoom level.
function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (!position) return;
    const targetZoom = Math.max(map.getZoom(), 13);
    map.setView([position.lat, position.lng], targetZoom);
  }, [position, map]);
  return null;
}

export default function MapPicker({ location, onPick }) {
  return (
    <div className="h-72 w-full overflow-hidden rounded-lg border border-slate-200">
      <MapContainer
        center={MAP_DEFAULTS.center}
        zoom={MAP_DEFAULTS.zoom}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={onPick} />
        <Recenter position={location} />
        {location && <Marker position={[location.lat, location.lng]} />}
      </MapContainer>
    </div>
  );
}
