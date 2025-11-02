// @ts-nocheck

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Clock } from "lucide-react";
import { getFromFirebase } from "../api/firebaseAPI";
import { auth } from "../firebase/config";

export default function AttendanceCalendar() {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const data = await getFromFirebase(`${uid}/attendance`);
        setAttendanceData(data || {});
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const statusByDate = {};
  Object.entries(attendanceData || {}).forEach(([date, record]) => {
    const key = Object.keys(record || {})[0];
    const actualRecord =
      record?.checkIn || record?.status ? record : record[key];
    console.log(actualRecord, "actualrecord");

    if (actualRecord?.status === "Present") {
      statusByDate[date] = "present";
    }
  });
  const getTileClass = ({ date }) => {
    const day = date.getDay();
    const dateStr = date.toLocaleDateString("en-CA");

    if (day === 0 || day === 6) return "calendar-weekend";

    if (statusByDate[dateStr] === "Present") return "calendar-present";

    const today = new Date();
    if (date < today && !statusByDate[dateStr]) return "calendar-absent";

    return "";
  };

  if (loading) return <p>Loading attendance...</p>;

  return (
    <div
      className="p-4  border"
      style={{
        borderColor: "var(--color-border)",
      }}
    >
      {/* 📅 Section Title */}
      {/* <div className="flex items-center justify-between mb-3">
        <h3
          className="text-base font-semibold flex items-center gap-2"
          style={{ color: "var(--color-text)" }}
        >
          <Clock size={18} style={{ color: "var(--color-primary)" }} />
          <span>Attendance Calendar</span>
        </h3>
      </div> */}

      {/* 🗓️ Calendar */}
      <Calendar
        value={new Date()}
        tileClassName={getTileClass}
        className="simple-calendar "
      />
    </div>
  );
}
