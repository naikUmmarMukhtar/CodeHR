// @ts-nocheck
import { useEffect, useState } from "react";
import {
  ClockPlus,
  BadgeCheck,
  Loader2,
  CheckCircle2,
  Clock4,
} from "lucide-react";
import { getFromFirebase } from "../../api/firebaseAPI";
import { auth } from "../../firebase/config";

export default function PunchButton({ recordPunch }) {
  const [isLoading, setIsLoading] = useState(false);
  const [todayStatus, setTodayStatus] = useState("Check-in"); // "Check-in" | "Check-out" | "Completed"
  const [workDuration, setWorkDuration] = useState(null);
  const [lastCheckedDate, setLastCheckedDate] = useState(null);
  const uid = auth.currentUser?.uid;

  // 🕐 Fetch today's attendance state from Firebase
  const fetchTodayStatus = async () => {
    if (!uid) return;
    const todayKey = new Date().toLocaleDateString("en-CA");
    try {
      const record = await getFromFirebase(`${uid}/attendance/${todayKey}`);
      setLastCheckedDate(todayKey);

      if (!record) {
        setTodayStatus("Check-in");
        setWorkDuration(null);
        return;
      }

      const entry = Object.values(record)[0] || record;
      console.log("Attendance Entry:", entry);

      if (entry.checkIn && !entry.checkOut) {
        setTodayStatus("Check-out");
        setWorkDuration(null);
      } else if (record.checkIn && record.checkOut) {
        setTodayStatus("Completed");
        setWorkDuration(record.workDuration || "00:00:00");
      } else {
        setTodayStatus("Check-in");
        setWorkDuration(null);
      }
    } catch (error) {
      console.error("Error checking attendance:", error);
    }
  };

  // 🔁 Auto-fetch on mount
  useEffect(() => {
    fetchTodayStatus();
  }, [uid]);

  useEffect(() => {
    const checkResetTime = () => {
      const now = new Date();
      const currentDate = now.toLocaleDateString("en-CA");

      if (currentDate !== lastCheckedDate && now.getHours() >= 9) {
        setTodayStatus("Check-in");
        setWorkDuration(null);
        setLastCheckedDate(currentDate);
      }
    };

    const interval = setInterval(checkResetTime, 60 * 1000); // every minute
    return () => clearInterval(interval);
  }, [lastCheckedDate]);

  // 🧭 Determine button state
  const isCheckIn = todayStatus === "Check-in";
  const isCompleted = todayStatus === "Completed";

  const ButtonIcon = isCompleted
    ? CheckCircle2
    : isCheckIn
    ? ClockPlus
    : BadgeCheck;

  const buttonLabel = isLoading
    ? "Processing..."
    : isCompleted
    ? "Completed"
    : isCheckIn
    ? "Check In"
    : "Check Out";

  if (isCompleted) {
    return (
      <div
        className="flex items-center gap-2 text-sm"
        style={{
          color: "var(--color-text)",
        }}
        title="Work duration for today"
      >
        <span className="flex gap-2 text-xs font-bold">
          <Clock4 size={14} style={{ color: "var(--color-secondary)" }} />
          Work Time:{" "}
          <span style={{ color: "var(--color-secondary)" }}>
            {workDuration}
          </span>
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => recordPunch(todayStatus, setIsLoading, fetchTodayStatus)}
      disabled={isLoading}
      style={{
        backgroundColor: isCheckIn
          ? "var(--color-secondary)"
          : "var(--color-primary)",
        color: "var(--color-bg)",
        opacity: isLoading ? 0.6 : 1,
        cursor: isLoading ? "not-allowed" : "pointer",
      }}
      className="px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-all duration-200 hover:opacity-90"
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <ButtonIcon size={18} />
      )}
      {buttonLabel}
    </button>
  );
}
