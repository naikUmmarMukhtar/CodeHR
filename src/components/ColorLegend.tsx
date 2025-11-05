// @ts-nocheck
export default function ColorLegend() {
  const legendItems = [
    { label: "Present", color: "var(--color-secondary)" },
    { label: "Absent", color: "var(--color-absent)" },
    { label: "Leave", color: "var(--color-leave)" },
    {
      label: "Weekend",
      color: "var(--color-bg-alt)",
      border: "1px solid var(--color-border)",
    },
  ];

  return (
    <div
      className="flex flex-wrap items-center gap-3 p-3"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        border: "1px solid var(--color-border)",
      }}
    >
      {legendItems.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div
            className="w-4 h-4 rounded-sm"
            style={{
              backgroundColor: item.color,
              border: item.border || "none",
            }}
          ></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
