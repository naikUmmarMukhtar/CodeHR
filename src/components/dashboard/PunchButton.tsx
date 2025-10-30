// import React from "react";
// @ts-nocheck

export default function PunchButton({
  nextActionType,
  isLoading,
  recordPunch,
}) {
  const isCheckIn = nextActionType === "Check-in";

  const buttonColor = isCheckIn
    ? "var(--color-primary)"
    : "var(--color-accent)";

  const hoverColor = "var(--color-hover)";

  return (
    <button
      onClick={() => recordPunch(nextActionType)}
      disabled={isLoading}
      style={{
        width: "100%",
        padding: "0.75rem",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "1rem",
        color: "var(--color-bg)",
        backgroundColor: buttonColor,
        cursor: isLoading ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.7 : 1,
        transition: "background-color 0.2s ease",
      }}
      onMouseOver={(e) => {
        if (!isLoading) e.currentTarget.style.backgroundColor = hoverColor;
      }}
      onMouseOut={(e) => {
        if (!isLoading) e.currentTarget.style.backgroundColor = buttonColor;
      }}
    >
      {isLoading ? "Please wait..." : isCheckIn ? "Check In" : "Check Out"}
    </button>
  );
}
