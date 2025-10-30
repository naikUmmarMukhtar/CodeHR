import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { haversineDistance } from "../utils/distance";
import { db } from "../firebase/config";

const OFFICE_COORDS = { lat: 37.7749, lng: -122.4194 };
const OFFICE_RADIUS_METERS = 200;

export interface AttendanceRecord {
  userId: string;
  timestamp: string;
  lat: number;
  lng: number;
  accuracy?: number;
}

export function useAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [message, setMessage] = useState("");

  async function fetchAttendance() {
    if (!user) return;
    const q = query(
      collection(db, "attendance"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    setRecords(snapshot.docs.map((d) => d.data() as AttendanceRecord));
  }

  async function submitPunch() {
    if (!user) return setMessage("Not logged in");
    if (!navigator.geolocation) return setMessage("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const dist = haversineDistance(
          latitude,
          longitude,
          OFFICE_COORDS.lat,
          OFFICE_COORDS.lng
        );
        if (dist > OFFICE_RADIUS_METERS)
          return setMessage(`Outside area (${Math.round(dist)}m away)`);

        await addDoc(collection(db, "attendance"), {
          userId: user.uid,
          timestamp: new Date().toISOString(),
          lat: latitude,
          lng: longitude,
          accuracy,
        });
        setMessage("Punch recorded");
        fetchAttendance();
      },
      (err) => setMessage("Error: " + err.message),
      { enableHighAccuracy: true }
    );
  }

  useEffect(() => {
    fetchAttendance();
  }, [user]);

  return { records, submitPunch, message };
}
