// @ts-nocheck
import { ClockPlus, BadgeCheck, Loader2 } from "lucide-react";

export default function PunchButton({
  nextActionType,
  isLoading,
  recordPunch,
  isInside,
}) {
  const isCheckIn = nextActionType === "Check-in";
  const ButtonIcon = isCheckIn ? ClockPlus : BadgeCheck;

  return (
    <button
      onClick={recordPunch}
      disabled={isLoading}
      style={{
        backgroundColor: isCheckIn
          ? "var(--color-secondary)"
          : "var(--color-primary)",
        color: "var(--color-bg)",
        opacity: isLoading || !isInside ? 0.6 : 1,
        cursor: isLoading || !isInside ? "not-allowed" : "pointer",
      }}
      className={`
        px-5 py-2 rounded-md font-medium
        flex items-center gap-2
        transition-opacity duration-200
        hover:opacity-90
      `}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <ButtonIcon size={18} />
      )}
      {isLoading ? "Processing..." : isCheckIn ? "Check In" : "Check Out"}
    </button>
  );
}
