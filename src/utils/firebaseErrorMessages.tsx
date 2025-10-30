const firebaseErrorMessages: Record<string, string> = {
  "auth/invalid-credential": "Invalid email or password. Please try again.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/email-already-in-use": "This email is already registered.",
  "auth/weak-password": "Password should be at least 6 characters long.",
  "auth/invalid-email": "The email address is badly formatted.",
  "auth/network-request-failed":
    "Network error. Please check your internet connection.",
};

export default firebaseErrorMessages;
