//@ts-nocheck
import { Clock, MapPin } from "lucide-react";

export default function StatusSection({ status, statusColor, isInside }) {
  return (
    <div className="flex items-center justify-between rounded-xl mb-4">
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
      <div
        className="flex items-center gap-2 text-sm font-medium"
        style={{ color: "var(--color-text-muted)" }}
      >
        <MapPin size={16} />
        {isInside ? (
          <span style={{ color: "var(--color-secondary)" }}>Inside Office</span>
        ) : (
          <span style={{ color: "var(--color-accent)" }}>Outside Zone</span>
        )}
      </div>
    </div>
  );
}
