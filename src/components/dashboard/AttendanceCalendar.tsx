// @ts-nocheck

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getFromFirebase } from "../../api/firebaseAPI";
import { auth } from "../../firebase/config";

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
    const dateStr = date.toISOString().split("T")[0];
    console.log(dateStr, "datestr");

    if (day === 0 || day === 6) return "calendar-weekend";
    console.log(statusByDate, "statusbydate");

    if (statusByDate[dateStr] === "present") return "calendar-present";

    const today = new Date();
    if (date < today && !statusByDate[dateStr]) return "calendar-absent";

    return "";
  };

  if (loading) return <p>Loading attendance...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h3
        style={{
          fontWeight: "bold",
          fontSize: "1.1rem",
          marginBottom: "0.5rem",
        }}
      >
        Attendance Calendar
      </h3>

      <Calendar
        value={new Date()}
        tileClassName={getTileClass}
        className="simple-calendar"
      />
    </div>
  );
}
