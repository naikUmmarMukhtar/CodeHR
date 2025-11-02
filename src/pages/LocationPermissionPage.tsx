// @ts-nocheck
import logo from "/assets/logo.png";
import { useLocationPermission } from "../hooks/useLocationPermission";

const LocationPermissionPage = () => {
  const { locationAllowed } = useLocationPermission();

  if (locationAllowed) return null;

  return (
    <div
      className="flex flex-col items-center justify-center h-screen px-6 text-justify overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <img
        src={logo}
        alt="CodeHR Logo"
        className="w-full h-28 mb-6 object-contain"
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

      <p
        className="text-sm mb-4 italic"
        style={{ color: "var(--color-text-muted)" }}
      >
        Please turn on your location to continue.
      </p>

      <p className="mt-6 text-xs" style={{ color: "var(--color-text-muted)" }}>
        We respect your privacy — location data is never shared.
      </p>
    </div>
  );
};

export default LocationPermissionPage;
