//@ts-nocheck
import { Clock, MapPin } from "lucide-react";

export default function StatusSection({ status, statusColor, isInside }) {
  return (
    <div className="flex items-center gap-3">
      <Clock size={20} style={{ color: "var(--color-primary)" }} />
      <div>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          Status
        </p>
        <p className="text-base font-semibold" style={{ color: statusColor }}>
          {status}
        </p>
      </div>
    </div>
  );
}
