// @ts-nocheck
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../firebase/config";
import { getFromFirebase } from "../api/firebaseAPI";
import {
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Edit2,
  Lock,
  Info,
  HelpCircle,
  FileText,
  LogOut,
  ShieldCheck,
  UserCircle,
  Camera,
} from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const uid = auth.currentUser?.uid;
  const userEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) return;
      setIsLoading(true);
      try {
        const data = await getFromFirebase(`/teammembers/${uid}/userDetails`);
        console.log("Fetched data:", data);

        const firstKey = Object.keys(data || {})[0];
        const userData = data?.[firstKey] || {};

        setProfile({
          name: userData.username || "User Name",
          email: userData.email || userEmail || "example@mail.com",
          address: userData.department || "Software Engineer",
          memberSince: userData.memberSince || "05-September-2025",
          status: userData.status || "Active Member",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [uid, userEmail]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-sm text-var(--color-black)">
        Loading profile...
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      showSuccessToast("Logged out successfully.");
      navigate("/");
    } catch {
      showErrorToast("Logout failed. Please try again.");
    }
  };

  return (
    <div
      className="w-full max-w-md mx-auto mt-6 px-5 pb-24 text-[15px]"
      style={{ color: "var(--color-text)" }}
    >
      <h1 className="text-center text-lg font-semibold mb-5">
        Profile Overview
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full border border-(--color-border) overflow-hidden mx-auto">
            <UserCircle
              size={90}
              style={{ color: "var(--color-text-muted)" }}
              className="mx-auto mt-1"
            />
          </div>
          <button
            className="absolute bottom-2 right-0 p-1.5 rounded-full"
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "var(--color-bg)",
            }}
          >
            <Camera size={15} />
          </button>
        </div>

        <h2
          className="mt-3 text-lg font-semibold uppercase tracking-wide max-w-[220px] truncate mx-auto"
          title={profile.name}
        >
          {profile.name}
        </h2>
        <p className="text-sm flex justify-center items-center gap-1 text-(--color-text-muted)">
          <MapPin size={14} />
          {profile.address}
        </p>
        <div
          className="mt-2 inline-block text-xs font-medium px-3 py-1 rounded-full"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-bg)",
          }}
        >
          {profile.status}
        </div>
      </motion.div>

      <hr
        className="my-6 border-t"
        style={{ borderColor: "var(--color-border)" }}
      />
      <div>
        {/* <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Contact Info</h3>
          <Edit2
            size={16}
            style={{ color: "var(--color-text-muted)" }}
            className="cursor-pointer"
          />
        </div> */}

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail size={16} style={{ color: "var(--color-secondary)" }} />
            <span>{profile.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays
              size={16}
              style={{ color: "var(--color-secondary)" }}
            />
            <span>Member Since {profile.memberSince}</span>
          </div>
        </div>
      </div>

      <hr
        className="my-6 border-t"
        style={{ borderColor: "var(--color-border)" }}
      />

      <div>
        <h3 className="font-semibold mb-3">Account</h3>
        <div className="space-y-4">
          <div
            className="flex items-center gap-2 text-var(--color-primary) mt-3 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-xs text-(--color-text-muted)">
        CodeStrix HRM v1.0.1
        <br />
        <span className="flex justify-center items-center gap-1 mt-1">
          Made with <span className="text-red-500">❤️</span> for CodeStrix Staff
        </span>
      </div>
    </div>
  );
}
