export default function EmployeeHeader() {
  return (
    <div>
      <h2
        className="text-xl font-semibold mb-1"
        style={{ color: "var(--color-text)" }}
      >
        Hello,{" "}
        <span style={{ color: "var(--color-primary)" }}>Employee 👋</span>
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
