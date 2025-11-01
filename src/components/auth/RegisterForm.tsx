// @ts-nocheck

import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { AlertTriangle } from "lucide-react";
import { useRegisterValidation } from "../../hooks/useRegisterValidation";
import FormInput from "../shared/FormInput";
import PasswordCriteria from "./PasswordCriteria";
import ContentWrapper from "../shared/ContentWrapper";
import AuthHeader from "./AuthHeader";

export default function RegisterForm({
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
      className={`flex flex-col justify-center h-full  text-center space-y-6`}
    >
      <AuthHeader mode="register" />

      {hasErrors && (
        <div
          className="flex items-center gap-2 text-sm p-2 rounded-md justify-center"
          style={{
            color: "var(--color-accent)",
          }}
        >
          <AlertTriangle size={18} />
          <span>Fill All Required Fields</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="User Name (as per ID)"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          error={submitted ? errors.username : ""}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={submitted ? errors.email : ""}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Create Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={submitted ? errors.password : ""}
        />
        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={submitted ? errors.confirmPassword : ""}
        />
      </div>

      <PasswordCriteria password={formData.password} showColors={submitted} />

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
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
