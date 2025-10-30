// import React from "react";
// @ts-nocheck

import { User, CalendarDays, Wallet } from "lucide-react";

export default function PlaceholderTab({ tab }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-gray-700">
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        {tab === "profile" && <User size={18} />}
        {tab === "leave" && <CalendarDays size={18} />}
        {tab === "salary" && <Wallet size={18} />}
        {tab.charAt(0).toUpperCase() + tab.slice(1)} Section
      </h3>
      <p className="text-sm text-gray-500">
        Feature coming soon — explore other tabs.
      </p>
    </div>
  );
}
