import { useCallback, useState } from "react";

// Holds the chosen business location as { lat, lng } (or null if unset).
// Every input method — map click, manual entry, Google Maps URL — funnels
// through setLocation, keeping them all in sync.
export function useMapLocation() {
  const [location, setLocationState] = useState(null);

  const setLocation = useCallback((lat, lng) => {
    if (
      lat == null ||
      lng == null ||
      Number.isNaN(lat) ||
      Number.isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return false;
    }
    setLocationState({ lat, lng });
    return true;
  }, []);

  const clearLocation = useCallback(() => setLocationState(null), []);

  return { location, setLocation, clearLocation };
}
