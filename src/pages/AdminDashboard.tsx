// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFromFirebase } from "../api/firebaseAPI";
import AttendanceTable from "../components/AttendaceTable";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/shared/Loader";
import { getAuth, signOut } from "firebase/auth";

export default function AdminDashboard() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("All");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      showSuccessToast("Logged out successfully.");
      navigate("/");
    } catch {
      showErrorToast("Logout failed. Please try again.");
    }
  };

  // ✅ Step 1: Check if logged-in user is admin
  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user) {
        navigate("/"); // not logged in
        return;
      }

      try {
        const adminData = await getFromFirebase(`/admins/${user.uid}`);
        if (adminData) {
          setIsAdmin(true);
        } else {
          navigate("/"); // not admin → go to user home/login
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        navigate("/");
      } finally {
        setCheckingAdmin(false);
      }
    };

    verifyAdmin();
  }, [user]);

  // ✅ Step 2: Fetch attendance data once admin confirmed
  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        const data = await getFromFirebase(""); // root level
        if (!data) return;

        const allRecords = [];
        const userSet = new Set();

        Object.entries(data).forEach(([uid, user]) => {
          const name =
            user.userDetails?.userName?.trim() ||
            user.userDetails?.displayName ||
            user.userDetails?.email?.split("@")[0] ||
            "Unknown";

          userSet.add(name);

          const attendance = user.attendance || {};
          Object.entries(attendance).forEach(([date, record]) => {
            allRecords.push({
              uid,
              name,
              date,
              checkIn: record.checkIn || "-",
              checkOut: record.checkOut || "-",
              workDuration: record.workDuration || "-",
              status: record.status || "Absent",
              reason: record.reason || "",
            });
          });
        });

        allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAttendanceData(allRecords);
        setUsers(["All", ...Array.from(userSet)]);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };

    fetchData();
  }, [isAdmin]);

  // ✅ Step 3: Handle loading states
  if (loading || checkingAdmin) return <Loader />;

  // ✅ Step 4: Filter data
  const filteredData =
    selectedUser === "All"
      ? attendanceData
      : attendanceData.filter((r) => r.name === selectedUser);

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: "var(--color-absent)" }}
        >
          Logout
        </button>
      </header>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          style={{
            backgroundColor: "var(--color-bg-alt)",
            color: "var(--color-text)",
          }}
        >
          {users.map((name, idx) => (
            <option key={idx} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <AttendanceTable data={filteredData} />
    </div>
  );
}
