// @ts-nocheck
import { LogOut, Mail, User } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";

export default function AdminHeader({ admin }) {
  //   const handleLogout = async () => {
  //     try {
  //       await signOut(getAuth());
  //       showSuccessToast("Logged out successfully.");
  //     } catch {
  //       showErrorToast("Logout failed. Please try again.");
  //     }
  //   };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-(--color-border) pb-3 mb-4">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-(--color-primary)">
          Admin Dashboard
        </h1>
        <p className="text-sm text-(--color-text-muted) mt-1 flex flex-wrap items-center gap-2">
          <User className="w-4 h-4" /> {admin.username} •{" "}
          <Mail className="w-4 h-4" /> {admin.email}
        </p>
      </div>

      {/* <button
        onClick={handleLogout}
        className="mt-3 sm:mt-0 flex items-center gap-2 text-sm px-3 py-2 border border-(--color-border) rounded-md hover:bg-(--color-bg-alt) transition"
      >
        <LogOut className="w-4 h-4 text-(--color-primary)" /> Logout
      </button> */}
    </header>
  );
}
