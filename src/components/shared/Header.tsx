// Header.jsx
//@ts-nocheck
import { Power } from "lucide-react";

export default function Header({ handleLogout }) {
  return (
    <header className="sticky top-0 z-10 bg-(--color-bg) flex items-center justify-center py-4  border-b border-(--color-primary)/20">
      <div className="relative flex items-end gap-2 group">
        <h1 className="text-2xl font-extrabold text-(--color-primary) tracking-tight">
          CodeStrix
        </h1>
        <span className="text-xl font-semibold text-(--color-secondary)">
          <span className="text-(--color-primary) mr-1">–</span>HRM
        </span>
      </div>
    </header>
  );
}
