// @ts-nocheck
import { useEffect, useState } from "react";
import {
  ClockPlus,
  BadgeCheck,
  Loader2,
  CheckCircle2,
  Clock4,
} from "lucide-react";
import { getFromFirebase } from "../api/firebaseAPI";
import { auth } from "../firebase/config";

export default function PunchButton({
  recordPunch,
  onDayComplete,
  workDuration,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [todayStatus, setTodayStatus] = useState("Check-in"); // "Check-in" | "Check-out" | "Completed"
  const [lastCheckedDate, setLastCheckedDate] = useState(null);
  const uid = auth.currentUser?.uid;

  const fetchTodayStatus = async () => {
    if (!uid) return;
    const todayKey = new Date().toLocaleDateString("en-CA");
    try {
      const record = await getFromFirebase(`${uid}/attendance/${todayKey}`);
      setLastCheckedDate(todayKey);

      if (!record) {
        setTodayStatus("Check-in");
        return;
      }

      const entry = Object.values(record)[0] || record;

      if (entry.checkIn && !entry.checkOut) {
        setTodayStatus("Check-out");
      } else if (record.checkIn && record.checkOut) {
        setTodayStatus("Completed");
        onDayComplete?.(true);
        workDuration(record.workDuration || "No Data ");
      } else {
        setTodayStatus("Check-in");
      }
    } catch (error) {
      console.error("Error checking attendance:", error);
    }
  };

  useEffect(() => {
    fetchTodayStatus();
  }, [uid]);

  useEffect(() => {
    const checkResetTime = () => {
      const now = new Date();
      const currentDate = now.toLocaleDateString("en-CA");

      if (currentDate !== lastCheckedDate && now.getHours() >= 9) {
        setTodayStatus("Check-in");
        workDuration(null);
        setLastCheckedDate(currentDate);
      }
    };
  }, [lastCheckedDate]);

  const isCheckIn = todayStatus === "Check-in";
  const isCompleted = todayStatus === "Completed";

  const ButtonIcon = isCheckIn ? ClockPlus : BadgeCheck;

  const buttonLabel = isLoading
    ? "Processing..."
    : isCheckIn
    ? "Check In"
    : "Check Out";
  if (isCompleted) return;
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
      className="px-2 py-1 text-sm rounded-md font-medium flex items-center gap-1 transition-all duration-200 hover:opacity-90"
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <ButtonIcon size={16} />
      )}
      <span className="mt-0.5">{buttonLabel}</span>{" "}
    </button>
  );
}
