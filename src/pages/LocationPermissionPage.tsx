// @ts-nocheck
import logo from "/assets/logo.png";
import { useState } from "react";

const LocationPermissionPage = ({ setLocationAllowed }) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const requestPermission = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsRequesting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationAllowed(true);
        try {
          localStorage.setItem("locationAllowed", "true");
        } catch {}
        setIsRequesting(false);
      },
      (error) => {
        // Failure or denied
        setIsRequesting(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert(
            "Location access denied. Please enable it in your browser settings and try again."
          );
        } else {
          alert("Unable to get location. Please try again.");
        }
        setLocationAllowed(false);
        try {
          localStorage.setItem("locationAllowed", "false");
        } catch {}
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
        We need your location to mark attendance accurately. Tap below to allow
        location access.
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
        {isRequesting ? "Requesting" : "Allow Location"}
      </button>
    </div>
  );
};

export default LocationPermissionPage;
