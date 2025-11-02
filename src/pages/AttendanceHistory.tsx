// @ts-nocheck
import { useEffect, useState } from "react";
import { getFromFirebase } from "../api/firebaseAPI";
import { auth } from "../firebase/config";
import { motion } from "framer-motion";
import {
  AlarmClockMinus,
  AlarmClockMinusIcon,
  BadgeCheck,
  CalendarDays,
  ClockPlus,
  DoorOpen,
  Timer,
  UserCheck,
} from "lucide-react";

export default function AttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!uid) return;
      setIsLoading(true);

      try {
        const data = await getFromFirebase(`${uid}/attendance`);
        console.log("Fetched history data:", data);

        if (data) {
          const formatted = Object.entries(data).map(([date, record]) => {
            // Detect whether it's nested with a Firebase push key
            const actualRecord =
              record &&
              typeof record === "object" &&
              Object.keys(record)[0]?.startsWith("-")
                ? Object.values(record)[0]
                : record;

            return { date, ...actualRecord };
          });

          // Sort latest first
          formatted.sort((a, b) => new Date(b.date) - new Date(a.date));
          setRecords(formatted);
        } else {
          setRecords([]);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [uid]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-sm text-(--color-text-muted)">
        Loading attendance history...
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-sm">
        <UserCheck size={28} style={{ color: "var(--color-secondary)" }} />
        <p className="mt-2 text-(--color-text-muted)">
          No attendance records found.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 px-4 pb-24">
      <h2
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ color: "var(--color-text)" }}
      >
        <CalendarDays size={20} style={{ color: "var(--color-secondary)" }} />
        Attendance History
      </h2>

      <div className="flex flex-col gap-3">
        {records.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className="rounded-lg p-4 shadow-sm"
            style={{
              backgroundColor: "var(--color-bg-alt)",
              color: "var(--color-text)",
            }}
          >
            {/* Date + Status */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{item.date}</span>
              <span
                className="text-xs font-medium px-2 py-1 rounded"
                style={{
                  backgroundColor:
                    item.status === "Present"
                      ? "var(--color-secondary)"
                      : "var(--color-primary)",
                  color: "var(--color-bg)",
                }}
              >
                {item.status || "N/A"}
              </span>
            </div>

            {/* Time Info */}
            <div className="flex justify-between text-sm mt-2">
              <div className="flex items-center gap-1">
                <ClockPlus
                  size={16}
                  style={{ color: "var(--color-secondary)" }}
                />
                <span>{item.checkIn || "--"}</span>
              </div>

              <div className="flex items-center gap-1">
                <AlarmClockMinusIcon
                  size={16}
                  style={{ color: "var(--color-accent)" }}
                />
                <span>{item.checkOut || "--"}</span>
              </div>

              <div className="flex items-center gap-1">
                <Timer size={16} style={{ color: "var(--color-secondary)" }} />
                <span>{item.workDuration || "00:00:00"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
