// @ts-nocheck
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function MessageBanner({ message }) {
  if (!message) return null;

  const lower = message.toLowerCase();
  const isWithin = lower.includes("within");
  const isOutside = lower.includes("outside");
  const isError =
    lower.includes("error") ||
    lower.includes("watch") ||
    lower.includes("permission") ||
    lower.includes("denied");

  const color = isWithin
    ? "var(--color-secondary)"
    : isOutside
    ? "var(--color-absent)"
    : isError
    ? "var(--color-absent)"
    : "var(--color-text-muted)";

  const Icon = isWithin ? CheckCircle : isOutside ? XCircle : "";

  const displayMessage = isError ? "Turn on location to continue" : message;

  return (
    <div
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-md mt-4"
      style={{
        color,
        whiteSpace: "nowrap",
      }}
    >
      {Icon && <Icon size={18} />}
      <p className="text-xs font-medium text-center">{displayMessage}</p>
    </div>
  );
}
