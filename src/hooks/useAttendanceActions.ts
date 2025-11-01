// @ts-nocheck
import { getAuth } from "firebase/auth";
import { CHECKIN_START, CHECKOUT_MIN } from "../lib/constants";
import {
  getFromFirebase,
  postToFirebase,
  putToFirebase,
} from "../api/firebaseAPI";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import { checkTimeWarnings } from "../utils/timeValidation";
import { confirmAction } from "../utils/ConfirmDialog";

// 🕒 Helper to calculate time difference in seconds
const calculateWorkDuration = (checkIn, checkOut) => {
  try {
    const inTime = new Date(`1970-01-01T${convertTo24Hr(checkIn)}Z`);
    const outTime = new Date(`1970-01-01T${convertTo24Hr(checkOut)}Z`);
    const diff = (outTime - inTime) / 1000;
    return diff > 0 ? diff : 0;
  } catch {
    return 0;
  }
};

// 🔄 Convert "02:30:00 PM" → "14:30:00"
const convertTo24Hr = (timeStr) => {
  if (!timeStr) return "00:00:00";
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

// 🧭 Format seconds to HH:MM:SS
const formatWorkTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export function useAttendanceActions(setPunches) {
  const user = getAuth().currentUser;
  const userId = user?.uid;

  const getTodayKey = () => new Date().toLocaleDateString("en-CA");
  const getTimeNow = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const handleCheckIn = async () => {
    const now = new Date();
    const today = getTodayKey();
    const timeOnly = getTimeNow();

    try {
      await postToFirebase(`${userId}/attendance/${today}`, {
        checkIn: timeOnly,
        checkOut: "",
        workDuration: "",
        status: "absent",
      });

      setPunches((prev) => [...prev, { time: timeOnly, type: "Check-in" }]);
      showSuccessToast("Check-in successful!");
    } catch (err) {
      console.error("Firebase error:", err);
      showErrorToast("Failed to post attendance.");
    }
  };

  const handleCheckOut = async () => {
    const now = new Date();
    const today = getTodayKey();
    const timeOnly = getTimeNow();

    if (now.getHours() < CHECKOUT_MIN.hour)
      return showErrorToast(
        `Cannot check-out before ${CHECKOUT_MIN.hour}:00 PM.`
      );

    const existingData = await getFromFirebase(`${userId}/attendance/${today}`);
    if (!existingData) return showErrorToast("No check-in found.");

    const keys = Object.keys(existingData);
    const autoKey = keys.find((k) => k.startsWith("-"));
    const record = autoKey ? existingData[autoKey] : existingData;

    const checkInTime = record?.checkIn;
    if (!checkInTime) return showErrorToast("Check-in time not found.");

    const warnings = checkTimeWarnings("Check-out", now);
    const confirmed = await confirmAction(
      warnings.length
        ? `${warnings[0]}\n\nProceed with Check-out?`
        : "Confirm Check-out?"
    );
    if (!confirmed) return;

    const totalSeconds = calculateWorkDuration(checkInTime, timeOnly);
    const formattedDuration = formatWorkTime(totalSeconds);

    await putToFirebase(`${userId}/attendance/${today}`, {
      checkIn: checkInTime,
      checkOut: timeOnly,
      workDuration: formattedDuration,
      status: "Present",
    });

    setPunches((prev) => [...prev, { time: timeOnly, type: "Check-out" }]);
    showSuccessToast(
      `Check-out successful! Total work time: ${formattedDuration}`
    );
  };

  return { handleCheckIn, handleCheckOut };
}
