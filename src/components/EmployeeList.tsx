// @ts-nocheck
import { Calendar } from "lucide-react";

export default function EmployeeList({
  filteredMembers,
  getStatusColor,
  summarize,
}) {
  if (filteredMembers.length === 0)
    return (
      <p className="text-center text-(--color-text-muted)">
        No employee records available.
      </p>
    );

  return (
    <section className="space-y-8">
      {filteredMembers.map((member, idx) => {
        const name =
          member.userDetails.username ||
          member.userDetails.displayName ||
          "Unknown";
        const totals = summarize(member.attendance);

        return (
          <div key={idx} className="border-b border-(--color-border) pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h2 className="text-lg font-medium text-(--color-primary)">
                  {name}
                </h2>
                <p className="text-xs text-(--color-text-muted)">
                  {member.userDetails.email}
                </p>
              </div>

              <div className="mt-2 sm:mt-0 flex gap-3 text-sm">
                <span className="text-(--color-primary)">
                  Present: {totals.present}
                </span>
                <span className="text-(--color-leave)">
                  Leave: {totals.leave}
                </span>
                <span className="text-(--color-absent)">
                  Absent: {totals.absent}
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {member.attendance.length === 0 ? (
                <p className="text-xs text-(--color-text-muted)">
                  No attendance records.
                </p>
              ) : (
                member.attendance.map((att, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row justify-between text-sm border border-(--color-border) rounded-md px-3 py-2 bg-(--color-bg-alt)"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{att.date}</div>
                        <div className="text-(--color-text-muted)">
                          {att.reason || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="text-right mt-2 sm:mt-0">
                      <div
                        className={`font-semibold ${getStatusColor(
                          att.status
                        )}`}
                      >
                        {att.status}
                      </div>
                      <div className="text-(--color-text-muted)">
                        In: {att.checkIn || "--"} • Out: {att.checkOut || "--"}
                      </div>
                      <div className="text-(--color-text-muted)">
                        Duration: {att.workDuration || "00:00:00"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
