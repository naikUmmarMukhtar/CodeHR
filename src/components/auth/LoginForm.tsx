// @ts-nocheck
import { useIsMobile } from "../../hooks/useIsMobile";
import { useLoginValidation } from "../../hooks/useLoginValidation";
import FormInput from "../shared/FormInput";
import type { LoginSignUpFormProps } from "../../types";
import AuthHeader from "./AuthHeader";

export default function LoginForm({
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
  message,
}: LoginSignUpFormProps) {
  const isMobile = useIsMobile();
  const { errors, showErrors, validate } = useLoginValidation();

  const onSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = validate(formData);
    if (Object.keys(fieldErrors).length > 0) return;
    handleSubmit(e);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col items-center justify-center ${
        isMobile ? "p-4" : "p-12"
      } text-center space-y-6`}
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      {/* 🔹 Header */}
      <AuthHeader mode="login" />

      {/* 🔹 Input Fields */}
      <div className="w-full space-y-4">
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData?.email}
          onChange={handleChange}
          error={showErrors ? errors.email : undefined}
          required
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formData?.password}
          onChange={handleChange}
          error={showErrors ? errors.password : undefined}
          required
        />
      </div>

      {/* 🔹 Error / Success Messages */}
      {error && (
        <div
          className="text-sm font-medium"
          style={{ color: "var(--color-accent)" }}
        >
          {error}
        </div>
      )}
      {message && (
        <div
          className="text-sm font-medium"
          style={{ color: "var(--color-secondary)" }}
        >
          {message}
        </div>
      )}

      {/* 🔹 Login Button */}
      <button
        disabled={loading}
        className="w-full rounded-full px-8 py-3 text-sm font-bold uppercase mt-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-bg)",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-hover)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-primary)")
        }
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
