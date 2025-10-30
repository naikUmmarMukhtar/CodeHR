import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useIsMobile } from "./hooks/useIsMobile";
import { Navigate, Route, Routes } from "react-router";
import { auth } from "./firebase/config";
import Loader from "./components/shared/Loader";
import Home from "./pages/Home";
import MobileAuthForm from "./components/auth/MobileAuthForm";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;
  // if (!user || !user.emailVerified) return <MobileAuthForm />;
  if (!user) return <MobileAuthForm />;

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div
        className={`
            flex-1 overflow-y-auto bg-white transition-all duration-300 
            ${isMobile ? "flex justify-center py-12" : " flex p-4"}
          `}
      >
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
