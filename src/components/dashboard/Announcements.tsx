// Announcements.jsx
import { Megaphone } from "lucide-react";

export default function Announcements() {
  return (
    <div
      className="
        bg-(--color-bg)
        text-(--color-text)
        border border-(--color-border)
        shadow-md rounded-xl p-4
      "
    >
      <h3
        className="
          font-bold text-lg border-b border-(--color-border)
          pb-2 mb-3 flex items-center gap-2
        "
      >
        <Megaphone size={18} color="var(--color-accent)" />
        Announcements
      </h3>

      <ul className="space-y-2 text-sm">
        <li
          className="
            bg-(--color-bg-alt)]
            border-l-4 border-(--color-accent)
            rounded p-2
          "
        >
          <strong>Oct 31:</strong> All hands meeting moved to 2:00 PM.
        </li>
        <li
          className="
            bg-(--color-bg-alt)
            border-l-4 border-(--color-primary)
            rounded p-2
          "
        >
          <strong>Nov 1:</strong> Submit Q3 goals review by EOD.
        </li>
        <li
          className="
            bg-(--color-bg-alt)
            border-l-4 border-(--color-secondary)
            rounded p-2
          "
        >
          <strong>Nov 28:</strong> Office closed for Thanksgiving.
        </li>
      </ul>
    </div>
  );
}
