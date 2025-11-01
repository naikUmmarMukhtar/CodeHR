import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { CalendarDays, Clock, User, Wallet } from "lucide-react";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import AttendancePanel from "../components/dashboard/AttendancePanel";
import MobileNav from "../components/dashboard/MobileNav";
import ContentWrapper from "../components/shared/ContentWrapper";
import Header from "../components/shared/Header";

export default function Home() {
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
    <ContentWrapper>
      <Header handleLogout={handleLogout} />

      <main className="flex-1 py-6 pb-20 overflow-auto">
        <AttendancePanel
          punches={punches}
          setPunches={setPunches}
          message={message}
          setMessage={setMessage}
        />
      </main>

      <MobileNav
        items={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </ContentWrapper>
  );
}
