// @ts-nocheck

import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import type { LoginSignUpFormProps } from "../../types";
import { AlertTriangle } from "lucide-react";
import { useRegisterValidation } from "../../hooks/useRegisterValidation";
import FormInput from "../shared/FormInput";
import PasswordCriteria from "./PasswordCriteria";

export default function RegisterForm({
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
  message,
}: LoginSignUpFormProps) {
  type RegisterFormData = {
    email: string;
    username: string; // <-- required
    password: string;
    confirmPassword: string;
  };
  const isMobile = useIsMobile();
  const [submitted, setSubmitted] = useState(false);

  const { errors } = useRegisterValidation(formData);
  const hasErrors = submitted && Object.keys(errors).length > 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length === 0) handleSubmit(e);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`bg-white flex flex-col justify-center h-full ${
        isMobile ? "p-4" : "p-12"
      } text-center space-y-4`}
    >
      <div className="text-center space-y-2">
        <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800">Create new account</h1>
        <p className="text-sm text-gray-500">Sign up to get started</p>
      </div>

      {hasErrors && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle size={18} />
          All fields are required or invalid.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Email address"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          error={submitted ? errors.email : ""}
        />
        <FormInput
          label="Username"
          name="username"
          type="text"
          required
          value={formData.username}
          onChange={handleChange}
          error={submitted ? errors.username : ""}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Create password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          error={submitted ? errors.password : ""}
        />
        <FormInput
          label="Confirm password"
          name="confirmPassword"
          type="password"
          required
          value={formData?.confirmPassword}
          onChange={handleChange}
          error={submitted ? errors.confirmPassword : ""}
        />
      </div>

      <PasswordCriteria password={formData.password} showColors={submitted} />

      {error && <div className="text-red-700 text-sm">{error}</div>}
      {message && <div className="text-green-700 text-sm">{message}</div>}

      <button
        disabled={loading}
        className="w-full bg-rose-500 text-white rounded-full px-8 py-3 text-sm font-bold uppercase mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
