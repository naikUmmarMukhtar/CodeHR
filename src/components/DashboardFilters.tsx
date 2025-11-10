// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { RefreshCw, Calendar, User, LogOut, Filter } from "lucide-react";
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

  // Close popups when clicking outside
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
      {/* 💻 Desktop Filter Toolbar */}
      <div className="hidden sm:flex items-center gap-4 pb-4 border-b border-(--color-border) mb-6 bg-(--color-bg-alt) p-3 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 text-(--color-primary)">
          <Filter className="w-5 h-5" />
          <h3 className="text-sm font-medium text-(--color-text)">
            Dashboard Filters
          </h3>
        </div>

        {/* 👤 User Filter */}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-(--color-primary)" />
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-2 text-sm border border-(--color-border) rounded-lg bg-(--color-bg) text-(--color-text) hover:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          >
            <option value="">All Employees</option>
            {allNames.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* 📅 Date Range Filter */}
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-(--color-border) rounded-lg bg-(--color-bg) hover:border-(--color-primary) transition-all duration-150"
        >
          <Calendar className="w-4 h-4 text-(--color-primary)" />
          {startDate && endDate
            ? `${startDate.toLocaleDateString()} → ${endDate.toLocaleDateString()}`
            : "Select Date Range"}
        </button>

        {/* 🔄 Reset Filter */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-(--color-primary) text-white hover:bg-(--color-primary-dark) transition-all duration-150"
        >
          <RefreshCw className="w-4 h-4" /> Reset Filters
        </button>

        {/* 🚪 Logout */}
        <button
          onClick={onLogout}
          className="ml-auto flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-(--color-danger) hover:text-white hover:bg-(--color-danger) transition-all duration-150"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* 📱 Mobile Floating Filter Bar */}
      <div className="sm:hidden fixed bottom-3 left-1/2 -translate-x-1/2 flex justify-around w-[90%] py-2 bg-(--color-bg) border border-(--color-border) rounded-2xl shadow-lg z-50 backdrop-blur-md">
        <button
          onClick={() => {
            setShowUserPicker(!showUserPicker);
            setShowDatePicker(false);
          }}
          className="flex flex-col items-center text-xs text-(--color-text) hover:text-(--color-primary) transition-all"
        >
          <User className="w-6 h-6 mb-1 text-(--color-primary)" />
          User
        </button>

        <button
          onClick={() => {
            setShowDatePicker(!showDatePicker);
            setShowUserPicker(false);
          }}
          className="flex flex-col items-center text-xs text-(--color-text) hover:text-(--color-primary)"
        >
          <Calendar className="w-6 h-6 mb-1 text-(--color-primary)" />
          Date
        </button>

        <button
          onClick={onReset}
          className="flex flex-col items-center text-xs text-(--color-text) hover:text-(--color-primary)"
        >
          <RefreshCw className="w-6 h-6 mb-1 text-(--color-primary)" />
          Reset
        </button>

        <button
          onClick={onLogout}
          className="flex flex-col items-center text-xs text-(--color-danger) hover:text-white hover:bg-(--color-danger) rounded-full p-1 transition-all"
        >
          <LogOut className="w-6 h-6 mb-1" />
          Logout
        </button>
      </div>

      {/* 👤 User Popup */}
      {showUserPicker && (
        <div
          ref={pickerRef}
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 text-center animate-fadeIn"
        >
          <div className="bg-(--color-bg-alt) p-3 rounded-lg shadow-md border border-(--color-border)">
            <p className="text-xs mb-2 text-(--color-text-muted)">
              Filter by user
            </p>
            <select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setShowUserPicker(false);
              }}
              className="px-4 py-2 text-sm rounded-md bg-(--color-bg) text-(--color-text) border border-(--color-border) w-full"
            >
              <option value="">All Employees</option>
              {allNames.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 📅 Date Picker Popup */}
      {showDatePicker && (
        <div
          ref={pickerRef}
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-(--color-bg-alt) p-3 rounded-lg shadow-lg border border-(--color-border) animate-fadeIn"
        >
          <p className="text-xs mb-2 text-(--color-text-muted)">
            Filter by date range
          </p>
          <DateRange
            editableDateInputs
            onChange={(item) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            rangeColors={["var(--color-primary)"]}
          />
          <button
            onClick={() => setShowDatePicker(false)}
            className="w-full mt-2 py-2 text-sm rounded-md bg-(--color-primary) text-white hover:bg-(--color-primary-dark) transition-all"
          >
            Apply
          </button>
        </div>
      )}

      {/* Simple fade animation */}
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
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
