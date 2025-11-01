//@ts-nocheck
import { useMemo, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { motion } from "framer-motion";

import { useNavigate } from "react-router";
import { CalendarDays, Clock, User, Wallet } from "lucide-react";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import MobileNav from "../components/dashboard/MobileNav";
import ContentWrapper from "../components/shared/ContentWrapper";
import Header from "../components/shared/Header";
import PunchButton from "../components/dashboard/PunchButton";
import { useGeofence } from "../hooks/useGeoFence";
import { useAttendanceActions } from "../hooks/useAttendanceActions";
import EmployeeHeader from "../components/dashboard/EmployeeHeader";
import StatusSection from "../components/dashboard/StatusSection";
import MessageBanner from "../components/dashboard/MessageBanner";
import AttendanceMainContent from "../components/dashboard/AttendanceMainContent";

export default function Home() {
  const [activeTab, setActiveTab] = useState("attendance");

  const [punches, setPunches] = useState([]);
  const [message, setMessage] = useState<string | null>(null);
  const { isLoading, isInside } = useGeofence(setMessage);
  const { handleCheckIn, handleCheckOut } = useAttendanceActions(setPunches);

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

  const isCheckedIn = useMemo(
    () => punches.length > 0 && punches[punches.length - 1].type === "Check-in",
    [punches]
  );

  const recordPunch = async () => {
    if (!isInside) {
      showErrorToast(
        "You must be inside the office area to perform this action."
      );
      return;
    }

    try {
      if (nextActionType === "Check-in") await handleCheckIn();
      else await handleCheckOut();
    } catch {
      setMessage("Punch failed. Please try again.");
    }
  };

  const nextActionType = isCheckedIn ? "Check-out" : "Check-in";
  const status = isCheckedIn ? "Checked In" : "Not Checked In";
  const statusColor = isCheckedIn
    ? "var(--color-secondary)"
    : "var(--color-accent)";

  const navItems = [
    { id: "attendance", name: "Attendance", icon: <Clock size={18} /> },
    { id: "profile", name: "Profile", icon: <User size={18} /> },
    { id: "leave", name: "Leave", icon: <CalendarDays size={18} /> },
    { id: "salary", name: "Salary", icon: <Wallet size={18} /> },
  ];

  return (
    <ContentWrapper>
      <Header handleLogout={handleLogout} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mt-6">
        <motion.div
          className=" flex flex-col justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between">
            <div>
              <EmployeeHeader />
            </div>{" "}
            <div>
              <PunchButton
                nextActionType={nextActionType}
                isLoading={isLoading}
                recordPunch={recordPunch}
                isInside={isInside}
              />
            </div>
          </div>
          <StatusSection
            status={status}
            statusColor={statusColor}
            isInside={isInside}
          />

          {message && <MessageBanner message={message} />}
        </motion.div>

        <AttendanceMainContent punches={punches} />
      </div>

      <MobileNav
        items={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </ContentWrapper>
  );
}
