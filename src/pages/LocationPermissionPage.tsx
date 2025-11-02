// LocationPermissionPage.tsx
import React from "react";
import logo from "/assets/logo.png";

interface LocationPermissionPageProps {
  checkLocation: () => void;
  isChecking: boolean;
  statusMessage: string;
}

const LocationPermissionPage: React.FC<LocationPermissionPageProps> = ({
  checkLocation,
  isChecking,
  statusMessage,
}) => {
  return (
    <main
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
    </main>
  );
};

export default LocationPermissionPage;
