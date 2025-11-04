import { useEffect, useState } from "react";

export const useLocationPermission = () => {
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      setLocationAllowed(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => setLocationAllowed(true),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationAllowed(false);
        } else {
          console.error("Geolocation error:", error);
          setLocationAllowed(false);
        }
      }
    );
  };

  useEffect(() => {
    // Check permission first
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted") {
            setLocationAllowed(true);
          } else if (result.state === "denied") {
            setLocationAllowed(false);
          } else {
            // state === "prompt"
            setLocationAllowed(null);
            requestLocation();
          }

          // Watch for permission changes dynamically
          result.onchange = () => {
            if (result.state === "granted") setLocationAllowed(true);
            else if (result.state === "denied") setLocationAllowed(false);
            else setLocationAllowed(null);
          };
        })
        .catch(() => {
          // Fallback for browsers that don't support navigator.permissions
          requestLocation();
        });
    } else {
      // Fallback if permissions API not supported (e.g., older iOS)
      requestLocation();
    }
  }, []);

  return { locationAllowed, retryLocationCheck: requestLocation };
};
