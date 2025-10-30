import { LogOut, MapPin } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { showSuccessToast, showErrorToast } from "../../utils/toastMessage";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      showSuccessToast("Logged out successfully.");
      navigate("/");
    } catch {
      showErrorToast("Logout failed. Try again.");
    }
  };

  return (
    <header className="p-4 bg-[var(--color-bg)] shadow-md flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-xl font-extrabold text-[var(--color-primary)] flex items-center gap-2">
        <MapPin className="text-[var(--color-secondary)]" /> CodeHR
      </h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-hover)] transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </header>
  );
}
