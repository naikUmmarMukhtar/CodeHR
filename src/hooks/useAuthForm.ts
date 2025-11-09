// @ts-nocheck
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import firebaseErrorMessages from "../utils/firebaseErrorMessages";
import { postToFirebase } from "../api/firebaseAPI";

export const useAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Employee Login
  const handleEmployeeLogin = async (email, password) => {
    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        await signOut(auth);
        return null;
      }

      return { user };
    } catch (err) {
      setError(firebaseErrorMessages[err.code] || "Employee login failed.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeRegister = async (
    username,
    email,
    password,
    confirmPassword
  ) => {
    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await postToFirebase(`/teammembers/${user.uid}/userDetails`, {
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      await sendEmailVerification(user, {
        url: "https://codestrixhrm.netlify.app/",
      });

      await signOut(auth);

      setMessage(
        "Verification email sent. Please check your inbox before logging in."
      );
      return { status: "registered" };
    } catch (err) {
      console.error("Employee registration error:", err);
      setError(
        firebaseErrorMessages[err.code] || "Employee registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Admin Login
  const handleAdminLogin = async (email, password) => {
    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        await signOut(auth);
        return null;
      }

      return { user };
    } catch (err) {
      setError(firebaseErrorMessages[err.code] || "Admin login failed.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Admin Register
  const handleAdminRegister = async (
    username,
    email,
    password,
    confirmPassword,
    adminCode
  ) => {
    try {
      setLoading(true);

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save admin data
      await postToFirebase("/admins/", {
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      // Send verification email
      await sendEmailVerification(user, {
        url: "https://codestrixhrm.netlify.app/",
      });

      // Sign out until verified
      await signOut(auth);

      setMessage(
        "Verification email sent. Please check your inbox before logging in."
      );
      return { status: "registered" };
    } catch (err) {
      console.error("Admin registration error:", err);
      setError(firebaseErrorMessages[err.code] || "Admin registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    message,
    setError,
    setMessage,
    handleEmployeeLogin,
    handleEmployeeRegister,
    handleAdminLogin,
    handleAdminRegister,
  };
};
