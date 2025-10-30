import { useState } from "react";

export function useLoginValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  const validate = (formData: { email: string; password: string }) => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    setShowErrors(true);
    return newErrors;
  };

  const resetValidation = () => {
    setErrors({});
    setShowErrors(false);
  };

  return { errors, showErrors, validate, resetValidation };
}
