export const passwordCriteria = {
  length: { test: (v: string) => v.length >= 8, label: "Min 8 characters" },
  uppercase: {
    test: (v: string) => /[A-Z]/.test(v),
    label: "1 uppercase letter",
  },
  lowercase: {
    test: (v: string) => /[a-z]/.test(v),
    label: "1 lowercase letter",
  },
  number: { test: (v: string) => /[0-9]/.test(v), label: "1 number" },
  special: {
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
    label: "1 special character",
  },
};

export function useRegisterValidation(formData: {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}) {
  const errors: Record<string, string> = {};

  if (!formData.email) errors.email = "Email is required";
  if (!formData.username) errors.username = "Username is required";
  if (!formData.password) errors.password = "Password is required";
  else {
    const failed = Object.values(passwordCriteria).filter(
      (c) => !c.test(formData.password)
    );
    if (failed.length) errors.password = "Password does not meet criteria";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return { errors };
}
