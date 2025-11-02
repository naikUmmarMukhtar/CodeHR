// @ts-nocheck
import { CheckCircle, XCircle } from "lucide-react";

export default function MessageBanner({ message }) {
  if (!message) return null;

  const isWithin = message.toLowerCase().includes("within");
  const isOutside = message.toLowerCase().includes("outside");

  const color = isWithin
    ? "var(--color-secondary)" // green
    : isOutside
    ? "var(--color-primary)"
    : ""; // red

  const Icon = isWithin ? CheckCircle : isOutside ? XCircle : null;

  return (
    <div
      className=" flex items-center justify-center gap-2 px-4 py-2 rounded-md mt-4"
      style={{
        color: color,
        whiteSpace: "nowrap",
      }}
    >
      {Icon && <Icon size={18} />}
      <p className="text-xs font-medium text-center">{message}</p>
    </div>
  );
}
