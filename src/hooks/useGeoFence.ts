import { haversineDistance } from "../utils/distance";

const OFFICE_COORDS = { lat: 37.7749, lng: -122.4194 };
const OFFICE_RADIUS_METERS = 200;

export async function checkGeofence(): Promise<
  | { inside: true; lat: number; lng: number; accuracy: number }
  | { inside: false; distance: number }
> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const distance = haversineDistance(
          latitude,
          longitude,
          OFFICE_COORDS.lat,
          OFFICE_COORDS.lng
        );
        if (distance <= OFFICE_RADIUS_METERS)
          resolve({ inside: true, lat: latitude, lng: longitude, accuracy });
        else resolve({ inside: false, distance });
      },
      (err) => reject(err.message),
      { enableHighAccuracy: true }
    );
  });
}
