//@ts-nocheck
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { showSuccessToast } from "../utils/toastMessage";
import firebaseErrorMessages from "../utils/firebaseErrorMessages";
import { getFromFirebase, postToFirebase } from "../api/firebaseAPI";

export const useAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleEmployeeLogin = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      showSuccessToast("Employee login successful!");
      return userCredential.user;
    } catch (err) {
      setError(firebaseErrorMessages[err.code] || "Login failed.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeRegister = async (
    name,
    email,
    password,
    confirmPassword
  ) => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      await postToFirebase(`/teammembers/${uid}/userDetails`, {
        userName: name,
        email,
        createdAt: new Date().toISOString(),
      });
      setMessage("Account created successfully. Please log in.");
    } catch (err) {
      setError(firebaseErrorMessages[err.code] || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

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
      return userCredential.user;
    } catch (err) {
      setError(firebaseErrorMessages[err.code] || "Admin login failed.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async (
    name,
    email,
    password,
    confirmPassword,
    adminCode
  ) => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const ADMIN_SECRET_CODE = "SECRET123";
    if (adminCode !== ADMIN_SECRET_CODE) {
      setError("Invalid admin code.");
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
        name,
        email,
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
