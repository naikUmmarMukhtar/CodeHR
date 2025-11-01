// MobileNav.jsx
// @ts-nocheck
import React from "react";

export default function MobileNav({ items, activeTab, setActiveTab }) {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-(--color-bg) border-t border-(--color-border) text-(--color-text) shadow-[0_-2px_6px_rgba(0,0,0,0.05)] z-20"
      aria-label="Mobile Navigation"
    >
      <ul className="flex justify-around px-1 py-2">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex flex-col items-center gap-1 py-2 transition-transform duration-100 ${
                  isActive
                    ? "text-(--color-primary) font-semibold"
                    : "text-(--color-text-muted) font-normal"
                }`}
                aria-current={isActive ? "page" : undefined}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.95)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="text-lg">{item.icon}</div>
                <span className="text-xs">{item.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
