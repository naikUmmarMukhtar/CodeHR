// @ts-nocheck
import { useMemo, useState } from "react";
import StatusCard from "./StatusCard";
import PunchButton from "./PunchButton";
import AttendanceCalendar from "./AttendanceCalendar";
import Announcements from "./Announcements";
import { useGeofence } from "../../hooks/useGeoFence";
import { useAttendanceActions } from "../../hooks/useAttendanceActions";
import { showErrorToast } from "../../utils/toastMessage";

export default function AttendancePanel({
  punches,
  setPunches,
  message,
  setMessage,
}) {
  const [geoAllowed, setGeoAllowed] = useState(false);

  const { handleCheckIn, handleCheckOut } = useAttendanceActions(setPunches);
  const { verifyLocation, isLoading, isInside } = useGeofence(setMessage);

  const recordPunch = async () => {
    try {
      await verifyLocation();
      if (nextActionType === "Check-in") await handleCheckIn();
      else await handleCheckOut();
    } catch {
      // showErrorToast("Punch failed: You must be inside the office area.");
    }
  };
  const isCheckedIn = useMemo(
    () => punches.length > 0 && punches[punches.length - 1].type === "Check-in",
    [punches]
  );

  const nextActionType = isCheckedIn ? "Check-out" : "Check-in";

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
      </div>
      {message && (
        <p
          className={`text-sm font-medium text-center ${
            message.includes("❌")
              ? "text-red-500"
              : message.includes("✅")
              ? "text-green-600"
              : "text-yellow-600"
          }`}
        >
          {message}
        </p>
      )}

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
