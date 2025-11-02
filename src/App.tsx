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
import AttendanceHistory from "./pages/AttendanceHistory";
import MobileNav from "./components/shared/MobileNav";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHoliday, setIsHoliday] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    // Auth watcher
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Holiday / weekend check
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const dayOfWeek = today.getDay();
    if (WEEKEND_DAYS.includes(dayOfWeek) || FIXED_HOLIDAYS.includes(todayStr)) {
      setIsHoliday(true);
    }

    // Permission check
    const checkLocationPermission = async () => {
      if (!("geolocation" in navigator)) {
        setLocationAllowed(false);
        return;
      }

      try {
        if ("permissions" in navigator && navigator.permissions.query) {
          const permission = await navigator.permissions.query({
            name: "geolocation" as PermissionName,
          });

          // If already granted -> allow immediately
          if (permission.state === "granted") {
            setLocationAllowed(true);
          } else if (permission.state === "prompt") {
            // Not granted yet; show permission page (LocationPermissionPage will request)
            setLocationAllowed(false);
          } else {
            setLocationAllowed(false);
          }

          // React to external permission changes (user grants in browser UI)
          permission.onchange = () => {
            const granted = permission.state === "granted";
            setLocationAllowed(granted);
          };
        } else {
          // Fallback for browsers without permissions API (Safari older)
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

    // Optional: restore last known saved permission (not required but harmless)
    const saved = localStorage.getItem("locationAllowed");
    if (saved !== null) setLocationAllowed(saved === "true");

    checkLocationPermission();

    return () => {
      unsubscribe();
      // permission.onchange is cleaned up by browser when permission object is GC'd,
      // no extra removal here because we didn't store `permission` in outer scope.
    };
  }, []);

  // Persist the boolean for quicker load next time (optional)
  useEffect(() => {
    if (locationAllowed !== null) {
      try {
        localStorage.setItem("locationAllowed", String(locationAllowed));
      } catch {}
    }
  }, [locationAllowed]);

  // Render flow
  if (loading || locationAllowed === null) return <Loader />;

  // Pass setLocationAllowed as prop so LocationPermissionPage can set state directly
  if (!locationAllowed)
    return <LocationPermissionPage setLocationAllowed={setLocationAllowed} />;

  if (!user) return <MobileAuthForm />;

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
