// @ts-nocheck
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import firebaseErrorMessages from "../utils/firebaseErrorMessages";
import { getFromFirebase, postToFirebase } from "../api/firebaseAPI";

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
      showSuccessToast("Employee login successful!");
      return { user: userCredential.user, isAdmin: false };
    } catch (err) {
      setError(firebaseErrorMessages[err.code] || "Employee login failed.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Employee Register
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
      const uid = userCredential.user.uid;
      await postToFirebase(`/teammembers/${uid}/userDetails`, {
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });
      setMessage("Employee account created. Please log in.");
    } catch (err) {
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

      const admins = await getFromFirebase("/admins/");
      const isAdmin =
        admins &&
        Object.values(admins).some(
          (admin) => admin.email.toLowerCase() === email.toLowerCase()
        );

      if (!isAdmin) {
        await signOut(auth);
        setError("Not authorized as admin.");
        return null;
      }

      showSuccessToast("Welcome, Admin!");
      return { user: userCredential.user, isAdmin: true };
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
    const ADMIN_SECRET_CODE = "SECRET123";
    if (adminCode !== ADMIN_SECRET_CODE) {
      showErrorToast("Invalid admin code.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await postToFirebase("/admins/", {
        username,
        email,
        password,
        isAdmin: true,
        createdAt: new Date().toISOString(),
      });
      setMessage("Admin account created. Please log in.");
    } catch (err) {
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
