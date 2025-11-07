// @ts-nocheck
import { useIsMobile } from "../../hooks/useIsMobile";
import FormInput from "../shared/FormInput";
import AuthHeader from "./AuthHeader";

export default function AdminLogin({
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
}: {
  formData: { email: string; password: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error?: string;
}) {
  const isMobile = useIsMobile();

  const onSubmit = (e) => {
    e.preventDefault();
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
      <AuthHeader mode="adminLogin" />

      {/* 🔹 Input Fields */}
      <div className="w-full space-y-4">
        <FormInput
          label="Admin Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* 🔹 Error Message */}
      {error && (
        <div
          className="text-sm font-medium"
          style={{ color: "var(--color-accent)" }}
        >
          {error}
        </div>
      )}

      {/* 🔹 Submit Button */}
      <button
        type="submit"
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
        {loading ? "Logging in..." : "Login as Admin"}
      </button>
    </form>
  );
}
