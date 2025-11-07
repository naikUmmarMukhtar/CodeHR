// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import AdminLogin from "./AdminLogin";
import AdminRegisterForm from "./AdminRegisterForm";
import { showSuccessToast } from "../../utils/toastMessage";
import { useAuthForm } from "../../hooks/useAuthForm";

export default function AuthForm() {
  const [slide, setSlide] = useState("employeeLogin");
  const [formData, setFormData] = useState({
    name: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearFields = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      adminCode: "",
    });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { name, email, password, confirmPassword, adminCode } = formData;

    try {
      if (slide === "employeeLogin") {
        const user = await handleEmployeeLogin(email, password);
        if (user) {
          showSuccessToast("Welcome!");
          navigate("/employee-dashboard");
        }
      }

      if (slide === "employeeRegister") {
        await handleEmployeeRegister(name, email, password, confirmPassword);
        setSlide("employeeLogin");
      }

      if (slide === "adminLogin") {
        const admin = await handleAdminLogin(email, password);
        if (admin) {
          navigate("/admin-dashboard");
        }
      }

      if (slide === "adminRegister") {
        await handleAdminRegister(
          name,
          email,
          password,
          confirmPassword,
          adminCode
        );
        setSlide("adminLogin");
      }

      clearFields();
    } catch (err) {
      console.error("Error in form submission:", err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
        <div
          className={`flex w-[400%] transition-transform duration-500 ease-in-out`}
          style={{
            transform:
              slide === "employeeLogin"
                ? "translateX(0%)"
                : slide === "employeeRegister"
                ? "translateX(-25%)"
                : slide === "adminLogin"
                ? "translateX(-50%)"
                : "translateX(-75%)",
          }}
        >
          <div className="w-1/4 py-6 flex flex-col justify-center">
            <LoginForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
              error={error}
              message={message}
            />
            <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  setSlide("employeeRegister");
                  clearFields();
                }}
                className="text-[var(--color-primary)] font-semibold"
              >
                Sign Up
              </button>
            </p>
            <p
              className="mt-2 text-center text-sm underline cursor-pointer text-[var(--color-secondary)]"
              onClick={() => {
                setSlide("adminLogin");
                clearFields();
              }}
            >
              Login as Admin
            </p>
          </div>

          <div className="w-1/4 py-6 flex flex-col justify-center">
            <RegisterForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
              error={error}
              message={message}
            />
            <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setSlide("employeeLogin");
                  clearFields();
                }}
                className="text-[var(--color-primary)] font-semibold"
              >
                Log In
              </button>
            </p>
            <p
              className="mt-2 text-center text-sm underline cursor-pointer text-[var(--color-secondary)]"
              onClick={() => {
                setSlide("adminRegister");
                clearFields();
              }}
            >
              Register as Admin
            </p>
          </div>

          {/* Admin Login */}
          <div className="w-1/4 py-6 flex flex-col justify-center">
            <AdminLogin
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              error={error}
              loading={loading}
            />
            <p
              className="mt-4 text-center text-sm underline cursor-pointer text-[var(--color-secondary)]"
              onClick={() => setSlide("employeeLogin")}
            >
              Back to Employee Login
            </p>
            <p
              className="mt-2 text-center text-sm underline cursor-pointer text-[var(--color-secondary)]"
              onClick={() => {
                setSlide("adminRegister");
                clearFields();
              }}
            >
              Register as Admin
            </p>
          </div>

          {/* Admin Register */}
          <div className="w-1/4 py-6 flex flex-col justify-center">
            <AdminRegisterForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              error={error}
              message={message}
              loading={loading}
            />
            <p
              className="mt-4 text-center text-sm underline cursor-pointer text-[var(--color-secondary)]"
              onClick={() => setSlide("adminLogin")}
            >
              Back to Admin Login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
