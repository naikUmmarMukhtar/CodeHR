// @ts-nocheck
import { useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { AlertTriangle } from "lucide-react";
import { useRegisterValidation } from "../../hooks/useRegisterValidation";
import { useLoginValidation } from "../../hooks/useLoginValidation";
import FormInput from "../shared/FormInput";
import AuthHeader from "./AuthHeader";
import PasswordCriteria from "./PasswordCriteria";

export default function AdminAuthForm({
  formData,
  setFormData,
  handleSubmit,
  loading,
  error,
  message,
  switchToLogin, // ✅ new
  onSwitchedToLogin, // ✅ new
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    mode: "login" | "register"
  ) => void;
  loading: boolean;
  error?: string;
  message?: string;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitted, setSubmitted] = useState(false);
  const isRegister = mode === "register";
  const isMobile = useIsMobile();

  useEffect(() => {
    if (switchToLogin) {
      setMode("login");
      setSubmitted(false);
      onSwitchedToLogin?.(); // reset flag
    }
  }, [switchToLogin]);

  // ✅ Hooks for validation
  const { errors: registerErrors } = useRegisterValidation(formData);
  const { errors: loginErrors, validate } = useLoginValidation();

  // ✅ Derived state
  const hasErrors =
    submitted && isRegister && Object.keys(registerErrors).length > 0;

  // ✅ Handle submit
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isRegister) {
      setSubmitted(true);
      if (Object.keys(registerErrors).length > 0) return; // block invalid register
    } else {
      const loginErrs = validate(formData);
      if (Object.keys(loginErrs).length > 0) return; // block invalid login
    }

    handleSubmit(e, mode);
  };

  // ✅ Handle mode toggle
  const toggleMode = () => {
    setSubmitted(false);
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className={`flex flex-col justify-center items-center  text-center`}
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      {/* Header */}
      <AuthHeader mode={isRegister ? "adminRegister" : "adminLogin"} />

      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-center text-center space-y-6 w-full max-w-xl"
      >
        {/* Validation Warning */}
        {hasErrors && (
          <div
            className="flex items-center gap-2 text-sm p-2 rounded-md justify-center"
            style={{ color: "var(--color-accent)" }}
          >
            <AlertTriangle size={18} />
            <span>Fill all required fields correctly</span>
          </div>
        )}

        {/* Input Fields */}
        <div
          className={`grid ${
            isRegister
              ? "grid-cols-1 md:grid-cols-2 gap-4"
              : "grid-cols-1 gap-4"
          }`}
        >
          {/* Register-only field */}
          {isRegister && (
            <FormInput
              label="Full Name"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={submitted ? registerErrors.username : ""}
              required
            />
          )}

          <FormInput
            label={isRegister ? "Email Address" : "Admin Email"}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={
              isRegister
                ? submitted
                  ? registerErrors.email
                  : ""
                : loginErrors.email
            }
            required
          />

          <FormInput
            label={isRegister ? "Create Password" : "Password"}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={
              isRegister
                ? submitted
                  ? registerErrors.password
                  : ""
                : loginErrors.password
            }
            required
          />

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
                label="Admin Secret Code"
                name="adminCode"
                type="text"
                value={formData.adminCode}
                onChange={handleChange}
                error={submitted ? registerErrors.adminCode : ""}
                required
              />
            </>
          )}
        </div>

        {/* Password Criteria */}
        {isRegister && (
          <PasswordCriteria
            password={formData.password}
            showColors={submitted}
          />
        )}

        {/* Error / Success Messages */}
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
              ? "Registering..."
              : "Logging in..."
            : isRegister
            ? "Register as Admin"
            : "Login as Admin"}
        </button>
      </form>

      {/* Toggle Mode */}
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
              Login here
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
              Register as Admin
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
