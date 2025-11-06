import { Link } from "react-router";

// @ts-nocheck
export default function ColorLegend() {
  const legendItems = [
    { label: "P", meaning: "Present", color: "var(--color-secondary)" },
    { label: "A", meaning: "Absent", color: "var(--color-absent)" },
    { label: "L", meaning: "Leave", color: "var(--color-leave)" },
    { label: "H", meaning: "Holiday", color: "var(--color-holiday)" },
    {
      label: "W",
      meaning: "Weekend",
      color: "var(--color-bg-alt)",
      border: "1px solid var(--color-border)",
    },
  ];

  return (
    <div className="text-center">
      <div
        className="grid grid-cols-5 gap-4 p-4 rounded-lg shadow-sm"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
        }}
      >
        {legendItems.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-1 text-sm font-medium"
          >
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center text-(--color-bg) text-base font-semibold"
              style={{
                backgroundColor: item.color,
                border: item.border || "none",
              }}
            >
              {item.label}
            </div>
            <span className="text-xs opacity-80">{item.meaning}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Link
          to="/holiday-list"
          className="text-sm font-semibold underline hover:text-opacity-80 transition-all duration-200"
          style={{
            color: "var(--color-primary)",
          }}
        >
          View Holiday List
        </Link>
      </div>
    </div>
  );
}
