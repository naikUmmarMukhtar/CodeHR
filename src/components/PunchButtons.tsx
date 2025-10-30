import React, { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { haversineDistance } from "../utils/distance";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";

const OFFICE_COORDS = { lat: 32.738558, lng: 74.710296 };
const OFFICE_RADIUS_METERS = 500;

export default function PunchButtons() {
  const [message, setMessage] = useState<string | null>(null);

  function recordPunch(type: "Check-in" | "Check-out") {
    if (!navigator.geolocation)
      return setMessage("Geolocation not supported on this device.");
    setMessage("Fetching location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = haversineDistance(
          latitude,
          longitude,
          OFFICE_COORDS.lat,
          OFFICE_COORDS.lng
        );

        if (dist <= OFFICE_RADIUS_METERS) {
          showSuccessToast(`${type} successful!`);
          setMessage(`${type} successful`);
        } else {
          showErrorToast(`Outside office (${Math.round(dist)}m away)`);
          setMessage(`Outside office (${Math.round(dist)}m away)`);
        }
      },
      (err) => setMessage("Location error: " + err.message),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <button
        onClick={() => recordPunch("Check-in")}
        className="flex items-center justify-center gap-2 bg-[#00A699] text-white py-4 rounded-xl font-semibold shadow-md hover:bg-[#00b8a5] transition flex-1"
      >
        <Clock /> Check In
      </button>
      <button
        onClick={() => recordPunch("Check-out")}
        className="flex items-center justify-center gap-2 bg-[#007A87] text-white py-4 rounded-xl font-semibold shadow-md hover:bg-[#0099aa] transition flex-1"
      >
        <CheckCircle /> Check Out
      </button>
      {message && (
        <p className="text-sm text-center text-gray-600 mt-2">{message}</p>
      )}
    </div>
  );
}
