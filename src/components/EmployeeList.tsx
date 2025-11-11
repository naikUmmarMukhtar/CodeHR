import { useNavigate } from "react-router-dom";

export default function EmployeeList({ filteredMembers, summarize }) {
  const navigate = useNavigate();
  console.log(filteredMembers, "filteredmemenber");

  return (
    <div className="space-y-4">
      {filteredMembers.map((member) => {
        const name =
          member.userDetails.username ||
          member.userDetails.displayName ||
          "Unknown";
        const totals = summarize(member.attendance);

        return (
          <div
            key={member.teamId}
            className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer hover:shadow-md transition"
            onClick={() =>
              navigate(`/employee-details`, {
                state: { employee: member }, // 👈 Pass full employee data here
              })
            }
          >
            <div>
              <h2 className="text-[var(--color-primary)] font-medium">
                {name}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                {member.userDetails.email}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-[var(--color-primary)]">
                P: {totals.present}
              </span>
              <span className="text-[var(--color-leave)]">
                L: {totals.leave}
              </span>
              <span className="text-[var(--color-absent)]">
                A: {totals.absent}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
