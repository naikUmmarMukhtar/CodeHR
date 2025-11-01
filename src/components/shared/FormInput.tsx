// @ts-nocheck
import { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type Props = {
  label: string;
  type?: string;
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
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        type={inputType}
        name={name}
        // required={required}
        value={value}
        onChange={onChange}
        error={!!error}
        placeholder={label}
        InputLabelProps={{
          style: { color: "var(--color-text-muted)" },
        }}
        inputProps={{
          style: {
            color: "var(--color-text)",
            borderRadius: "0.5rem",
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "var(--color-border)",
            },
            "&:hover fieldset": {
              borderColor: "var(--color-hover)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--color-primary)",
            },
            borderRadius: "0.75rem",
            transition: "all 0.2s ease-in-out",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "var(--color-primary)",
          },
        }}
        InputProps={{
          endAdornment: isPassword && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
                sx={{ color: "var(--color-text-muted)" }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <FormHelperText
          sx={{ color: "var(--color-accent)", marginLeft: "4px" }}
        >
          {error}
        </FormHelperText>
      )}
    </div>
  );
}
