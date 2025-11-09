// @ts-nocheck
import { useState } from "react";
import Loader from "../components/shared/Loader";
import { useAdminData } from "../hooks/useAdminData";
import { useEmployeesData } from "../hooks/useEmployeeData";
import AdminHeader from "../components/AdminHeader";
import EmployeeList from "../components/EmployeeList";
import DashboardFilters from "../components/DashboardFilters";
import { getAuth, signOut } from "firebase/auth";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";

export default function AdminDashboard() {
  const { admin, loading: adminLoading, error: adminError } = useAdminData();
  const {
    teamMembers,
    loading: teamLoading,
    error: teamError,
  } = useEmployeesData();

  const [selectedUser, setSelectedUser] = useState("All");
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);

  if (adminLoading || teamLoading) return <Loader />;
  if (adminError) return <p className="text-(--color-absent)">{adminError}</p>;
  if (teamError) return <p className="text-(--color-absent)">{teamError}</p>;
  if (!admin) return <p>No admin data found.</p>;

  const allNames = [
    "All",
    ...teamMembers.map(
      (m) => m.userDetails.username || m.userDetails.displayName || "Unknown"
    ),
  ];

  const handleResetFilters = () => {
    setSelectedUser("All");
    setDateRange([{ startDate: null, endDate: null, key: "selection" }]);
  };

  const startDate = dateRange[0].startDate;
  const endDate = dateRange[0].endDate;

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
        if (startDate && attDate < startDate) return false;
        if (endDate && attDate > endDate) return false;
        return true;
      });
      return { ...member, attendance: filteredAttendance };
    });

  const summarize = (attendance = []) => {
    const totals = {
      total: attendance.length,
      leave: 0,
      absent: 0,
      present: 0,
    };
    attendance.forEach((a) => {
      const s = String(a.status || "").toLowerCase();
      if (s === "leave") totals.leave++;
      else if (s === "absent") totals.absent++;
      else totals.present++;
    });
    return totals;
  };

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case "leave":
        return "text-(--color-leave)";
      case "absent":
        return "text-(--color-absent)";
      default:
        return "text-(--color-primary)";
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      showSuccessToast("Logged out successfully.");
    } catch {
      showErrorToast("Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text) px-4 py-4 sm:px-8 sm:py-6">
      <AdminHeader admin={admin} />
      <DashboardFilters
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        allNames={allNames}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onReset={handleResetFilters}
        onLogout={handleLogout}
      />
      <EmployeeList
        filteredMembers={filteredMembers}
        getStatusColor={getStatusColor}
        summarize={summarize}
      />
    </div>
  );
}
