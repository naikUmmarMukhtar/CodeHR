import { useEffect, useState } from "react";

export const useLocationPermission = () => {
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => setLocationAllowed(true),
      () => setLocationAllowed(false)
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { locationAllowed, retryLocationCheck: requestLocation };
};
