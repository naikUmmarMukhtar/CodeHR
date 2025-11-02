// App.tsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate, Route, Routes } from "react-router";
import { auth } from "./firebase/config";

import Loader from "./components/shared/Loader";
import Home from "./pages/Home";
import MobileAuthForm from "./components/auth/AuthForm";
import HolidayPage from "./pages/HolidayPage";
import LocationPermissionPage from "./pages/LocationPermissionPage";
import AttendanceHistory from "./pages/AttendanceHistory";
import MobileNav from "./components/shared/MobileNav";
import { FIXED_HOLIDAYS, WEEKEND_DAYS } from "./lib/constants";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHoliday, setIsHoliday] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const checkLocation = () => {
    if (!("geolocation" in navigator)) {
      setStatusMessage("Geolocation is not supported by your browser.");
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    setStatusMessage("Checking location...");

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationAllowed(true);
        localStorage.setItem("locationAllowed", "true");
        setIsChecking(false);
        setStatusMessage("");
      },
      () => {
        setLocationAllowed(false);
        localStorage.setItem("locationAllowed", "false");
        setIsChecking(false);
        setStatusMessage("Please turn on your location to continue.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  useEffect(() => {
    checkLocation();

    if ("permissions" in navigator && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((perm) => {
        perm.onchange = () => {
          if (perm.state === "granted") {
            setLocationAllowed(true);
            localStorage.setItem("locationAllowed", "true");
          }
        };
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const dayOfWeek = today.getDay();
    if (WEEKEND_DAYS.includes(dayOfWeek) || FIXED_HOLIDAYS.includes(todayStr)) {
      setIsHoliday(true);
    }

    const saved = localStorage.getItem("locationAllowed");
    if (saved !== null) setLocationAllowed(saved === "true");

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (locationAllowed !== null) {
      localStorage.setItem("locationAllowed", String(locationAllowed));
    }
  }, [locationAllowed]);

  if (loading || locationAllowed === null) return <Loader />;

  if (!locationAllowed) {
    return (
      <LocationPermissionPage
        checkLocation={checkLocation}
        isChecking={isChecking}
        statusMessage={statusMessage}
      />
    );
  }

  if (!user || !user.emailVerified) {
    return <MobileAuthForm />;
  }

  // Uncomment if holiday logic is active
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
