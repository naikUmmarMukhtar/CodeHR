// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield } from "lucide-react";
import AdminAuthForm from "./AdminAuthForm";
import EmployeeAuthForm from "./EmployeeAuthForm";
import { showErrorToast, showSuccessToast } from "../../utils/toastMessage";
import { useAuthForm } from "../../hooks/useAuthForm";
import { checkIfAdmin, checkIfEmployee } from "../../utils/checkUserType";
import { ADMIN_CODE, EMP_CODE } from "../../lib/constants";

export default function AuthForm() {
  const [adminSlide, setAdminSlide] = useState(false);
  const [switchToEmployeeLogin, setSwitchToEmployeeLogin] = useState(false);
  const [switchToAdminLogin, setSwitchToAdminLogin] = useState(false); // ✅ new

  const [formData, setFormData] = useState({
    isAdmin: false,
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });

  const navigate = useNavigate();
  const {
    loading,
    error,
    message,
    setError,
    setMessage,
    handleEmployeeLogin,
    handleEmployeeRegister,
    handleAdminLogin,
    handleAdminRegister,
  } = useAuthForm();

  // 🔹 Clear form
  const clearFields = () => {
    setFormData({
      isAdmin: adminSlide,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      adminCode: "",
    });
    setError("");
    setMessage("");
  };

  // 🔹 Employee Submit
  const handleEmployeeSubmit = async (e, mode) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const { username, email, password, confirmPassword, empCode } = formData;
    if (mode == "register" && empCode !== EMP_CODE) {
      showErrorToast("Invalid Employee Code");
      return;
    }

    try {
      const isAdmin = await checkIfAdmin(email);
      if (isAdmin) {
        showErrorToast("This is an admin account. Please use admin login.");
        return;
      }

      if (mode === "login") {
        const user = await handleEmployeeLogin(email, password);
        if (user) {
          showSuccessToast("Logged in successfully!");
        }
      } else {
        const res = await handleEmployeeRegister(
          username,
          email,
          password,
          confirmPassword
        );

        if (res?.status === "registered") {
          showSuccessToast(
            "Registration successful! Please verify your email."
          );
          setSwitchToEmployeeLogin(true); // ✅ Switch employee form to login
        }
      }
    } catch (err) {
      console.error("Employee Auth Error:", err);
      setError("Authentication failed. Please try again.");
    }
  };

  // 🔹 Admin Submit
  const handleAdminSubmit = async (e, mode) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const { username, email, password, confirmPassword, adminCode } = formData;
    if (mode == "register" && adminCode !== ADMIN_CODE) {
      showErrorToast("Invalid Admin Code");
      return;
    }

    try {
      const isEmployee = await checkIfEmployee(email);
      if (isEmployee) {
        showErrorToast(
          "This is an employee account. Please use employee login."
        );
        return;
      }

      if (mode === "login") {
        const user = await handleAdminLogin(email, password);
        if (user) {
          showSuccessToast("Logged in successfully!");
        }
      } else {
        const res = await handleAdminRegister(
          username,
          email,
          password,
          confirmPassword,
          adminCode
        );

        if (res?.status === "registered") {
          showSuccessToast("Admin registration successful! Please log in.");
          setSwitchToAdminLogin(true); // ✅ Switch admin form to login
        }
      }
    } catch (err) {
      console.error("Admin Auth Error:", err);
      setError("Authentication failed. Please try again.");
    }
  };

  const toggleMode = (isAdmin) => {
    setAdminSlide(isAdmin);
    clearFields();
    setFormData((prev) => ({ ...prev, isAdmin }));
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center transition-all duration-500 pb-24">
        <div
          className="relative w-full max-w-5xl mx-4 md:mx-8 rounded-2xl overflow-hidden transition-all duration-500"
          style={{
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
          }}
        >
          <div
            className="flex w-[200%] transition-transform duration-700 ease-in-out"
            style={{
              transform: !adminSlide ? "translateX(0%)" : "translateX(-50%)",
            }}
          >
            {/* Employee Form */}
            <div className="w-1/2 py-10 flex flex-col justify-center transition-all">
              <EmployeeAuthForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleEmployeeSubmit}
                loading={loading}
                error={error}
                message={message}
                switchToLogin={switchToEmployeeLogin}
                onSwitchedToLogin={() => setSwitchToEmployeeLogin(false)}
              />
            </div>

            {/* Admin Form */}
            <div className="w-1/2 py-10 flex flex-col justify-center transition-all">
              <AdminAuthForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleAdminSubmit}
                loading={loading}
                error={error}
                message={message}
                switchToLogin={switchToAdminLogin} // ✅ new prop
                onSwitchedToLogin={() => setSwitchToAdminLogin(false)} // ✅ reset
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Switch */}
      <div
        className="fixed bottom-0 left-0 w-full flex justify-center gap-4 py-4 backdrop-blur-lg border-t transition-all duration-300 z-50"
        style={{
          backgroundColor: "rgba(255,255,255,0.5)",
          borderColor: "var(--color-border)",
        }}
      >
        <button
          onClick={() => toggleMode(false)}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
            !adminSlide
              ? "bg-[var(--color-primary)] text-white scale-105"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
          }`}
        >
          <User size={18} /> Employee
        </button>

        <button
          onClick={() => toggleMode(true)}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
            adminSlide
              ? "bg-[var(--color-leave)] text-white scale-105"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-leave)]"
          }`}
        >
          <Shield size={18} /> Admin
        </button>
      </div>
    </>
  );
}
