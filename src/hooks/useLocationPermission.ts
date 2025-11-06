import { useEffect, useState, useCallback } from "react";

export const useLocationPermission = () => {
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const checkDeviceLocationServices =
    useCallback(async (): Promise<boolean> => {
      const now = Date.now();
      if (now - lastCheckTime < 1000) {
        return locationAllowed ?? false;
      }
      setLastCheckTime(now);

      return new Promise((resolve) => {
        const successHandler = () => {
          setLocationAllowed(true);
          setRetryCount(0);
          resolve(true);
        };

        const errorHandler = (error: GeolocationPositionError) => {
          console.error("Location check failed:", error);

          // Special handling for Safari
          if (isSafari && retryCount < 3) {
            setRetryCount((prev) => prev + 1);
            // Try again after a short delay
            setTimeout(() => {
              navigator.geolocation.getCurrentPosition(
                successHandler,
                errorHandler,
                {
                  enableHighAccuracy: true,
                  timeout: 10000, // Longer timeout for Safari
                  maximumAge: 0,
                }
              );
            }, 1000);
            return;
          }

          setLocationAllowed(false);
          resolve(false);
        };

        navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
          enableHighAccuracy: true,
          timeout: isSafari ? 10000 : 5000, // Longer timeout for Safari
          maximumAge: 0,
        });
      });
    }, [locationAllowed, lastCheckTime, retryCount, isSafari]);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      setLocationAllowed(false);
      return;
    }

    // Reset retry count when manually requesting location
    setRetryCount(0);
    await checkDeviceLocationServices();
  }, [checkDeviceLocationServices]);

  useEffect(() => {
    let isSubscribed = true;

    const checkPermission = async () => {
      if (!isSubscribed) return;

      try {
        const result = await checkDeviceLocationServices();
        if (!isSubscribed) return;

        if (result) {
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

    // Longer interval for Safari to reduce permission prompts
    const intervalId = setInterval(checkPermission, isSafari ? 5000 : 2000);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [checkDeviceLocationServices, isSafari]);

  return {
    locationAllowed,
    retryLocationCheck: requestLocation,
  };
};
