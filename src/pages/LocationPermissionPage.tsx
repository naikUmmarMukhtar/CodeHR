// @ts-nocheck
import logo from "/assets/logo.png";
import { useEffect, useState } from "react";

const LocationPermissionPage = ({ setLocationAllowed }) => {
  const [isChecking, setIsChecking] = useState(true);
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
      () => {
        setLocationAllowed(true); // 👈 App will automatically switch to Home
        localStorage.setItem("locationAllowed", "true");
        setIsChecking(false);
        setStatusMessage("");
      },
      () => {
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

    // ✅ Recheck automatically when user changes system settings
    if ("permissions" in navigator && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((perm) => {
        perm.onchange = () => {
          if (perm.state === "granted") {
            setLocationAllowed(true);
            localStorage.setItem("locationAllowed", "true");
          }
        };
      });
    }
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-center px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <img
        src={logo}
        alt="CodeHR Logo"
        className="w-28 h-28 mb-4 object-contain"
      />
      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--color-secondary)" }}
      >
        CodeHR
      </h1>

      <p className="text-base mb-4" style={{ color: "var(--color-text)" }}>
        Turn on your location to continue
      </p>

      {statusMessage && (
        <p
          className="text-sm mb-6"
          style={{ color: "var(--color-text-muted)" }}
        >
          {statusMessage}
        </p>
      )}

      <button
        onClick={checkLocation}
        disabled={isChecking}
        className="px-5 py-2 rounded-lg font-semibold text-sm shadow transition disabled:opacity-60"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-bg)",
        }}
      >
        {isChecking ? "Checking..." : "Retry"}
      </button>
    </div>
  );
};

export default LocationPermissionPage;
