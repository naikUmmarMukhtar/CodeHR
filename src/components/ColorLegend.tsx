import { Link } from "react-router";

// @ts-nocheck
export default function ColorLegend() {
  const legendItems = [
    { label: "Present", color: "var(--color-secondary)" },
    { label: "Absent", color: "var(--color-absent)" },
    { label: "Leave", color: "var(--color-leave)" },
    { label: "Holiday", color: "var(--color-holiday)" },
    {
      label: "Weekend",
      color: "var(--color-bg-alt)",
      border: "1px solid var(--color-border)",
    },
  ];

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-3 p-3"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
        }}
      >
        {legendItems.map((item, i) => (
          <div key={i} className="flex items-center gap-1 text-xs">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: item.color,
                border: item.border || "none",
              }}
            ></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-3">
        <Link
          to="/holiday-list"
          className="text-sm font-medium underline transition-all duration-200"
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
