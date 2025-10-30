// import React from "react";
import { Clock } from "lucide-react";

export default function StatusCard({ isCheckedIn }: { isCheckedIn: boolean }) {
  const statusColor = isCheckedIn
    ? "var(--color-secondary)" // green-ish tone
    : "var(--color-accent)"; // orange/red tone

  const bgColor = "var(--color-bg-alt)";
  const borderColor = statusColor;

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: "8px",
        padding: "1rem",
      }}
    >
      <h3
        className="text-lg font-bold mb-1 flex items-center gap-2"
        style={{ color: "var(--color-text)" }}
      >
        <Clock size={18} color={statusColor} /> Status
      </h3>
      <p className="text-xl font-extrabold" style={{ color: statusColor }}>
        {isCheckedIn ? "🟢 CHECKED IN" : "🔴 CHECKED OUT"}
      </p>
    </div>
  );
}
