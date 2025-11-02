import { useEffect } from "react";
import { CHECKIN_START } from "../lib/constants";

export const useDailyReset = (resetCallback: () => void) => {
  useEffect(() => {
    const checkDailyReset = () => {
      const now = new Date();
      const currentDate = now.toLocaleDateString("en-CA");
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const lastResetDate = localStorage.getItem("lastResetDate");

      const isAfterResetTime =
        currentHour > CHECKIN_START.hour ||
        (currentHour === CHECKIN_START.hour &&
          currentMinute >= CHECKIN_START.minute);

      if (isAfterResetTime && lastResetDate !== currentDate) {
        resetCallback();
        localStorage.setItem("lastResetDate", currentDate);
      }
    };

    checkDailyReset();

    const interval = setInterval(checkDailyReset, 60 * 1000);

    return () => clearInterval(interval);
  }, [resetCallback]);
};
