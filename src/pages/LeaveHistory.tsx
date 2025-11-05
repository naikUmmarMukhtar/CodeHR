// @ts-nocheck
import { useEffect, useState } from "react";
import { getFromFirebase, putToFirebase } from "../api/firebaseAPI";
import { auth } from "../firebase/config";
import { motion } from "framer-motion";
import {
  CalendarDays,
  UserX,
  PlaneTakeoff,
  ClockPlus,
  AlarmClockMinus,
  Timer,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [leaveDate, setLeaveDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [isAdvance, setIsAdvance] = useState(false);

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
            .filter((r) => r.status === "Leave")
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          setLeaves(formatted);
        } else {
          setLeaves([]);
        }
      } catch (err) {
        console.error("Error fetching leaves:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaves();
  }, [uid]);

  const applyForLeave = async () => {
    if (!uid) return;

    if (!reason.trim()) {
      showErrorToast("Enter leave reason...");
      return;
    }

    const today = new Date().toLocaleDateString("en-CA");
    const selectedDate = leaveDate;

    // 🚫 Block past dates
    if (new Date(selectedDate) < new Date(today)) {
      showErrorToast("You cannot apply for past leave.");
      return;
    }

    // 🚫 Prevent duplicate leave
    if (leaves.some((l) => l.date === selectedDate)) {
      showErrorToast("Leave already applied for this date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const leaveData = {
        status: "Leave",
        reason: reason.trim(),
        checkIn: "--",
        checkOut: "--",
        workDuration: "00:00:00",
      };

      await putToFirebase(`${uid}/attendance/${selectedDate}`, leaveData);
      showSuccessToast("Leave applied successfully!");

      setLeaves((prev) => [{ date: selectedDate, ...leaveData }, ...prev]);
      setReason("");
      setIsAdvance(false);
      setLeaveDate(today);
    } catch (err) {
      console.error("Error applying leave:", err);
      showErrorToast("Failed to apply leave.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center h-64 text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
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

      {/* Leave Form */}
      <div
        className="p-4 rounded-lg mb-6 shadow-sm"
        style={{
          backgroundColor: "var(--color-leave-bg)",
          color: "var(--color-text)",
        }}
      >
        {/* Buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => {
              setIsAdvance(false);
              setLeaveDate(new Date().toLocaleDateString("en-CA"));
            }}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              !isAdvance ? "shadow-md" : ""
            }`}
            style={{
              backgroundColor: !isAdvance
                ? "var(--color-leave)"
                : "var(--color-bg-alt)",
              color: !isAdvance ? "var(--color-bg)" : "var(--color-text)",
            }}
          >
            Today Leave
          </button>

          <button
            onClick={() => setIsAdvance(true)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isAdvance ? "shadow-md" : ""
            }`}
            style={{
              backgroundColor: isAdvance
                ? "var(--color-leave)"
                : "var(--color-bg-alt)",
              color: isAdvance ? "var(--color-bg)" : "var(--color-text)",
            }}
          >
            Advance Leave
          </button>
        </div>

        {isAdvance && (
          <div className="mb-3">
            <label
              htmlFor="leaveDate"
              className="block mb-2 text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              Select Future Date
            </label>
            <input
              type="date"
              id="leaveDate"
              min={new Date().toLocaleDateString("en-CA")}
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              className="w-full p-2 rounded-md text-sm border focus:outline-none"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)",
              }}
            />
          </div>
        )}

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
          placeholder="Enter reason..."
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
          className="mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium w-full"
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

      {/* Leave Records */}
      {leaves.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 text-sm">
          <UserX size={28} style={{ color: "var(--color-secondary)" }} />
          <p className="mt-2" style={{ color: "var(--color-text-muted)" }}>
            No leave records found.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {leaves.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="rounded-lg p-4 shadow-sm"
              style={{
                backgroundColor: "var(--color-bg-alt)",
                color: "var(--color-text)",
              }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{item.date}</span>
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{
                    backgroundColor: "var(--color-leave)",
                    color: "var(--color-bg)",
                  }}
                >
                  Leave
                </span>
              </div>
              <div className="text-sm italic mb-2 opacity-80">
                {item.reason || "No reason provided."}
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <ClockPlus
                    size={14}
                    style={{ color: "var(--color-secondary)" }}
                  />
                  <span>{item.checkIn || "--"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlarmClockMinus
                    size={14}
                    style={{ color: "var(--color-accent)" }}
                  />
                  <span>{item.checkOut || "--"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Timer
                    size={14}
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
