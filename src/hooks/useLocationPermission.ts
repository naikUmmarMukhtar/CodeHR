import { useEffect, useState } from "react";

export const useLocationPermission = () => {
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "granted") {
          setLocationAllowed(true);
        } else if (result.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            () => setLocationAllowed(true),
            () => setLocationAllowed(false)
          );
        } else {
          setLocationAllowed(false);
        }
      })
      .catch(() => {
        // Fallback if Permissions API is not supported
        navigator.geolocation.getCurrentPosition(
          () => setLocationAllowed(true),
          () => setLocationAllowed(false)
        );
      });
  }, []);

  return { locationAllowed };
};
