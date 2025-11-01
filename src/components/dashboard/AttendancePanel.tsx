// @ts-nocheck
import { motion } from "framer-motion";
import EmployeeHeader from "./EmployeeHeader";
import StatusSection from "./StatusSection";
import MessageBanner from "./MessageBanner";
import AttendanceMainContent from "./AttendanceMainContent";
import { useMemo } from "react";
import { useGeofence } from "../../hooks/useGeoFence";
import { useAttendanceActions } from "../../hooks/useAttendanceActions";
import PunchButton from "./PunchButton";

export default function AttendancePanel({
  punches,
  setPunches,
  message,
  setMessage,
}) {
  const { handleCheckIn, handleCheckOut } = useAttendanceActions(setPunches);
  const { isLoading, isInside } = useGeofence(setMessage);

  const isCheckedIn = useMemo(
    () => punches.length > 0 && punches[punches.length - 1].type === "Check-in",
    [punches]
  );

  const nextActionType = isCheckedIn ? "Check-out" : "Check-in";
  const status = isCheckedIn ? "Checked In" : "Not Checked In";
  const statusColor = isCheckedIn
    ? "var(--color-secondary)"
    : "var(--color-accent)";

  const recordPunch = async () => {
    if (!isInside) {
      setMessage("You must be inside the office area to perform this action.");
      return;
    }

    try {
      if (nextActionType === "Check-in") await handleCheckIn();
      else await handleCheckOut();
    } catch {
      setMessage("Punch failed. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      <motion.div
        className=" flex flex-col justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between">
          <div>
            <EmployeeHeader />
          </div>{" "}
          <div>
            <PunchButton
              nextActionType={nextActionType}
              isLoading={isLoading}
              recordPunch={recordPunch}
              isInside={isInside}
            />
          </div>
        </div>
        <StatusSection
          status={status}
          statusColor={statusColor}
          isInside={isInside}
        />

        {message && <MessageBanner message={message} />}
      </motion.div>

      {/* Right content */}
      <AttendanceMainContent punches={punches} />
    </div>
  );
}
