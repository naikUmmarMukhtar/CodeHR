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

  const getTodayKey = () => new Date().toLocaleDateString("en-CA");
  const getTimeNow = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const isBeforeNineAM = (date) => date.getHours() < 9;

  const handleCheckIn = async () => {
    const now = new Date();
    const today = getTodayKey();
    const timeOnly = getTimeNow();

    if (isBeforeNineAM(now)) {
      return showErrorToast("Check-in not allowed before 9:00 AM.");
    }

    const existing = await getFromFirebase(`${userId}/attendance/${today}`);
    if (
      existing &&
      Object.values(existing).some(
        (v) => v.status === "present" || v.status === "absent"
      )
    ) {
      return showErrorToast("You have already checked in today.");
    }

    const warnings = checkTimeWarnings("Check-in", now);
    let confirmed = true;
    if (warnings.length > 0) {
      confirmed = await confirmAction(
        `${warnings[0]}\n\nProceed with Check-in?`
      );
    } else {
      confirmed = await confirmAction("Do you want to Check-in?");
    }
    if (!confirmed) return;

    await postToFirebase(`${userId}/attendance/${today}`, {
      checkIn: timeOnly,
      checkOut: "",
      status: "absent",
    });

    setPunches((prev) => [...prev, { time: timeOnly, type: "Check-in" }]);
    showSuccessToast("Check-in recorded successfully.");
  };

  const handleCheckOut = async () => {
    const now = new Date();
    const today = getTodayKey();
    const timeOnly = getTimeNow();

    const existingData = await getFromFirebase(`${userId}/attendance/${today}`);
    if (!existingData) return showErrorToast("No check-in found for today.");

    const keys = Object.keys(existingData);
    const autoKey = keys.find((k) => k.startsWith("-"));
    const checkInTime = autoKey
      ? existingData[autoKey]?.checkIn || ""
      : existingData?.checkIn || "";

    const warnings = checkTimeWarnings("Check-out", now);
    let confirmed = true;
    if (warnings.length > 0) {
      confirmed = await confirmAction(
        `${warnings[0]}\n\nProceed with Check-out?`
      );
    } else {
      confirmed = await confirmAction("Do you want to Check-out?");
    }
    if (!confirmed) return;

    await putToFirebase(`${userId}/attendance/${today}`, {
      checkIn: checkInTime,
      checkOut: timeOnly,
      status: "present",
    });

    setPunches((prev) => [...prev, { time: timeOnly, type: "Check-out" }]);
    showSuccessToast("Check-out recorded successfully.");
  };

  const recordPunch = async (callback) => {
    if (!navigator.geolocation) return setMessage("Geolocation not supported.");
    if (!userId) return showErrorToast("User not authenticated.");

    setIsLoading(true);
    setMessage(`Checking location before punch...`);

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
        console.log(dist, "...");

        if (dist >= OFFICE_COORDS) {
          const distanceAway = Math.round(dist);
          setMessage(`❌ Outside allowed area. ${distanceAway}m away.`);
          return showErrorToast("Punch Failed: Too far from office.");
        }

        await callback();
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
            isCheckedIn={isCheckedIn}
            isLoading={isLoading}
            handleCheckIn={() => recordPunch(handleCheckIn)}
            handleCheckOut={() => recordPunch(handleCheckOut)}
          />
        </div>
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
