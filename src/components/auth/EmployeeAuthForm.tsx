//@ts-nocheck
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useRegisterValidation } from "../../hooks/useRegisterValidation";
import { useLoginValidation } from "../../hooks/useLoginValidation";
import FormInput from "../shared/FormInput";
import PasswordCriteria from "./PasswordCriteria";
import AuthHeader from "./AuthHeader";

export default function EmployeeAuthForm({
  formData,
  setFormData,
  handleSubmit,
  loading,
  error,
  message,
  switchToLogin, // ✅ new prop
  onSwitchedToLogin, // ✅ callback to reset
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const isRegister = mode === "register";
  const [submitted, setSubmitted] = useState(false);
  const isMobile = useIsMobile();

  const { errors: registerErrors } = useRegisterValidation(formData);
  const {
    errors: loginErrors,
    validate: validateLogin,
    resetValidation,
  } = useLoginValidation();

  const hasRegisterErrors =
    submitted && isRegister && Object.keys(registerErrors).length > 0;

  // ✅ Automatically switch to login mode when registration completes
  useEffect(() => {
    if (switchToLogin && isRegister) {
      setMode("login");
      onSwitchedToLogin?.();
      resetValidation();
      setSubmitted(false);
    }
  }, [switchToLogin]);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (isRegister) {
      if (Object.keys(registerErrors).length > 0) return;
    } else {
      const loginErrs = validateLogin(formData);
      if (Object.keys(loginErrs).length > 0) return;
    }

    handleSubmit(e, mode);
  };

  const toggleMode = () => {
    setSubmitted(false);
    resetValidation();
    setMode(isRegister ? "login" : "register");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className={`flex flex-col justify-center items-center  text-center`}
      style={{
        color: "var(--color-text)",
      }}
    >
      <AuthHeader mode={isRegister ? "employeeRegister" : "employeeLogin"} />

      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-center text-center space-y-6 w-full max-w-xl"
      >
        {/* Validation Warning */}
        {hasRegisterErrors && (
          <div
            className="flex items-center gap-2 text-sm p-2 rounded-md justify-center"
            style={{ color: "var(--color-accent)" }}
          >
            <AlertTriangle size={18} />
            <span>Fill all required fields correctly</span>
          </div>
        )}

        <div
          className={`grid ${
            isRegister
              ? "grid-cols-1 md:grid-cols-2 gap-4"
              : "grid-cols-1 gap-4"
          }`}
        >
          {/* Username only in Register */}
          {isRegister && (
            <FormInput
              label="User Name (as per ID)"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={submitted ? registerErrors.username : ""}
              required
            />
          )}

          {/* Email */}
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={
              submitted
                ? isRegister
                  ? registerErrors.email
                  : loginErrors.email
                : ""
            }
            required
          />

          {/* Password */}
          <FormInput
            label={isRegister ? "Create Password" : "Password"}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={
              submitted
                ? isRegister
                  ? registerErrors.password
                  : loginErrors.password
                : ""
            }
            required
          />

          {/* Confirm Password (Register only) */}
          {isRegister && (
            <>
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={submitted ? registerErrors.confirmPassword : ""}
                required
              />

              <FormInput
                label="Employee Code"
                name="empCode"
                type="text"
                value={formData.empCode}
                onChange={handleChange}
                error={submitted ? registerErrors.empCode : ""}
                required
              />
            </>
          )}
        </div>

        {/* Password Criteria (only on register) */}
        {isRegister && (
          <PasswordCriteria
            password={formData.password}
            showColors={submitted}
          />
        )}

        {/* Error / Message */}
        {error && (
          <div
            className="text-sm font-medium rounded-md p-2"
            style={{ color: "var(--color-accent)" }}
          >
            {error}
          </div>
        )}
        {message && (
          <div
            className="text-sm font-medium rounded-md p-2"
            style={{ color: "var(--color-secondary)" }}
          >
            {message}
          </div>
        )}

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full rounded-full py-3 text-sm font-bold uppercase mt-2 transition-all"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? isRegister
              ? "Signing up..."
              : "Logging in..."
            : isRegister
            ? "Sign Up"
            : "Log In"}
        </button>
      </form>

      {/* Toggle Between Login/Register */}
      <div className="mt-6 text-sm">
        {isRegister ? (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold underline"
              style={{ color: "var(--color-secondary)" }}
            >
              Log in here
            </button>
          </p>
        ) : (
          <p>
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold underline"
              style={{ color: "var(--color-secondary)" }}
            >
              Sign up as Employee
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
