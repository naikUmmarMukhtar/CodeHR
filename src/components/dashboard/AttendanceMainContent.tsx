//@ts-nocheck
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import AttendanceCalendar from "./AttendanceCalendar";
import Announcements from "./Announcements";

export default function AttendanceMainContent({ punches }) {
  return (
    <motion.div
      className="lg:col-span-2 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
    >
      <div className="bg-(--color-bg) rounded-2xl shadow-sm border border-(--color-border) p-6">
        <h3
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: "var(--color-text)" }}
        >
          <Clock size={18} style={{ color: "var(--color-primary)" }} />
          Attendance Calendar
        </h3>
        <AttendanceCalendar punches={punches} />
      </div>
    </motion.div>
  );
}
