import { useEffect, useState } from "react";

export const useLocationPermission = () => {
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);

  const checkDeviceLocationServices = async (): Promise<boolean> => {
    // Check if running on iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // For iOS devices, we can try to get high accuracy position
      // If location services are disabled, this will fail quickly
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 2000, // Short timeout to quickly detect if location services are off
            maximumAge: 0,
          });
        });
        return true;
      } catch (error: any) {
        // Check if the error is related to device settings being off
        if (
          error.code === 2 || // POSITION_UNAVAILABLE
          error.code === 1
        ) {
          // PERMISSION_DENIED
          return false;
        }
        console.error("Error checking device location services:", error);
        return false;
      }
    }

    return true; // For non-iOS devices, return true and let browser permission handle it
  };

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      setLocationAllowed(false);
      return;
    }

    // First check device location services
    const deviceLocationEnabled = await checkDeviceLocationServices();
    if (!deviceLocationEnabled) {
      setLocationAllowed(false);
      return;
    }

    // Then check browser permissions
    navigator.geolocation.getCurrentPosition(
      () => setLocationAllowed(true),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationAllowed(false);
        } else {
          console.error("Geolocation error:", error);
          setLocationAllowed(false);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    let intervalId: number;

    const checkPermission = async () => {
      if (navigator.permissions) {
        try {
          // First check device location services
          const deviceLocationEnabled = await checkDeviceLocationServices();
          if (!deviceLocationEnabled) {
            setLocationAllowed(false);
            return;
          }

          // Then check browser permissions
          const result = await navigator.permissions.query({
            name: "geolocation" as PermissionName,
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
