import { useEffect, useState } from "react";

export const useLocationPermission = () => {
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);

  const checkLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => setLocationAllowed(true),
      () => setLocationAllowed(false)
    );
  };

  useEffect(() => {
    checkLocation(); // ✅ Triggers system popup on load
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      navigator.permissions?.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          checkLocation(); // ✅ Recheck with system API
        } else {
          setLocationAllowed(false);
        }
      });
    }, 500); // ⏱️ Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { locationAllowed, retryLocationCheck: checkLocation };
};
