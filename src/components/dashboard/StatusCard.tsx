//@ts-nocheck
// StatusCard.jsx

import { Clock, LogIn, LogOut } from "lucide-react";

export default function StatusCard({ isCheckedIn }) {
  const statusColor = isCheckedIn
    ? "var(--color-secondary)" // checked in
    : "var(--color-accent)"; // checked out

  return (
    <div
      className="
        bg-(--color-bg-alt)
        border-2 rounded-xl p-4
        text-(--color-text)
      "
      style={{ borderColor: statusColor }}
    >
      <div className="flex items-center gap-2 mb-2 font-semibold">
        <Clock size={18} color={statusColor} />
        <span>Status</span>
      </div>

      <div
        className="flex items-center gap-2 text-lg font-bold"
        style={{ color: statusColor }}
      >
        {isCheckedIn ? (
          <>
            <LogIn size={18} /> Checked In
          </>
        ) : (
          <>
            <LogOut size={18} /> Checked Out
          </>
        )}
      </div>
    </div>
  );
}
