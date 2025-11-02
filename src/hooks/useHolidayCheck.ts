// src/hooks/useHolidayCheck.ts
import { useEffect, useState } from "react";
import { FIXED_HOLIDAYS, WEEKEND_DAYS } from "../lib/constants";

export const useHolidayCheck = () => {
  const [isHoliday, setIsHoliday] = useState(false);

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const dayOfWeek = today.getDay();

    if (WEEKEND_DAYS.includes(dayOfWeek) || FIXED_HOLIDAYS.includes(todayStr)) {
      setIsHoliday(true);
    }
  }, []);

  return isHoliday;
};
