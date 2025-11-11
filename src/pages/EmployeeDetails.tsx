// @ts-nocheck
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { Calendar, CheckCircle, XCircle, Moon } from "lucide-react";

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const employee = state?.employee;

  if (!employee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
        <p className="text-gray-500 mb-4">No employee data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-(--color-primary) underline text-sm"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const { userDetails, attendance = [] } = employee;
  const [selectedDate, setSelectedDate] = useState("");

  // Filter attendance by selected date
  const filteredAttendance = useMemo(() => {
    if (!selectedDate) return attendance;
    return attendance.filter((a) => a.date === selectedDate);
  }, [selectedDate, attendance]);

  // Calculate totals
  const totals = useMemo(() => {
    let present = 0,
      leave = 0,
      absent = 0;
    attendance.forEach((a) => {
      switch ((a.status || "").toLowerCase()) {
        case "present":
          present++;
          break;
        case "leave":
          leave++;
          break;
        case "absent":
          absent++;
          break;
      }
    });
    return { present, leave, absent };
  }, [attendance]);

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "leave":
        return "text-yellow-500";
      case "absent":
        return "text-red-500";
      default:
        return "text-green-600";
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Back Button */}
        <div className="px-6 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-(--color-primary) hover:underline"
          >
            ← Back
          </button>
        </div>

        {/* Employee Info */}
        <div className="px-6 mt-4 mb-2">
          <h1 className="text-2xl font-bold text-(--color-primary)">
            {userDetails.username || userDetails.displayName || "Unknown"}
          </h1>
          <p className="text-sm text-gray-500">{userDetails.email}</p>
        </div>

        {/* Summary Bar (Top) */}
        <div className="border-t border-b py-3 flex items-center justify-around text-sm font-medium">
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" /> Present: {totals.present}
          </div>
          <div className="flex items-center gap-1 text-yellow-500 border-l border-gray-200 pl-4">
            <Moon className="w-4 h-4" /> Leave: {totals.leave}
          </div>
          <div className="flex items-center gap-1 text-red-500 border-l border-gray-200 pl-4">
            <XCircle className="w-4 h-4" /> Absent: {totals.absent}
          </div>
        </div>

        {/* Attendance Records */}
        <div className="px-6 py-6 space-y-4">
          {filteredAttendance.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No attendance records found for this date.
            </p>
          ) : (
            filteredAttendance.map((att, idx) => (
              <div key={idx} className="py-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-(--color-primary)" />
                    <div>
                      <div className="font-medium">{att.date}</div>
                      <div className="text-sm text-gray-500">
                        {att.reason || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-semibold ${getStatusColor(att.status)}`}
                    >
                      {att.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      In: {att.checkIn || "--"} • Out: {att.checkOut || "--"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Duration: {att.workDuration || "00:00:00"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- Fixed Bottom Filter Bar --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 w-full justify-between">
          <label htmlFor="date" className="text-sm font-medium text-gray-600">
            Filter by Date:
          </label>
          <div className="flex items-center gap-2">
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="text-xs text-(--color-primary) underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
