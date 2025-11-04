// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import MobileNav from "../components/shared/MobileNav";
import ContentWrapper from "../components/shared/ContentWrapper";
import Header from "../components/shared/Header";
import PunchButton from "../components/PunchButton";
import { useGeofence } from "../hooks/useGeoFence";
import { useAttendanceActions } from "../hooks/useAttendanceActions";
import EmployeeHeader from "../components/EmployeeHeader";
import StatusSection from "../components/StatusSection";
import MessageBanner from "../components/MessageBanner";
import AttendanceMainContent from "../components/AttendanceMainContent";
import { getFromFirebase } from "../api/firebaseAPI";
import { auth } from "../firebase/config";
import Announcements from "../components/Announcements";
import Stopwatch from "../components/StopWatch";
import WorkTimeDisplay from "../components/WorkTimeDisplay";
import { useDailyReset } from "../hooks/useDailyReset";
import { useLocationPermission } from "../hooks/useLocationPermission";

export default function Home() {
  const [employeeName, setEmployeeName] = useState<string | null>(null);
  const [workTimeDuration, setWorkTimeDuration] = useState<string | null>(null);
  const [punches, setPunches] = useState([]);
  const [message, setMessage] = useState<string | null>(null);
  const [checkInStartTime, setCheckInStartTime] = useState<Date | null>(null);

  const { isLoading, isInside } = useGeofence(setMessage);
  const { handleCheckIn, handleCheckOut } = useAttendanceActions(setPunches);
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;
  const [isDayCompleted, setIsDayCompleted] = useState(false);
  const { locationAllowed, retryLocationCheck } = useLocationPermission();

  // useDailyReset(() => setIsDayCompleted(false));

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!uid) return;
      try {
        const details = await getFromFirebase(`${uid}/userDetails`);
        const employeeRecord = details ? Object.values(details)[0] : null;
        if (employeeRecord?.userName) setEmployeeName(employeeRecord.userName);
        else if (employeeRecord?.displayName)
          setEmployeeName(employeeRecord.displayName);
        else if (employeeRecord?.email)
          setEmployeeName(employeeRecord.email.split("@")[0]);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
    fetchEmployeeDetails();
  }, [uid]);

  const isCheckedIn = useMemo(
    () => punches.length > 0 && punches[punches.length - 1].type === "Check-in",
    [punches]
  );

  const nextActionType = isCheckedIn ? "Check-out" : "Check-in";
  const status = isCheckedIn ? "Checked In" : "Not Checked In";
  const statusColor = isCheckedIn
    ? "var(--color-secondary)"
    : "var(--color-accent)";

  // const convertTo24Hr = (timeStr) => {
  //   if (!timeStr) return "00:00:00";
  //   const [time, modifier] = timeStr.split(" ");
  //   let [hours, minutes, seconds] = time.split(":").map(Number);
  //   if (modifier === "PM" && hours !== 12) hours += 12;
  //   if (modifier === "AM" && hours === 12) hours = 0;
  //   return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
  //     2,
  //     "0"
  //   )}:${String(seconds).padStart(2, "0")}`;
  // };

  // useEffect(() => {
  //   const restoreTimer = async () => {
  //     if (!uid) return;
  //     const todayKey = new Date().toLocaleDateString("en-CA");
  //     const record = await getFromFirebase(`${uid}/attendance/${todayKey}`);
  //     if (!record) return;
  //     const entry = Object.values(record)[0] || record;
  //     if (entry.checkIn && !entry.checkOut) {
  //       const inTime = new Date(`1970-01-01T${convertTo24Hr(entry.checkIn)}Z`);
  //       setCheckInStartTime(inTime);
  //     }
  //   };
  //   restoreTimer();
  // }, [uid]);

  const recordPunch = async (todayStatus, setIsLoading, fetchTodayStatus) => {
    if (!locationAllowed) {
      showErrorToast("Turn on location...");
      retryLocationCheck();
      return;
    }
    if (!isInside) {
      showErrorToast("Outside Office Area");
      return;
    }

    setIsLoading(true);

    try {
      if (todayStatus === "Check-in") {
        await handleCheckIn();
      } else if (todayStatus === "Check-out") {
        await handleCheckOut();
      }
      fetchTodayStatus?.();
    } catch (err) {
      console.error("Punch failed:", err);
      showErrorToast("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      showSuccessToast("Logged out successfully.");
      navigate("/");
    } catch {
      showErrorToast("Logout failed. Please try again.");
    }
  };

  return (
    <ContentWrapper>
      <Header handleLogout={handleLogout} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mt-6 mb-24">
        <motion.div
          className="flex flex-col justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <EmployeeHeader employeeName={employeeName} />

          <div className="flex justify-between items-center max-h-fit">
            {isDayCompleted ? (
              <WorkTimeDisplay workDuration={workTimeDuration} />
            ) : (
              <StatusSection
                status={status}
                statusColor={statusColor}
                isInside={isInside}
              />
            )}
            <PunchButton
              recordPunch={recordPunch}
              onDayComplete={setIsDayCompleted}
              workDuration={setWorkTimeDuration}
            />
          </div>

          {message && !isDayCompleted && <MessageBanner message={message} />}
        </motion.div>

        <AttendanceMainContent punches={punches} />
        <Announcements />
      </div>
    </ContentWrapper>
  );
}
