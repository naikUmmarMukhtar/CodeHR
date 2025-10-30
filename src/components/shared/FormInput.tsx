import { useState } from "react";

type Props = {
  label: string;
  type?: string; // optional, defaults to "password"
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
};

export default function FormInput({
  label,
  type = "password",
  name,
  value,
  onChange,
  error,
  required,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full text-left space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type={inputType}
          name={name}
          placeholder={label}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 pr-10 bg-gray-100 rounded-md focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-400" : "focus:ring-rose-400"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
