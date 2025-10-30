import { useIsMobile } from "../../hooks/useIsMobile";
import { useLoginValidation } from "../../hooks/useLoginValidation";
import FormInput from "../shared/FormInput";
import type { LoginSignUpFormProps } from "../../types";

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate(formData);
    if (Object.keys(fieldErrors).length > 0) return;

    handleSubmit(e);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`bg-white flex flex-col items-center justify-center h-full ${
        isMobile ? "p-0" : "p-12"
      } text-center space-y-4`}
    >
      <div className="text-center space-y-2">
        <img
          src={"/logo.png"}
          alt="Company Logo"
          className="w-20 h-20 mx-auto"
        />
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to Counting House
        </h1>
        <p className="text-sm text-gray-500">Login to manage your finances</p>
      </div>

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

      {error && <div className="text-red-700 text-sm">{error}</div>}
      {message && <div className="text-green-700 text-sm">{message}</div>}

      <button
        disabled={loading}
        className="w-full bg-rose-500 text-white rounded-full px-8 py-3 text-sm font-bold uppercase mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
