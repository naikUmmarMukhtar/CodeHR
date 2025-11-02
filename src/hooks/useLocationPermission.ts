// src/hooks/useLocationPermission.ts
import { useEffect, useState } from "react";

export const useLocationPermission = () => {
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLocationPermission = async () => {
      if (!("geolocation" in navigator)) {
        setLocationAllowed(false);
        return;
      }

      try {
        if (
          "permissions" in navigator &&
          (navigator.permissions as any).query
        ) {
          const permission = await navigator.permissions.query({
            name: "geolocation" as PermissionName,
          });

          setLocationAllowed(permission.state === "granted");

          permission.onchange = () => {
            setLocationAllowed(permission.state === "granted");
          };
        } else {
          navigator.geolocation.getCurrentPosition(
            () => setLocationAllowed(true),
            () => setLocationAllowed(false)
          );
        }
      } catch (error) {
        console.error("Error checking location permission:", error);
        setLocationAllowed(false);
      }
    };

    const saved = localStorage.getItem("locationAllowed");
    if (saved !== null) setLocationAllowed(saved === "true");

    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (locationAllowed !== null) {
      localStorage.setItem("locationAllowed", String(locationAllowed));
    }
  }, [locationAllowed]);

  return { locationAllowed, setLocationAllowed };
};
