// @ts-nocheck
import { useEffect, useState } from "react";
import { getFromFirebase, putToFirebase } from "../api/firebaseAPI";
import { auth } from "../firebase/config";
import { motion } from "framer-motion";
import {
  CalendarDays,
  UserX,
  PlaneTakeoff,
  AlarmClockMinus,
  Timer,
  ClockPlus,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchLeaves = async () => {
      if (!uid) return;
      setIsLoading(true);

      try {
        const data = await getFromFirebase(`${uid}/attendance`);
        if (data) {
          const formatted = Object.entries(data)
            .map(([date, record]) => {
              const actualRecord =
                record &&
                typeof record === "object" &&
                Object.keys(record)[0]?.startsWith("-")
                  ? Object.values(record)[0]
                  : record;
              return { date, ...actualRecord };
            })
            .filter((r) => r.status === "Leave");

          formatted.sort((a, b) => new Date(b.date) - new Date(a.date));
          setLeaves(formatted);
        } else {
          setLeaves([]);
        }
      } catch (error) {
        console.error("Error fetching leave history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaves();
  }, [uid]);

  const applyForLeave = async () => {
    if (!uid) return;
    if (!reason.trim()) {
      showErrorToast("Enter Leave Message...");
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date().toLocaleDateString("en-CA");
      const leaveData = {
        status: "Leave",
        reason: reason.trim(),
        checkIn: "--",
        checkOut: "--",
        workDuration: "00:00:00",
      };

      await putToFirebase(`${uid}/attendance/${today}`, leaveData);
      showSuccessToast("Leave applied successfully!");

      setLeaves((prev) => [{ date: today, ...leaveData }, ...prev]);
      setReason("");
    } catch (error) {
      console.error("Error applying leave:", error);
      showErrorToast("Failed to apply leave. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-sm text-(--color-text-muted)">
        Loading leave history...
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 px-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xl font-semibold flex items-center gap-2"
          style={{ color: "var(--color-text)" }}
        >
          <CalendarDays size={20} style={{ color: "var(--color-secondary)" }} />
          Leave History
        </h2>
      </div>

      <div
        className="p-4 rounded-lg mb-6 shadow-sm"
        style={{
          backgroundColor: "var(--color-leave-bg)",
          color: "var(--color-text)",
        }}
      >
        <label
          htmlFor="leaveReason"
          className="block mb-2 text-sm font-medium"
          style={{ color: "var(--color-text)" }}
        >
          Reason for Leave
        </label>
        <textarea
          id="leaveReason"
          rows={3}
          placeholder="Enter your leave reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 rounded-md text-sm border focus:outline-none"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
          }}
        ></textarea>

        <button
          onClick={applyForLeave}
          disabled={isSubmitting}
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium"
          style={{
            backgroundColor: "var(--color-leave)",
            color: "var(--color-bg)",
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          <PlaneTakeoff size={16} />
          {isSubmitting ? "Applying..." : "Apply Leave"}
        </button>
      </div>

      {leaves.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 text-sm">
          <UserX size={28} style={{ color: "var(--color-secondary)" }} />
          <p className="mt-2 text-(--color-text-muted)">
            No leave records found.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {leaves.map((item, index) => (
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
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{item.date}</span>
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{
                    backgroundColor: "var(--color-leave)",
                    color: "var(--color-bg)",
                  }}
                >
                  {item.status || "Leave"}
                </span>
              </div>

              <div className="text-sm mb-2 italic opacity-80">
                {item.reason || "No reason provided."}
              </div>

              <div className="flex justify-between text-sm mt-2">
                <div className="flex items-center gap-1">
                  <ClockPlus
                    size={16}
                    style={{ color: "var(--color-secondary)" }}
                  />
                  <span>{item.checkIn || "--"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <AlarmClockMinus
                    size={16}
                    style={{ color: "var(--color-accent)" }}
                  />
                  <span>{item.checkOut || "--"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Timer
                    size={16}
                    style={{ color: "var(--color-secondary)" }}
                  />
                  <span>{item.workDuration || "00:00:00"}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
