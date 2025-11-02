import { useEffect, useState } from "react";

export const useLocationPermission = () => {
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);

  const checkLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => setLocationAllowed(true),
      () => setLocationAllowed(false)
    );
  };
  const interval = setInterval(() => {
    navigator.permissions?.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        checkLocation();
      } else {
        setLocationAllowed(false);
      }
    });
  }, 1000);
  useEffect(() => {
    checkLocation();

    return () => clearInterval(interval);
  }, []);

  return { locationAllowed, checkLocation };
};
