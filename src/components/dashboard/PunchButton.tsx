// @ts-nocheck
import { LogIn, LogOut, Loader2 } from "lucide-react";

export default function PunchButton({
  isCheckedIn,
  isLoading,
  handleCheckIn,
  handleCheckOut,
}) {
  const isCheckIn = !isCheckedIn;

  const onClickHandler = () => (isCheckIn ? handleCheckIn() : handleCheckOut());

  return (
    <button
      onClick={onClickHandler}
      disabled={isLoading}
      className={`
        w-full px-6 py-2 rounded-lg font-semibold text-base
        flex items-center justify-center gap-2
        transition-all duration-200
        disabled:opacity-70 disabled:cursor-not-allowed
        text-(--color-bg)
        ${isCheckIn ? "bg-(--color-primary)" : "bg-(--color-accent)"}
        hover:bg-(--color-hover)
        active:scale-95
      `}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Please wait...
        </>
      ) : isCheckIn ? (
        <>
          <LogIn size={18} /> Check In
        </>
      ) : (
        <>
          <LogOut size={18} /> Check Out
        </>
      )}
    </button>
  );
}
