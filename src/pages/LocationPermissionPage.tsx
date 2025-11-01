import logo from "/assets/logo.png"; // 🖼️ Update path if your logo is elsewhere

const LocationPermissionPage = () => {
  const requestPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => window.location.reload(),
        () => alert("Please enable location access in your browser settings.")
      );
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

      {/* Message */}
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
        We need your location to provide accurate attendance and shift data.
        Please allow location access and refresh the page.
      </p>

      {/* Button */}
      <button
        onClick={requestPermission}
        className="px-6 py-3 rounded-xl font-semibold shadow-md transition"
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
        Allow Location
      </button>
    </div>
  );
};

export default LocationPermissionPage;
