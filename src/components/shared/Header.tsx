// Header.jsx
import { LogOut } from "lucide-react";

export default function Header({ handleLogout }) {
  return (
    <header
      className="py-4"
      style={{
        backgroundColor: "var(--color-bg)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h1
        style={{
          color: "var(--color-primary)",
          fontSize: "1.25rem",
          fontWeight: "800",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {/* <MapPin size={20} color="var(--color-secondary)" /> */}
        CodeHR
      </h1>

      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          background: "none",
          border: "none",
          color: "var(--color-primary)",
          fontSize: "0.9rem",
          fontWeight: "500",
          cursor: "pointer",
          transition: "color 0.2s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.color = "var(--color-hover)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.color = "var(--color-primary)")
        }
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
}
