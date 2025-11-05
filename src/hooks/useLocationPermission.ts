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
    let intervalId: number;

    const checkPermission = async () => {
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({
            name: "geolocation",
          });

          if (result.state === "granted") setLocationAllowed(true);
          else if (result.state === "denied") setLocationAllowed(false);
          else setLocationAllowed(null);
        } catch (err) {
          console.warn("Permission check failed:", err);
          requestLocation();
        }
      } else {
        requestLocation();
      }
    };

    checkPermission();

    intervalId = window.setInterval(() => {
      checkPermission();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { locationAllowed, retryLocationCheck: requestLocation };
};
