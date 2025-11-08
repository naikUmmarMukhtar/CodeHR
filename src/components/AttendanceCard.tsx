//@ts-nocheck
export default function AttendanceCard({ record, onLeaveClick }) {
  const getCardStyle = () => {
    switch (record.status.toLowerCase()) {
      case "present":
        return {
          borderLeft: `6px solid var(--color-primary)`,
          backgroundColor: "var(--color-bg)",
        };
      case "absent":
        return {
          borderLeft: `6px solid var(--color-absent)`,
          backgroundColor: "var(--color-absent-bg)",
        };
      case "leave":
        return {
          borderLeft: `6px solid var(--color-leave)`,
          backgroundColor: "var(--color-leave-bg)",
        };
      default:
        return {};
    }
  };

  return (
    <div
      className="rounded-2xl shadow p-4 transition-transform hover:scale-[1.02]"
      style={getCardStyle()}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">{record.name}</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            {new Date(record.date).toDateString()}
          </p>
        </div>
        <span
          className="text-sm font-medium px-3 py-1 rounded-full"
          style={{
            backgroundColor:
              record.status.toLowerCase() === "present"
                ? "var(--color-secondary)"
                : record.status.toLowerCase() === "leave"
                ? "var(--color-leave)"
                : "var(--color-absent)",
            color: "#fff",
          }}
        >
          {record.status}
        </span>
      </div>

      <div className="mt-3 text-sm space-y-1">
        <p>
          <strong>Check-In:</strong> {record.checkIn}
        </p>
        <p>
          <strong>Check-Out:</strong> {record.checkOut}
        </p>
        <p>
          <strong>Duration:</strong> {record.workDuration}
        </p>
      </div>

      {record.status.toLowerCase() === "leave" && record.reason && (
        <button
          className="mt-3 w-full text-center font-medium rounded-lg p-2"
          style={{
            backgroundColor: "var(--color-leave)",
            color: "#fff",
          }}
          onClick={onLeaveClick}
        >
          View Leave Note
        </button>
      )}
    </div>
  );
}
