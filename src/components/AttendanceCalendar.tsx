// @ts-nocheck
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getFromFirebase } from "../api/firebaseAPI";
import { auth } from "../firebase/config";
import { FIXED_HOLIDAYS } from "../lib/constants";

export default function AttendanceCalendar() {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const data = await getFromFirebase(`/teammembers/${uid}/attendance`);
        console.log(data, "data....");

        setAttendanceData(data || {});
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // 🧩 Map all statuses by date
  const statusByDate = {};
  Object.entries(attendanceData || {}).forEach(([date, record]) => {
    console.log(date, "date");
    console.log(record, "record");

    const key = Object.keys(record || {})[0];
    const actualRecord =
      record?.checkIn || record?.status ? record : record[key];

    if (!actualRecord?.status) return;

    // ✅ Handle both Present and Leave
    if (actualRecord.status === "Present") {
      statusByDate[date] = "present";
    } else if (actualRecord.status === "Leave") {
      statusByDate[date] = "leave";
    } else if (actualRecord.status === "Absent") {
      statusByDate[date] = "absent";
    }
  });

  const getTileClass = ({ date }) => {
    const day = date.getDay();
    const dateStr = date.toLocaleDateString("en-CA");
    if (FIXED_HOLIDAYS.includes(dateStr)) return "calendar-holiday";

    if (day === 0 || day === 6) return "calendar-weekend";

    if (statusByDate[dateStr] === "present") return "calendar-present";
    if (statusByDate[dateStr] === "leave") return "calendar-leave";
    if (statusByDate[dateStr] === "absent") return "calendar-absent";

    // Mark past days without record as absent
    const today = new Date();
    if (date < today && !statusByDate[dateStr]) return "calendar-absent";

    return "";
  };

  if (loading) return <p>Loading attendance...</p>;

  return (
    <div
      className="p-4 border"
      style={{
        borderColor: "var(--color-border)",
      }}
    >
      <Calendar
        value={new Date()}
        tileClassName={getTileClass}
        className="simple-calendar"
      />
    </div>
  );
}
