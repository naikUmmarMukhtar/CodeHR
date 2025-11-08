// @ts-nocheck
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Loader from "./components/shared/Loader";
import Home from "./pages/Home";
import MobileAuthForm from "./components/auth/AuthForm";
import HolidayPage from "./pages/HolidayPage";
import AttendanceHistory from "./pages/AttendanceHistory";
import MobileNav from "./components/shared/MobileNav";
import LeaveHistory from "./pages/LeaveHistory";
import ProfilePage from "./pages/ProfilePage";
import HolidayList from "./pages/HolidayList";
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboard from "./pages/AdminDashboard";

import { useAuth } from "./hooks/useAuth";
import { useHolidayCheck } from "./hooks/useHolidayCheck";
import { getFromFirebase } from "./api/firebaseAPI";
function App() {
  const isHoliday = useHolidayCheck();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <Loader />;
  if (!user) return <MobileAuthForm />;
  // if (isHoliday) return <HolidayPage />;

  return (
    <>
      <ScrollToTop />
      <Routes>
        {user.isAdmin ? (
          <>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route
              path="*"
              element={<Navigate to="/admin-dashboard" replace />}
            />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<AttendanceHistory />} />
            <Route path="/leave-history" element={<LeaveHistory />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/holiday-list" element={<HolidayList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>

      {!user.isAdmin && <MobileNav />}
    </>
  );
}
export default App;
