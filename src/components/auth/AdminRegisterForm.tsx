// @ts-nocheck
import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { AlertTriangle } from "lucide-react";
import { useRegisterValidation } from "../../hooks/useRegisterValidation";
import FormInput from "../shared/FormInput";
import AuthHeader from "./AuthHeader";
import PasswordCriteria from "./PasswordCriteria";

export default function AdminRegisterForm({
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
  message,
}) {
  const isMobile = useIsMobile();
  const [submitted, setSubmitted] = useState(false);
  const { errors } = useRegisterValidation(formData);
  const hasErrors = submitted && Object.keys(errors).length > 0;

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length === 0) handleSubmit(e);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col justify-center text-center space-y-6 ${
        isMobile ? "p-4" : "p-12"
      }`}
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      {/* 🔹 Header */}
      <AuthHeader mode="adminRegister" />

      {/* 🔹 Validation Warning */}
      {hasErrors && (
        <div
          className="flex items-center gap-2 text-sm p-2 rounded-md justify-center"
          style={{
            color: "var(--color-accent)",
          }}
        >
          <AlertTriangle size={18} />
          <span>Fill all required fields correctly</span>
        </div>
      )}

      {/* 🔹 Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Full Name"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          error={submitted ? errors.username : ""}
          required
        />

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={submitted ? errors.email : ""}
          required
        />

        <FormInput
          label="Create Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={submitted ? errors.password : ""}
          required
        />
        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={submitted ? errors.confirmPassword : ""}
          required
        />

        <FormInput
          label="Admin Secret Code"
          name="adminCode"
          type="text"
          value={formData.adminCode}
          onChange={handleChange}
          error={submitted ? errors.adminCode : ""}
          required
        />
      </div>

      {/* 🔹 Password Criteria */}
      <PasswordCriteria password={formData.password} showColors={submitted} />

      {/* 🔹 Error / Success Messages */}
      {error && (
        <div
          className="text-sm font-medium rounded-md p-2"
          style={{
            color: "var(--color-accent)",
          }}
        >
          {error}
        </div>
      )}
      {message && (
        <div
          className="text-sm font-medium rounded-md p-2"
          style={{
            color: "var(--color-secondary)",
          }}
        >
          {message}
        </div>
      )}

      {/* 🔹 Submit Button */}
      <button
        disabled={loading}
        className="w-full rounded-full py-3 text-sm font-bold uppercase mt-2 transition-all"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "white",
          opacity: loading ? 0.6 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-hover)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-primary)")
        }
      >
        {loading ? "Registering..." : "Register as Admin"}
      </button>
    </form>
  );
}
