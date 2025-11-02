// @ts-nocheck
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate, Route, Routes } from "react-router";
import { auth } from "./firebase/config";
import Loader from "./components/shared/Loader";
import Home from "./pages/Home";
import MobileAuthForm from "./components/auth/AuthForm";
import HolidayPage from "./pages/HolidayPage";
import LocationPermissionPage from "./pages/LocationPermissionPage";
import { FIXED_HOLIDAYS, WEEKEND_DAYS } from "./lib/constants";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHoliday, setIsHoliday] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);

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

    const checkLocationPermission = async () => {
      // iOS and some browsers may not support permissions API
      if (!("geolocation" in navigator)) {
        setLocationAllowed(false);
        return;
      }

      try {
        if ("permissions" in navigator && navigator.permissions.query) {
          const permission = await navigator.permissions.query({
            name: "geolocation" as PermissionName,
          });

          if (permission.state === "granted") {
            setLocationAllowed(true);
          } else if (permission.state === "prompt") {
            // Try to verify actual access silently
            navigator.geolocation.getCurrentPosition(
              () => setLocationAllowed(true),
              () => setLocationAllowed(false)
            );
          } else {
            setLocationAllowed(false);
          }

          permission.onchange = () => {
            setLocationAllowed(permission.state === "granted");
          };
        } else {
          // Safari fallback
          navigator.geolocation.getCurrentPosition(
            () => setLocationAllowed(true),
            () => setLocationAllowed(false)
          );
        }
      } catch (error) {
        console.error("Error checking location permission:", error);
        setLocationAllowed(false);
      }
    };

    // Load from localStorage first (to avoid brief flash)
    const savedPermission = localStorage.getItem("locationAllowed");
    if (savedPermission !== null) {
      setLocationAllowed(savedPermission === "true");
    }

    // Always re-check in the background
    checkLocationPermission();

    return () => unsubscribe();
  }, []);

  // Persist location permission state
  useEffect(() => {
    if (locationAllowed !== null) {
      localStorage.setItem("locationAllowed", String(locationAllowed));
    }
  }, [locationAllowed]);

  if (loading || locationAllowed === null) return <Loader />;

  if (!locationAllowed) return <LocationPermissionPage />;

  if (!user) return <MobileAuthForm />;

  // Optional: Uncomment if you want to show a holiday page
  // if (isHoliday) return <HolidayPage />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
