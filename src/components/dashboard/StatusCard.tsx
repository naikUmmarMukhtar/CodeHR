// @ts-nocheck
import { Clock, ClockPlus, BadgeCheck } from "lucide-react";

export default function StatusCard({ isCheckedIn }) {
  const status = isCheckedIn ? "Checked In" : "Checked Out";
  const Icon = isCheckedIn ? BadgeCheck : ClockPlus;
  const statusColor = isCheckedIn
    ? "var(--color-secondary)"
    : "var(--color-accent)";

  return (
    <section className="w-full" style={{ backgroundColor: "var(--color-bg)" }}>
      <header className="flex items-center gap-2 text-sm mb-3">
        <Clock size={18} style={{ color: "var(--color-text-muted)" }} />
        <span style={{ color: "var(--color-text-muted)" }}>Status</span>
      </header>

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold" style={{ color: statusColor }}>
          {status}
        </span>
      </div>
    </section>
  );
}
