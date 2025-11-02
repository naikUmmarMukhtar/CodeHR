// @ts-nocheck
import logo from "/assets/logo.png";
import { useEffect, useState } from "react";

const LocationPermissionPage = ({ setLocationAllowed }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const checkLocation = () => {
    if (!("geolocation" in navigator)) {
      setStatusMessage("Geolocation is not supported by your browser.");
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    setStatusMessage("Checking location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationEnabled(true);
        setLocationAllowed(true);
        localStorage.setItem("locationAllowed", "true");
        setIsChecking(false);
        setStatusMessage("");
      },
      () => {
        setLocationEnabled(false);
        setLocationAllowed(false);
        localStorage.setItem("locationAllowed", "false");
        setIsChecking(false);
        setStatusMessage("Please turn on your location to continue.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  useEffect(() => {
    checkLocation();
  }, []);

  if (locationEnabled) return null; // parent App will redirect to home

  return (
    <div
      className="flex flex-col items-center justify-center h-screen  px-6 text-justify"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <img
        src={logo}
        alt="CodeHR Logo"
        className="w-28 h-28 mb-6 object-contain"
      />

      <h1
        className="text-3xl font-bold mb-2 tracking-tight"
        style={{ color: "var(--color-secondary)" }}
      >
        Welcome to CodeHR
      </h1>

      <p
        className="text-base mb-4 max-w-md"
        style={{ color: "var(--color-text)" }}
      >
        To continue, please enable your device’s{" "}
        <strong>location access</strong>. This helps us verify your work
        location securely.
      </p>

      <ul
        className="text-sm mb-6 text-left list-disc pl-6 max-w-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        <li>Click “Allow” when prompted by your browser.</li>
        <li>Ensure GPS or location services are turned on.</li>
        <li>If blocked, check site permissions in your browser settings.</li>
      </ul>

      {statusMessage && (
        <p
          className="text-sm mb-6 italic"
          style={{ color: "var(--color-text-muted)" }}
        >
          {statusMessage}
        </p>
      )}

      <button
        onClick={checkLocation}
        disabled={isChecking}
        className="px-6 py-2 rounded-lg font-semibold text-sm shadow-md transition disabled:opacity-60 hover:opacity-90"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-bg)",
        }}
      >
        {isChecking ? "Checking..." : "Enable Location"}
      </button>

      <p className="mt-6 text-xs" style={{ color: "var(--color-text-muted)" }}>
        We respect your privacy — location data is never shared.
      </p>
    </div>
  );
};

export default LocationPermissionPage;
