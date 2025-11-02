// PunchLog.jsx
//@ts-nocheck
import { Clock } from "lucide-react";

export default function PunchLog({ punches, message }) {
  return (
    <div
      className="
        bg-(--color-bg)
        text-(--color-text)
        border border-(--color-border)
        shadow-md rounded-xl p-4
      "
    >
      {message && (
        <p
          className="
            text-xs p-2 rounded-lg border border-(--color-border)
            text-center mb-3
          "
          dangerouslySetInnerHTML={{
            __html: message.includes("successful")
              ? `<span style="color: var(--color-secondary); font-weight: 500;">${message}</span>`
              : `<span style="color: var(--color-accent); font-weight: 500;">${message}</span>`,
          }}
        />
      )}

      <h3
        className="
          font-bold text-base border-b border-(--color-border)
          pb-2 mb-3 flex items-center gap-2
        "
      >
        <Clock size={16} color="var(--color-accent)" /> Today's Log
      </h3>

      {punches.length === 0 ? (
        <p className="text-sm text-(--color-text-muted) italic">No records.</p>
      ) : (
        <ul className="text-sm space-y-2">
          {punches.map((p, i) => (
            <li key={i} className="flex justify-between">
              <span
                className={`font-semibold ${
                  p.type === "Check-in"
                    ? "text-(--color-secondary)"
                    : "text-(--color-accent)"
                }`}
              >
                {p.type}
              </span>
              <span className="font-mono text-(--color-text-muted)">
                {p.time}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
