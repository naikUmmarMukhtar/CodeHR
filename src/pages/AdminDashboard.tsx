// @ts-nocheck
import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import { useEmployeesData } from "../hooks/useEmployeeData";
import Loader from "../components/shared/Loader";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import { getAuth, signOut } from "firebase/auth";
import {
  LogOut,
  Filter,
  User,
  Calendar,
  RefreshCw,
  Mail,
  List,
  Info,
} from "lucide-react";

export default function AdminDashboard() {
  const { admin, loading: adminLoading, error: adminError } = useAdminData();
  console.log(admin, "admindata...");

  const {
    teamMembers,
    loading: teamLoading,
    error: teamError,
  } = useEmployeesData();

  const [selectedUser, setSelectedUser] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (adminLoading || teamLoading) return <Loader />;
  if (adminError)
    return <p className="text-[var(--color-absent)]">{adminError}</p>;
  if (teamError)
    return <p className="text-[var(--color-absent)]">{teamError}</p>;
  if (!admin) return <p>No admin data found.</p>;

  const allNames = [
    "All",
    ...teamMembers.map(
      (m) => m.userDetails.username || m.userDetails.displayName || "Unknown"
    ),
  ];

  const handleResetFilters = () => {
    setSelectedUser("All");
    setStartDate("");
    setEndDate("");
  };

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      showSuccessToast("Logged out successfully.");
    } catch {
      showErrorToast("Logout failed. Please try again.");
    }
  };

  const filteredMembers = teamMembers
    .filter(
      (m) =>
        selectedUser === "All" ||
        (m.userDetails.username || m.userDetails.displayName || "Unknown") ===
          selectedUser
    )
    .map((member) => {
      const filteredAttendance = member.attendance.filter((att) => {
        const attDate = new Date(att.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start && attDate < start) return false;
        if (end && attDate > end) return false;
        return true;
      });
      return { ...member, attendance: filteredAttendance };
    });

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case "leave":
        return "text-[var(--color-leave)] border-[var(--color-leave)]/20 bg-[var(--color-leave-bg)]";
      case "absent":
        return "text-[var(--color-absent)] border-[var(--color-absent)]/20 bg-[var(--color-absent-bg)]";
      default:
        return "text-[var(--color-primary)] border-[var(--color-primary)]/20 bg-[var(--color-bg)]";
    }
  };

  const summarize = (attendance = []) => {
    const totals = {
      total: attendance.length,
      leave: 0,
      absent: 0,
      present: 0,
    };
    attendance.forEach((a) => {
      const s = String(a.status || "").toLowerCase();
      if (s === "leave") totals.leave += 1;
      else if (s === "absent") totals.absent += 1;
      else totals.present += 1;
    });
    return totals;
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-4 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-[var(--color-primary)]">
            <List className="w-5 h-5 text-[var(--color-primary)]" />
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] flex flex-wrap items-center gap-2">
            <User className="w-4 h-4" /> {admin.username} •{" "}
            <Mail className="w-4 h-4" /> {admin.email} •{" "}
            <Calendar className="w-4 h-4" />{" "}
            {new Date(admin.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium border rounded-md border-[var(--color-border)] hover:bg-[var(--color-bg-alt)] transition-colors w-full sm:w-auto justify-center"
        >
          <LogOut className="w-4 h-4 text-[var(--color-primary)]" />
          Logout
        </button>
      </header>

      {filteredMembers.length === 0 ? (
        <div className=" text-center ">
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            Currently, there are no employee records in the system.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap sm:flex-nowrap gap-3 mb-6 items-center overflow-x-auto">
            <div className="flex items-center gap-2 min-w-[160px]">
              <Filter className="w-4 h-4 text-[var(--color-primary)]" />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="p-2 border rounded-md border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm w-full"
              >
                {allNames.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded-md border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm w-full sm:w-auto"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded-md border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm w-full sm:w-auto"
            />

            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 p-2 px-4 border rounded-md font-medium border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-bg-alt)] transition-colors w-full sm:w-auto justify-center text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Attendance List grouped by user */}
          <div className="space-y-4">
            {filteredMembers.map((member, idx) => {
              const name =
                member.userDetails.username ||
                member.userDetails.displayName ||
                "Unknown";
              const totals = summarize(member.attendance);

              return (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-lg shadow-sm border border-[var(--color-border)] bg-[var(--color-bg)]"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="text-base sm:text-lg font-semibold text-[var(--color-primary)]">
                        {name}
                      </p>
                      <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                        {member.userDetails.email}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        Created:{" "}
                        {member.userDetails.createdAt
                          ? new Date(
                              member.userDetails.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>

                    <div className="text-xs sm:text-sm text-right w-full sm:w-auto">
                      <div className="mb-1">
                        Total:{" "}
                        <span className="font-semibold">{totals.total}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <span className="px-2 py-1 rounded-md border text-[var(--color-primary)]">
                          Present: {totals.present}
                        </span>
                        <span className="px-2 py-1 rounded-md border text-[var(--color-leave)]">
                          Leave: {totals.leave}
                        </span>
                        <span className="px-2 py-1 rounded-md border text-[var(--color-absent)]">
                          Absent: {totals.absent}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {member.attendance.length === 0 ? (
                      <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                        No attendance records.
                      </p>
                    ) : (
                      member.attendance.map((att, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center p-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-alt)] text-xs sm:text-sm"
                        >
                          <div className="flex items-start sm:items-center gap-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <div>
                              <div className="font-medium">{att.date}</div>
                              <div className="text-[var(--color-text-muted)]">
                                {att.reason ? `Reason: ${att.reason}` : "—"}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div
                              className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(
                                att.status
                              )}`}
                            >
                              {att.status}
                            </div>
                            <div className="mt-1 text-[var(--color-text-muted)]">
                              In: {att.checkIn || "--"} • Out:{" "}
                              {att.checkOut || "--"}
                            </div>
                            <div className="text-[var(--color-text-muted)]">
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
          </div>
        </>
      )}
    </div>
  );
}
