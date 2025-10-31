// @ts-nocheck

import { useMemo, useState } from "react";
import { getAuth } from "firebase/auth";
import { auth } from "../../firebase/config";
import {
  postToFirebase,
  putToFirebase,
  getFromFirebase,
} from "../../api/firebaseAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toastMessage";
import { haversineDistance } from "../../utils/distance";

import { checkTimeWarnings } from "../../utils/timeValidation";
import StatusCard from "./StatusCard";
import PunchButton from "./PunchButton";
import PunchLog from "./PunchLog";
import AttendanceCalendar from "./AttendanceCalendar";
import Announcements from "./Announcements";
import { confirmAction } from "../../utils/ConfirmDialog";
import { OFFICE_COORDS, OFFICE_RADIUS_METERS } from "../../lib/constants";

export default function AttendancePanel({
  punches,
  setPunches,
  message,
  setMessage,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const user = getAuth().currentUser;
  const userId = user?.uid;

  const isCheckedIn = useMemo(() => {
    if (punches.length === 0) return false;
    return punches[punches.length - 1].type === "Check-in";
  }, [punches]);

  const nextActionType = isCheckedIn ? "Check-out" : "Check-in";

  const recordPunch = async (type) => {
    if (!navigator.geolocation) return setMessage("Geolocation not supported.");
    if (!userId) return showErrorToast("User not authenticated.");

    setIsLoading(true);
    setMessage(`Attempting ${type}... Checking location...`);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLoading(false);
        const { latitude, longitude } = pos.coords;
        const dist = haversineDistance(
          latitude,
          longitude,
          OFFICE_COORDS.lat,
          OFFICE_COORDS.lng
        );

        if (dist >= OFFICE_RADIUS_METERS) {
          const now = new Date();
          const today = now.toISOString().split("T")[0];
          const timeOnly = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });

          const warnings = checkTimeWarnings(type, now);

          let confirmed = true;

          // If there are warnings, show them inside the confirm dialog
          if (warnings.length > 0) {
            confirmed = await confirmAction(
              `${warnings[0]}\n\nDo you still want to proceed with ${type}?`
            );
          } else {
            confirmed = await confirmAction(
              `Do you want to proceed with ${type}?`
            );
          }

          if (!confirmed) return;

          if (!confirmed) return showErrorToast(`${type} cancelled.`);

          try {
            const uid = auth.currentUser?.uid;

            if (type === "Check-in") {
              await postToFirebase(`${uid}/attendance/${today}`, {
                checkIn: timeOnly,
                checkOut: "",
                status: "Present",
              });
            } else if (type === "Check-out") {
              const existingData = await getFromFirebase(
                `${uid}/attendance/${today}`
              );

              let checkInTime = "";

              if (existingData) {
                const keys = Object.keys(existingData);
                const autoKey = keys.find((k) => k.startsWith("-"));
                if (autoKey) {
                  checkInTime = existingData[autoKey]?.checkIn || "";
                } else {
                  checkInTime = existingData?.checkIn || "";
                }
              }
              console.log(existingData, "checkintitme");

              await putToFirebase(`${uid}/attendance/${today}`, {
                checkIn: checkInTime,
                checkOut: timeOnly,
                status: "Present",
              });
            }

            setPunches((prev) => [...prev, { time: timeOnly, type }]);
            setMessage(`${type} successful!`);
            showSuccessToast(`${type} recorded successfully.`);
          } catch (error) {
            console.error("Firebase Error:", error);
            showErrorToast("Failed to record attendance.");
          }
        } else {
          const distanceAway = Math.round(dist);
          setMessage(`❌ Outside allowed area. ${distanceAway}m away.`);
          showErrorToast("Punch Failed: Too far from office.");
        }
      },
      (err) => {
        setIsLoading(false);
        setMessage("Location error: " + err.message);
        showErrorToast("Location Permission Denied or Timeout.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="lg:col-span-1 space-y-4">
        <div className="card">
          <StatusCard isCheckedIn={isCheckedIn} />
        </div>
        <div className="card">
          <PunchButton
            nextActionType={nextActionType}
            isLoading={isLoading}
            recordPunch={recordPunch}
          />
        </div>
        {/* <div className="card">
          <PunchLog punches={punches} message={message} />
        </div> */}
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="card">
          <AttendanceCalendar punches={punches} />
        </div>
        <div className="card">
          <Announcements />
        </div>
      </div>
    </div>
  );
}
