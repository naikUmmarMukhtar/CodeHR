// @ts-nocheck
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { showSuccessToast } from "../../utils/toastMessage";
import firebaseErrorMessages from "../../utils/firebaseErrorMessages";
import { postToFirebase } from "../../api/firebaseAPI";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearFields = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { username, email, password, confirmPassword } = formData;

    try {
      if (!isLogin && password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (!userCredential.user.emailVerified) {
          setError("Please verify your email before logging in.");
          await signOut(auth);
          setLoading(false);
          return;
        }
        showSuccessToast("Login successful.");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // await updateProfile(user, {
        //   displayName: name || email.split("@")[0],
        // });

        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("User not authenticated");
        await sendEmailVerification(user, {
          url: "https://hrm.codestrix.in/",
        });
        await signOut(auth);
        setIsLogin(true);

        await postToFirebase(`${uid}/userDetails`, {
          userName: username,
          email: email,
          password: password,
          createdAt: new Date().toISOString(),
        });

        await signOut(auth);
        setTimeout(() => {
          setIsLogin(true);
        }, [2000]);
        setMessage("Account created successfully. Please log in.");
      }

      clearFields();
    } catch (err: any) {
      const validMessage =
        firebaseErrorMessages[err.code] ||
        "Something went wrong. Please try again.";
      setError(validMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="relative h-full overflow-hidden transition-all duration-500"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <div
          className={`flex w-[200%] transition-transform duration-700 ease-in-out ${
            isLogin ? "translate-x-0" : "-translate-x-1/2"
          }`}
        >
          {/* LOGIN PANEL */}
          <div className="w-1/2 flex flex-col justify-center">
            <LoginForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
              error={error}
              message={message}
            />
            <p
              className="mt-4 text-sm text-center"
              style={{ color: "var(--color-text-muted)" }}
            >
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  clearFields();
                  setError("");
                  setMessage("");
                }}
                style={{
                  color: "var(--color-primary)",
                  fontWeight: 600,
                }}
              >
                Sign Up
              </button>
            </p>
          </div>

          <div className="w-1/2 flex flex-col justify-center">
            <RegisterForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
              error={error}
              message={message}
            />
            <p
              className="mt-4 text-sm text-center"
              style={{ color: "var(--color-text-muted)" }}
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  clearFields();
                  setError("");
                  setMessage("");
                }}
                style={{
                  color: "var(--color-primary)",
                  fontWeight: 600,
                }}
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
