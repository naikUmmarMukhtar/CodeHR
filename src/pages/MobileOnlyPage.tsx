import { Smartphone, AlertCircle } from "lucide-react";
import logo from "/assets/logo.png";

export default function MobileOnlyPage() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen px-6 text-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Logo */}
      <img
        src={logo}
        alt="CodeHR Logo"
        className="w-full h-24 mb-4 object-contain"
      />

      {/* Icon + Title */}
      <div className="flex  mb-4">
        <h1
          className="text-2xl font-bold mt-3"
          style={{ color: "var(--color-secondary)" }}
        >
          CodeHR is Mobile Only
        </h1>
        <Smartphone
          size={48}
          strokeWidth={1.5}
          style={{ color: "var(--color-primary)" }}
        />
      </div>

      {/* Description */}
      <p
        className="text-base max-w-xs text-justify leading-relaxed"
        style={{ color: "var(--color-text)" }}
      >
        Please open this app on your <strong>mobile device</strong> to continue.
        Desktop access is disabled to ensure accurate location tracking and a
        smoother user experience.
      </p>

      {/* Info note */}
      <div
        className="flex items-center gap-2 mt-4 text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        <AlertCircle size={16} />
        <span>Desktop browsers are not supported.</span>
      </div>

      {/* Footer */}
      <footer
        className="absolute bottom-6 text-xs"
        style={{ color: "var(--color-text-muted)" }}
      >
        © {new Date().getFullYear()} CodeStrix
      </footer>
    </div>
  );
}
