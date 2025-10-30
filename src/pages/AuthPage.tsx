import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sand">
      <div className="bg-white shadow-lg rounded-xl p-6 w-80">
        <h1 className="text-xl font-bold text-airbnb-coral mb-4 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h1>
        {isSignup ? <RegisterForm /> : <LoginForm />}
        <button
          onClick={() => setIsSignup((s) => !s)}
          className="text-sm underline mt-4 block mx-auto"
        >
          {isSignup ? "Have an account? Login" : "No account? Sign up"}
        </button>
      </div>
    </div>
  );
}
