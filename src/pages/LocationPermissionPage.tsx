// @ts-nocheck
import logo from "/assets/logo.png";
import { useLocationPermission } from "../hooks/useLocationPermission";

const LocationPermissionPage = () => {
  const { locationAllowed, retryLocationCheck } = useLocationPermission();

  if (locationAllowed) return null;

  return (
    <div
      className="flex flex-col justify-center h-screen text-center px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Center content */}
      <div className="flex flex-col items-center justify-center">
        <img
          src={logo}
          alt="CodeHR Logo"
          className="w-full h-16 mb-4 object-contain"
        />

        <h1
          className="text-3xl font-bold tracking-tight mb-2"
          style={{ color: "var(--color-secondary)" }}
        >
          CodeHR
        </h1>

        <h2
          className="text-xl font-medium mb-4"
          style={{ color: "var(--color-text)" }}
        >
          Enable Location Access
        </h2>

        <p
          className="text-sm max-w-xs leading-relaxed mb-6 text-justify"
          style={{ color: "var(--color-text-muted)" }}
        >
          Please allow your device’s location to continue. This helps verify
          your work location securely.
        </p>

        {/* ✅ Retry Button */}
        <button
          onClick={retryLocationCheck}
          className="bg-(--color-primary) text-(--color-bg) px-4 py-2 rounded-md text-sm font-medium "
        >
          Enable Location
        </button>
      </div>

      {/* Bottom privacy note */}

      {locationAllowed === false && (
        <p className="text-xs mt-10 text-(--color-primary)">
          Location access is blocked. Enable it from your browser settings.
        </p>
      )}
    </div>
  );
};

export default LocationPermissionPage;
