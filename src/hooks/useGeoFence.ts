// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { OFFICE_COORDS, OFFICE_RADIUS_METERS } from "../lib/constants";
import { haversineDistance } from "../utils/distance";
import { showErrorToast } from "../utils/toastMessage";

export function useGeofence(setMessage) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const watchIdRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  useEffect(() => {
    const startWatching = () => {
      if (!navigator.geolocation) {
        setMessage("Geolocation not supported by this browser.");
        return;
      }

      setIsLoading(true);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const safeAccuracy = isNaN(accuracy) ? 0 : Math.min(accuracy, 100);

          const distance = haversineDistance(
            latitude,
            longitude,
            OFFICE_COORDS.lat,
            OFFICE_COORDS.lng
          );

          const effectiveRadius = OFFICE_RADIUS_METERS + safeAccuracy + 10;
          const inside = distance <= effectiveRadius;

          setIsInside(inside);
          setMessage(
            inside
              ? `✅ Inside office (${Math.round(distance)}m away)`
              : `🚷 Outside office (${Math.round(distance)}m away)`
          );
          setIsLoading(false);
        },
        (err) => {
          setIsLoading(false);
          if (err.code === 1) {
            // Permission denied
            showErrorToast("⚠️ Please enable location access to continue.");
            setMessage("Waiting for location permission...");
            // Retry after 3 seconds
            retryTimeoutRef.current = setTimeout(startWatching, 3000);
          } else {
            showErrorToast("Location error: " + err.message);
            setMessage("Error getting location.");
          }
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
      );
    };

    startWatching();

    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [setMessage]);

  return { isLoading, isInside };
}
