// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import { OFFICE_COORDS, OFFICE_RADIUS_METERS } from "../lib/constants";
import { haversineDistance } from "../utils/distance";
import { showErrorToast } from "../utils/toastMessage";

export function useGeofence(setMessage) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const watchIdRef = useRef(null);

  const verifyLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        showErrorToast("Geolocation not supported.");
        setMessage("Geolocation not supported.");
        reject("Geolocation not supported.");
        return;
      }

      setIsLoading(true);
      setMessage(" Fetching current location...");

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLoading(false);
          const { latitude, longitude, accuracy } = pos.coords;
          const distance = haversineDistance(
            latitude,
            longitude,
            OFFICE_COORDS.lat,
            OFFICE_COORDS.lng
          );

          const effectiveRadius = OFFICE_RADIUS_METERS + accuracy;

          console.log(
            `User: (${latitude}, ${longitude}) | Distance: ${Math.round(
              distance
            )}m | Accuracy: ±${Math.round(accuracy)}m`
          );

          if (distance > effectiveRadius) {
            showErrorToast(" Too far from office to punch.");
            setMessage(`Outside office: ${Math.round(distance)}m away.`);
            setIsInside(false);
            reject("Outside office area");
          } else {
            setMessage(`Within office (${Math.round(distance)}m away).`);
            setIsInside(true);
            resolve(true);
          }
        },
        (err) => {
          setIsLoading(false);
          const msg = "Location error: " + err.message;
          setMessage(msg);
          showErrorToast("Location access denied or timeout.");
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    });
  }, [setMessage]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setMessage(" Geolocation not supported by this browser.");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const distance = haversineDistance(
          latitude,
          longitude,
          OFFICE_COORDS.lat,
          OFFICE_COORDS.lng
        );
        const effectiveRadius = OFFICE_RADIUS_METERS + accuracy;
        const inside = distance <= effectiveRadius;

        setIsInside(inside);
        setMessage(
          inside
            ? ` Inside office (${Math.round(distance)}m away)`
            : ` Outside office (${Math.round(distance)}m away)`
        );
      },
      (err) => {
        setMessage("Watch error: " + err.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );

    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [setMessage]);

  return { verifyLocation, isLoading, isInside };
}
