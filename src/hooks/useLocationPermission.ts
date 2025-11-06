import { useEffect, useState, useCallback } from "react";

export const useLocationPermission = () => {
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState(0);

  const checkDeviceLocationServices =
    useCallback(async (): Promise<boolean> => {
      // If last check was less than 1 second ago, don't check again
      const now = Date.now();
      if (now - lastCheckTime < 1000) {
        return locationAllowed ?? false;
      }
      setLastCheckTime(now);

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setLocationAllowed(true);
            resolve(true);
          },
          (error) => {
            console.error("Location check failed:", error);
            setLocationAllowed(false);
            resolve(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      });
    }, [locationAllowed, lastCheckTime]);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      setLocationAllowed(false);
      return;
    }

    await checkDeviceLocationServices();
  }, [checkDeviceLocationServices]);

  useEffect(() => {
    let isSubscribed = true;

    const checkPermission = async () => {
      if (!isSubscribed) return;

      try {
        // Request the permission first
        const result = await checkDeviceLocationServices();
        if (!isSubscribed) return;

        if (result) {
          // If we got here, location is working
          setLocationAllowed(true);
        }
      } catch (err) {
        if (!isSubscribed) return;
        console.warn("Permission check failed:", err);
        setLocationAllowed(false);
      }
    };

    // Initial check
    checkPermission();

    // Set up interval for periodic checks
    const intervalId = setInterval(checkPermission, 2000);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [checkDeviceLocationServices]);

  return {
    locationAllowed,
    retryLocationCheck: requestLocation,
  };
};
