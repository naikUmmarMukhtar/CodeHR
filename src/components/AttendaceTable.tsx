// @ts-nocheck
export default function AttendanceTable({ data }) {
  return (
    <div
      className="overflow-x-auto rounded-2xl shadow-md"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
    >
      <table className="min-w-full border-collapse">
        <thead
          style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
        >
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Check-In</th>
            <th className="p-3 text-left">Check-Out</th>
            <th className="p-3 text-left">Duration</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Reason</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center py-8 text-[var(--color-text-muted)] font-medium"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr
                key={i}
                className="border-b hover:bg-[var(--color-bg)] transition-colors"
              >
                <td className="p-3 font-semibold text-[var(--color-text)]">
                  {item.name}
                </td>
                <td className="p-3">{item.date}</td>
                <td className="p-3">{item.checkIn}</td>
                <td className="p-3">{item.checkOut}</td>
                <td className="p-3">{item.workDuration}</td>
                <td
                  className={`p-3 font-semibold ${
                    item.status === "Present"
                      ? "text-green-600"
                      : item.status === "Leave"
                      ? "text-yellow-600"
                      : "text-[var(--color-absent)]"
                  }`}
                >
                  {item.status}
                </td>
                <td className="p-3 text-sm italic text-[var(--color-text-muted)]">
                  {item.reason || "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
