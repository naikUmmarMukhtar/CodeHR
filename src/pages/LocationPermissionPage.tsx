// @ts-nocheck
import logo from "/assets/logo.png";
import { useState } from "react";

const LocationPermissionPage = ({ setLocationAllowed }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const requestSystemLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationAllowed(true);
        localStorage.setItem("locationAllowed", "true");
        setIsRequesting(false);
        setStatusMessage("");
      },
      (error) => {
        setLocationAllowed(false);
        localStorage.setItem("locationAllowed", "false");
        setIsRequesting(false);

        if (error.code === error.PERMISSION_DENIED) {
          setStatusMessage(
            "Location access denied. Please enable it and retry."
          );
        } else {
          setStatusMessage("Unable to get location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const requestPermission = async () => {
    if (!("geolocation" in navigator)) {
      setStatusMessage("Geolocation is not supported by your browser.");
      return;
    }

    setIsRequesting(true);
    setStatusMessage("Requesting location access...");

    try {
      if ("permissions" in navigator && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permissionStatus.state === "denied") {
          setIsRequesting(false);
          setLocationAllowed(false);
          localStorage.setItem("locationAllowed", "false");
          setStatusMessage(
            "Location access blocked. Enable it in settings and retry."
          );
          return;
        }
      }

      requestSystemLocation();
    } catch (err) {
      console.error("Permission query failed:", err);
      setIsRequesting(false);
      setStatusMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-center p-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Logo + Title */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={logo}
          alt="CodeHR Logo"
          className="w-full h-20 mb-3 object-contain"
        />
        <h1
          className="text-3xl font-extrabold tracking-tight"
          style={{ color: "var(--color-secondary)" }}
        >
          CodeHR
        </h1>
      </div>

      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: "var(--color-text)" }}
      >
        Location Access Required
      </h2>

      <p
        className="text-base mb-6 max-w-md"
        style={{ color: "var(--color-text-muted)" }}
      >
        We need your location to mark attendance accurately. Please allow access
        below.
      </p>

      <button
        onClick={requestPermission}
        disabled={isRequesting}
        className="px-6 py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-60"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-bg)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-primary)")
        }
      >
        {isRequesting ? "Requesting..." : "Allow Location"}
      </button>

      {statusMessage && (
        <p className="text-sm mt-4 text-red-500 max-w-sm">{statusMessage}</p>
      )}
    </div>
  );
};

export default LocationPermissionPage;
