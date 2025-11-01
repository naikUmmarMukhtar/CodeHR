// @ts-nocheck
import { Megaphone } from "lucide-react";

export default function Announcements() {
  const announcements = [
    {
      date: "Oct 31",
      text: "All hands meeting moved to 2:00 PM.",
      color: "var(--color-accent)",
    },
    {
      date: "Nov 1",
      text: "Submit Q3 goals review by EOD.",
      color: "var(--color-primary)",
    },
    {
      date: "Nov 28",
      text: "Office closed for Thanksgiving.",
      color: "var(--color-secondary)",
    },
  ];

  return (
    <section
      className="bg-(--color-bg) text-(--color-text)"
      aria-labelledby="announcements-title"
    >
      <h3
        id="announcements-title"
        className="font-bold text-lg pb-2 mb-3 flex items-center gap-2"
      >
        <Megaphone size={18} color="var(--color-accent)" />
        Announcements
      </h3>

      <ul className="space-y-2 text-sm">
        {announcements.map((item, index) => (
          <li
            key={index}
            className="border-l-4 rounded p-2"
            style={{ borderColor: item.color }}
          >
            <strong>{item.date}:</strong> {item.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
