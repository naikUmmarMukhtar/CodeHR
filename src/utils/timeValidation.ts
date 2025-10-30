import { CHECKIN_END, CHECKIN_START, CHECKOUT_MIN } from "../lib/constants";

export function checkTimeWarnings(type, now) {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const warnings = [];

  if (type === "Check-in") {
    if (
      hours > CHECKIN_END.hour ||
      (hours === CHECKIN_END.hour && minutes > CHECKIN_END.minute)
    ) {
      warnings.push("⚠️ Late Check-in! You’re past 10:15 AM.");
    } else if (
      hours < CHECKIN_START.hour ||
      (hours === CHECKIN_START.hour && minutes < CHECKIN_START.minute)
    ) {
      warnings.push("⚠️ Early Check-in before 9:45 AM.");
    }
  }

  if (type === "Check-out") {
    if (hours < CHECKOUT_MIN.hour) {
      warnings.push("⚠️ Early Check-out before 5:00 PM.");
    }
  }

  return warnings;
}
