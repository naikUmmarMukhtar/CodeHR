// @ts-nocheck
import { Clock4 } from "lucide-react";

export default function WorkTimeDisplay({
  workDuration,
}: {
  workDuration: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center w-full mt-6"
      style={{
        color: "var(--color-text)",
      }}
      title="Work duration for today"
    >
      <div className="flex items-center gap-3 mb-2">
        <Clock4
          size={24}
          aria-hidden="true"
          style={{ color: "var(--color-secondary)" }}
        />
        <span
          className="text-base font-semibold tracking-wide"
          style={{ color: "var(--color-text-muted)" }}
        >
          Work Time
        </span>
      </div>

      <div
        className="px-6 py-3 rounded-lg font-mono text-2xl font-bold shadow-sm"
        style={{
          backgroundColor: "var(--color-bg-alt)",
          color: "var(--color-secondary)",
          width: "80%",
          maxWidth: "400px",
          textAlign: "center",
          letterSpacing: "0.1em",
        }}
      >
        {workDuration || "00:00:00"}
      </div>
    </div>
  );
}
