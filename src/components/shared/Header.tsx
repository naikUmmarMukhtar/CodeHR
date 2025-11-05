// Header.jsx
//@ts-nocheck
import { Power } from "lucide-react";

export default function Header({ handleLogout }) {
  return (
    <header className="sticky top-0 z-10 bg-(--color-bg) flex items-center justify-between py-3">
      <div className="relative flex items-center">
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="h-14 w-auto object-contain"
        />
        <span className="absolute bottom-1.5 left-24 ml-[-4px flex items-end  font-semibold text-(--color-secondary) leading-none text-xl ">
          <span className="text-(--color-primary) mr-1">-</span>
          HRM
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-(--color-primary) hover:text-(--color-hover) font-medium text-sm transition-colors duration-200"
      >
        <Power size={18} />
        Logout
      </button>
    </header>
  );
}
