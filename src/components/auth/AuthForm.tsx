// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield } from "lucide-react";
import AdminAuthForm from "./AdminAuthForm";
import EmployeeAuthForm from "./EmployeeAuthForm";
import { showErrorToast, showSuccessToast } from "../../utils/toastMessage";
import { useAuthForm } from "../../hooks/useAuthForm";
import { getFromFirebase } from "../../api/firebaseAPI";

export default function AuthForm() {
  const [slide, setSlide] = useState("employeeLogin");
  const [formData, setFormData] = useState({
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

  const clearFields = () => {
    setFormData({
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
    const { username, email, password, confirmPassword } = formData;

    try {
      if (mode === "login") {
        const user = await handleEmployeeLogin(email, password);
        if (user) {
          const admins = await getFromFirebase("/admins/");
          const adminExists = admins
            ? Object.values(admins).some((admin) => admin.email === email)
            : false;

          showSuccessToast("Welcome!");
          if (!adminExists) {
            showErrorToast("Cannot login as employee from admin portal.");
            return;
          }
          // navigate(adminExists ? "/admin-dashboard" : "/employee-dashboard");
        }
      } else {
        await handleEmployeeRegister(
          username,
          email,
          password,
          confirmPassword
        );
        setSlide("employeeLogin");
      }
    } catch (err) {
      console.error("Employee Auth Error:", err);
      setError("Login or registration failed. Please try again.");
    }
  };

  // 🔹 Admin Submit
  const handleAdminSubmit = async (e, mode) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const { username, email, password, confirmPassword, adminCode } = formData;

    try {
      if (mode === "login") {
        const admin = await handleAdminLogin(email, password);
        if (admin) {
          showSuccessToast("Welcome, Admin!");
          navigate("/admin-dashboard");
        }
      } else {
        await handleAdminRegister(
          username,
          email,
          password,
          confirmPassword,
          adminCode
        );
        setSlide("adminLogin");
      }
    } catch (err) {
      console.error("Admin Auth Error:", err);
      setError("Admin login or registration failed. Please try again.");
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center transition-all duration-500 pb-24"
        // style={{
        //   background:
        //     slide === "employeeLogin"
        //       ? "linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-alt) 100%)"
        //       : "linear-gradient(135deg, var(--color-leave-bg) 0%, var(--color-leave) 15%, var(--color-bg) 100%)",
        // }}
      >
        <div
          className="relative w-full max-w-5xl mx-4 md:mx-8 rounded-2xl overflow-hidden   transition-all duration-500"
          style={{
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
          }}
        >
          <div
            className="flex w-[200%] transition-transform duration-700 ease-in-out"
            style={{
              transform:
                slide === "employeeLogin"
                  ? "translateX(0%)"
                  : "translateX(-50%)",
            }}
          >
            <div className="w-1/2 py-10 flex flex-col justify-center transition-all">
              <EmployeeAuthForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleEmployeeSubmit}
                loading={loading}
                error={error}
                message={message}
              />
            </div>

            <div className="w-1/2 py-10 flex flex-col justify-center transition-all">
              <AdminAuthForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleAdminSubmit}
                loading={loading}
                error={error}
                message={message}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 w-full flex justify-center gap-4 py-4 backdrop-blur-lg border-t transition-all duration-300 z-50"
        style={{
          backgroundColor: "rgba(255,255,255,0.5)",
          borderColor: "var(--color-border)",
        }}
      >
        <button
          onClick={() => {
            setSlide("employeeLogin");
            clearFields();
          }}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300  ${
            slide === "employeeLogin"
              ? "bg-[var(--color-primary)] text-white scale-105"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
          }`}
        >
          <User size={18} />
          Employee
        </button>

        <button
          onClick={() => {
            setSlide("adminLogin");
            clearFields();
          }}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300  ${
            slide === "adminLogin"
              ? "bg-[var(--color-leave)] text-white scale-105"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-leave)]"
          }`}
        >
          <Shield size={18} />
          Admin
        </button>
      </div>
    </>
  );
}
