// @ts-nocheck
export default function EmployeeHeader({ employeeName }) {
  return (
    <div className="overflow-hidden">
      <h2
        className="text-xl font-semibold mb-1 truncate"
        style={{ color: "var(--color-text)", maxWidth: "100%" }}
        title={employeeName} // shows full name on hover
      >
        <span
          style={{ color: "var(--color-black)" }}
          className="block truncate"
        >
          {employeeName}
        </span>
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </p>
    </div>
  );
}
