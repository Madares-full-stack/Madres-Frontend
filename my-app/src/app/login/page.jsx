"use client";

import React, { useState } from "react";
import api from "@/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");

    try {
      const res = await api.post("/auth/login", { email, password });
      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", user._id || user.id);
      localStorage.setItem("role", user.role);
     localStorage.setItem("user", JSON.stringify({ name: user.name, role: user.role }))


      toast.success("Login successful");

      switch (user.role) {
        case "admin":   router.push("/dashboard/admin");   break;
        case "teacher": router.push("/dashboard/teacher"); break;
        case "student": router.push("/dashboard/student"); break;
        case "parent":  router.push("/dashboard/parent");  break;
        default:        router.push("/");
      }
    } catch (err) {
      toast.error(err.message );
    }
  };

  return (
    <div className="login-page">
      <Toaster />
      <div className="row g-0 min-vh-100">
        <div className="col-md-6 login-left d-none d-md-flex">
          <div className="logo">Mad<span>ares</span></div>
          <p className="tagline">School Management System</p>
          <img
            src="jaredd-craig-HH4WBGNyltc-unsplash.jpg"
            alt="school"
            className="img-fluid"
          />
        </div>

        <div className="col-md-6 login-right">
          <div className="login-card">

            <div className="brand-circle">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            </div>

            <h2>Welcome back</h2>
            <p className="sub">Sign in to your account</p>

            <form onSubmit={login}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="ahmed@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-eye"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label="Toggle password"
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <a href="#" className="forgot-link">Forgot password?</a>

              <button type="submit" className="btn-login">
                Sign in
              </button>
            </form>

            <p className="footer-txt">
              Don't have an account? <a href="/register">Create one</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;