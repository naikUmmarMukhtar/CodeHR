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
      title="Today's Work Duration"
      className="flex flex-col items-center justify-center w-full mt-6 text-(--color-text)"
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock4 size={20} className="text-(--color-secondary)" />
        <span className="font-medium text-(--color-text-muted)">
          Today’s Work Time
        </span>
      </div>

      <div className="px-6 py-3 rounded-lg font-mono text-2xl font-bold shadow-sm bg-(--color-bg-alt) text-(--color-secondary) w-4/5 max-w-sm text-center tracking-widest">
        {workDuration || "00:00:00"}
      </div>
    </div>
  );
}
