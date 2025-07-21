"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Loginpage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/login", user); // Adjust your endpoint
      if (response.status === 200) {
        router.push("/dashboard"); // Or wherever you want to redirect
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/Background.jpg')" }}
      />

      {/* Glossy dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10" />

      {/* Layout container */}
      <div className="relative z-20 min-h-screen flex items-center justify-start px-10">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-xl p-10 w-full max-w-lg text-white">
          <p className="uppercase text-sm text-gray-400 mb-2">
            {loading ? "Processing" : "Login"}
          </p>
          <h2 className="text-4xl font-bold mb-1">
            Welcome back<span className="text-blue-500">.</span>
          </h2>
          <p className="text-sm text-gray-300 mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>

          {/* Email input */}
          <input
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          {/* Password input */}
          <input
            className="w-full mb-6 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <div className="flex items-center justify-between gap-4">
            <button
              className="w-1/2 py-3 rounded-xl bg-gray-600 hover:bg-gray-500 transition-all"
              disabled
            >
              Change method
            </button>
            <button
              onClick={onLogin}
              className={`w-1/2 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all ${
                buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={buttonDisabled}
            >
              {buttonDisabled ? "No Login" : "Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
