// @ts-nocheck
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate, Route, Routes } from "react-router";
import { auth } from "./firebase/config";
import Loader from "./components/shared/Loader";
import Home from "./pages/Home";
import MobileAuthForm from "./components/auth/AuthForm";
import HolidayPage from "./pages/HolidayPage";
import { FIXED_HOLIDAYS, WEEKEND_DAYS } from "./lib/constants";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHoliday, setIsHoliday] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const dayOfWeek = today.getDay();

    if (WEEKEND_DAYS.includes(dayOfWeek) || FIXED_HOLIDAYS.includes(todayStr)) {
      setIsHoliday(true);
    }
  }, []);

  if (loading) return <Loader />;

  if (!user) return <MobileAuthForm />;

  // if (isHoliday) return <HolidayPage />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
