// MobileNav.jsx
// @ts-nocheck
import React from "react";

export default function MobileNav({ items, activeTab, setActiveTab }) {
  return (
    <nav
      style={{
        backgroundColor: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)",
        color: "var(--color-text)",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        padding: "0.5rem 0.25rem",
        boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.05)",
        zIndex: 20,
      }}
      className="lg:hidden"
    >
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
              flex: 1,
              color: isActive
                ? "var(--color-primary)"
                : "var(--color-text-muted)",
              fontWeight: isActive ? "600" : "400",
              fontSize: "0.75rem",
              cursor: "pointer",
              padding: "0.5rem 0",
              transition: "color 0.2s ease, transform 0.1s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div>{item.icon}</div>
            <span>{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
