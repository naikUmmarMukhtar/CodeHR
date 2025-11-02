// src/hooks/useLocationPermission.ts
//@ts-nocheck
import { useEffect, useState } from "react";

export const useLocationPermission = () => {
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

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

          // Listen for changes
          permission.onchange = () => {
            setLocationAllowed(permission.state === "granted");
          };

          // Poll every second until granted
          interval = setInterval(async () => {
            const updated = await navigator.permissions.query({
              name: "geolocation" as PermissionName,
            });
            if (updated.state === "granted") {
              setLocationAllowed(true);
              clearInterval(interval);
            }
          }, 1000);
        } else {
          // Fallback if Permissions API is not supported
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

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (locationAllowed !== null) {
      localStorage.setItem("locationAllowed", String(locationAllowed));
    }
  }, [locationAllowed]);

  return { locationAllowed, setLocationAllowed };
};
