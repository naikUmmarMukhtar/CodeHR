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
    checkLocation();
  }, []);
  useEffect(() => {
    const interval = setInterval(async () => {
      const updated = await navigator.permissions.query({
        name: "geolocation" as PermissionName,
      });
      if (updated.state === "granted") {
        checkLocation(); // ✅ Recheck with system API
      } else if (updated.state === "denied") {
        setLocationAllowed(false); // ❌ Explicitly handle blocked state
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { locationAllowed, retryLocationCheck: checkLocation };
};
