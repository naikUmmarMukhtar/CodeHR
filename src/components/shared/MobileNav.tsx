// @ts-nocheck
import React from "react";
import { NavLink } from "react-router-dom";
import { CalendarDays, Clock, History, User } from "lucide-react";

export default function MobileNav() {
  const navItems = [
    { id: "", name: "Attendance", icon: <Clock size={18} /> },
    { id: "profile", name: "Profile", icon: <User size={18} /> },
    { id: "leave", name: "Leave", icon: <CalendarDays size={18} /> },
    { id: "history", name: "History", icon: <History size={18} /> },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-(--color-bg) border-t border-(--color-border) text-(--color-text) shadow-[0_-2px_6px_rgba(0,0,0,0.05) z-20"
      aria-label="Mobile Navigation"
    >
      <ul className="flex justify-around px-1 py-2">
        {navItems.map((item) => (
          <li key={item.id} className="flex-1">
            <NavLink
              to={`/${item.id}`}
              end
              className={({ isActive }) =>
                `w-full flex flex-col items-center gap-1 py-2 transition-transform duration-100 ${
                  isActive
                    ? "text-(--color-primary) font-semibold"
                    : "text-(--color-text-muted) font-normal"
                }`
              }
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div className="text-lg">{item.icon}</div>
              <span className="text-xs">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
