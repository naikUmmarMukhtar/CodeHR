import { CheckCircle, XCircle } from "lucide-react";
import { passwordCriteria } from "../../hooks/useRegisterValidation";

export default function PasswordCriteria({
  password = "",
  showColors = false,
}: {
  password: string;
  showColors?: boolean;
}) {
  return (
    <div className="text-sm mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
      {Object.entries(passwordCriteria).map(([key, { test, label }]) => {
        const passed = test(password);

        const baseColor = passed
          ? "text-green-600"
          : showColors && password.length > 0
          ? "text-red-500"
          : "text-gray-400";

        return (
          <span
            key={key}
            className={`flex items-center gap-2.5 transition-colors duration-200 ${baseColor}`}
          >
            {passed ? (
              <CheckCircle size={18} className="shrink-0" />
            ) : (
              <XCircle size={18} className="shrink-0" />
            )}
            <span>{label}</span>
          </span>
        );
      })}
    </div>
  );
}
