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
      </div>
    </>
  );
}
