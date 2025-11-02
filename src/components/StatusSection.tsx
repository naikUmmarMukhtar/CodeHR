//@ts-nocheck
import { Clock, MapPin } from "lucide-react";

export default function StatusSection({ status, statusColor, isInside }) {
  return (
    <div className="">
      <div className="flex gap-1">
        <Clock size={16} style={{ color: "var(--color-primary)" }} />
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          Status
        </p>
      </div>
      <p className="text-xs font-semibold" style={{ color: statusColor }}>
        {status}
      </p>
    </div>
  );
}
