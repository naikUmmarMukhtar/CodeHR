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
    if (!userId) {
      showErrorToast("User not authenticated.");
      return;
    }

    const now = new Date();
    const today = getTodayKey();
    const timeOnly = getTimeNow();

    try {
      await postToFirebase(`${userId}/attendance/${today}`, {
        checkIn: timeOnly,
        checkOut: "",
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
    const checkInTime = autoKey
      ? existingData[autoKey]?.checkIn
      : existingData?.checkIn;

    const warnings = checkTimeWarnings("Check-out", now);
    const confirmed = await confirmAction(
      warnings.length
        ? `${warnings[0]}\n\nProceed with Check-out?`
        : "Confirm Check-out?"
    );
    if (!confirmed) return;

    await putToFirebase(`${userId}/attendance/${today}`, {
      checkIn: checkInTime,
      checkOut: timeOnly,
      status: "Present",
    });

    setPunches((prev) => [...prev, { time: timeOnly, type: "Check-out" }]);
    showSuccessToast("Check-out successful!");
  };

  return { handleCheckIn, handleCheckOut };
}
