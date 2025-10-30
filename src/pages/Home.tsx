import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import {
  CalendarDays,
  Clock,
  LogOut,
  MapPin,
  User,
  Wallet,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import AttendancePanel from "../components/dashboard/AttendancePanel";
import PlaceholderTab from "../components/dashboard/PlaceholderTab";
import MobileNav from "../components/dashboard/MobileNav";

export default function Home(): JSX.Element {
  const [activeTab, setActiveTab] = useState("attendance");
  const [punches, setPunches] = useState([]);
  const [message, setMessage] = useState<string | null>(null);

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

  const navItems = [
    { id: "attendance", name: "Attendance", icon: <Clock size={18} /> },
    { id: "profile", name: "Profile", icon: <User size={18} /> },
    { id: "leave", name: "Leave", icon: <CalendarDays size={18} /> },
    { id: "salary", name: "Salary", icon: <Wallet size={18} /> },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <header
        className="p-4 flex justify-between items-center border-b sticky top-0 z-10"
        style={{
          backgroundColor: "var(--color-bg)",
          borderColor: "var(--color-border)",
        }}
      >
        <h1
          className="text-xl font-extrabold flex items-center gap-2"
          style={{ color: "var(--color-primary)" }}
        >
          <MapPin className="text-[var(--color-accent)]" /> CodeHR
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm transition"
          style={{ color: "var(--color-accent)" }}
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      <main className="flex-1 p-6 pb-20 overflow-auto">
        <h2
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--color-text)" }}
        >
          Hello, Employee
        </h2>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--color-text-muted)" }}
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>

        {activeTab === "attendance" ? (
          <AttendancePanel
            punches={punches}
            setPunches={setPunches}
            message={message}
            setMessage={setMessage}
          />
        ) : (
          <PlaceholderTab tab={activeTab} />
        )}
      </main>

      <MobileNav
        items={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
