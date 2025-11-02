// @ts-nocheck
import { Navigate, Route, Routes } from "react-router";
import Loader from "./components/shared/Loader";
import Home from "./pages/Home";
import MobileAuthForm from "./components/auth/AuthForm";
import HolidayPage from "./pages/HolidayPage";
import LocationPermissionPage from "./pages/LocationPermissionPage";
import AttendanceHistory from "./pages/AttendanceHistory";
import MobileNav from "./components/shared/MobileNav";
import MobileOnlyPage from "./pages/MobileOnlyPage";

import { useAuth } from "./hooks/useAuth";
import { useHolidayCheck } from "./hooks/useHolidayCheck";
import { useLocationPermission } from "./hooks/useLocationPermission";
import { useDeviceCheck } from "./hooks/useDeviceCheck";

function App() {
  const { user, loading } = useAuth();
  const isHoliday = useHolidayCheck();
  const { locationAllowed, setLocationAllowed } = useLocationPermission();
  const isMobileDevice = useDeviceCheck();

  if (loading || locationAllowed === null || isMobileDevice === null)
    return <Loader />;

  if (isMobileDevice === false) return <MobileOnlyPage />;

  if (!locationAllowed)
    return <LocationPermissionPage setLocationAllowed={setLocationAllowed} />;

  if (!user || !user.emailVerified) return <MobileAuthForm />;

  // if (isHoliday) return <HolidayPage />;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<AttendanceHistory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <MobileNav />
    </>
  );
}

export default App;
