// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { RefreshCw, Calendar, User, LogOut } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DashboardFilters({
  selectedUser,
  setSelectedUser,
  allNames,
  dateRange,
  setDateRange,
  onReset,
  onLogout,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const pickerRef = useRef(null);

  const startDate = dateRange[0].startDate;
  const endDate = dateRange[0].endDate;

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowDatePicker(false);
        setShowUserPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* 🧭 Desktop Filters */}
      <div className="hidden sm:flex items-center gap-3 pb-3 border-b border-(--color-border) mb-6">
        {/* 👤 User */}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-(--color-primary)" />
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-2 text-sm border border-(--color-border) rounded-md bg-(--color-bg) text-(--color-text)"
          >
            {allNames.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* 📅 Date */}
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-(--color-text) hover:text-(--color-primary)"
        >
          <Calendar className="w-4 h-4 text-(--color-primary)" />
          {startDate && endDate
            ? `${startDate.toLocaleDateString()} → ${endDate.toLocaleDateString()}`
            : "Select Date"}
        </button>

        {/* 🔄 Reset */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-2 text-sm text-(--color-primary) hover:text-(--color-text)"
        >
          <RefreshCw className="w-4 h-4" /> Reset
        </button>

        {/* 🚪 Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-(--color-danger) hover:text-(--color-text)"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* 📱 Minimal Mobile Bottom Bar */}
      <div className="sm:hidden fixed bottom-3 left-1/2 -translate-x-1/2 flex justify-around w-[90%] text-(--color-text) z-50">
        {/* 👤 User */}
        <button
          onClick={() => {
            setShowUserPicker(!showUserPicker);
            setShowDatePicker(false);
          }}
          className="flex flex-col items-center text-xs hover:text-(--color-primary)"
        >
          <User className="w-6 h-6 mb-1 text-(--color-primary)" />
          User
        </button>

        {/* 📅 Date */}
        <button
          onClick={() => {
            setShowDatePicker(!showDatePicker);
            setShowUserPicker(false);
          }}
          className="flex flex-col items-center text-xs hover:text-(--color-primary)"
        >
          <Calendar className="w-6 h-6 mb-1 text-(--color-primary)" />
          Date
        </button>

        {/* 🔄 Reset */}
        <button
          onClick={onReset}
          className="flex flex-col items-center text-xs hover:text-(--color-primary)"
        >
          <RefreshCw className="w-6 h-6 mb-1 text-(--color-primary)" />
          Reset
        </button>

        {/* 🚪 Logout */}
        <button
          onClick={onLogout}
          className="flex flex-col items-center text-xs hover:text-(--color-danger)"
        >
          <LogOut className="w-6 h-6 mb-1 text-(--color-danger)" />
          Logout
        </button>
      </div>

      {/* 👤 User Popup */}
      {showUserPicker && (
        <div
          ref={pickerRef}
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 text-center animate-fadeIn"
        >
          <select
            value={selectedUser}
            onChange={(e) => {
              setSelectedUser(e.target.value);
              setShowUserPicker(false);
            }}
            className="px-4 py-2 text-sm rounded-md bg-(--color-bg) text-(--color-text) border border-(--color-border)"
          >
            {allNames.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {showDatePicker && (
        <div
          ref={pickerRef}
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-(--color-bg) p-2 rounded-md shadow-md animate-fadeIn"
        >
          <DateRange
            editableDateInputs
            onChange={(item) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            rangeColors={["var(--color-primary)"]}
          />
          <button
            onClick={() => setShowDatePicker(false)}
            className="w-full mt-2 py-2 text-sm rounded-md bg-(--color-primary) text-white"
          >
            Done
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
