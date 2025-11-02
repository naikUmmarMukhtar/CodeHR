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
  const { locationAllowed } = useLocationPermission();
  const isMobileDevice = useDeviceCheck();

  const isReady =
    !loading && locationAllowed !== null && isMobileDevice !== null;

  if (!isReady) return <Loader />;

  // if (!isMobileDevice) return <MobileOnlyPage />;
  // if (isHoliday) return <HolidayPage />;

  if (!locationAllowed) return <LocationPermissionPage />;

  if (!user || !user.emailVerified) return <MobileAuthForm />;

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
