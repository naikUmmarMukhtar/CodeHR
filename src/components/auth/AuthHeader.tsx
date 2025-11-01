// src/components/auth/AuthHeader.tsx
export default function AuthHeader({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="text-center space-y-1">
      {/* Logo */}
      <img
        src="/assets/logo.png"
        alt="CodeStrix Logo"
        className="h-12 mx-auto object-contain"
      />

      {/* App Name */}
      <h1
        className="text-xl font-semibold tracking-tight"
        style={{ color: "var(--color-secondary)" }}
      >
        CodeHR
      </h1>

      {/* Subtitle */}
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        {mode === "login"
          ? "Log in to manage your attendance"
          : "Create your CodeHR account"}
      </p>
    </div>
  );
}
