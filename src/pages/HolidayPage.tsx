// @ts-nocheck
import React from "react";

export default function HolidayPage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg)",
        overflow: "hidden",
      }}
    >
      <img
        src="/assets/holiday.png"
        alt="Holiday fun"
        style={{
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
