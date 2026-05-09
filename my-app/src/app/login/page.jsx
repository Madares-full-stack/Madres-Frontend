"use client";

import React, { useState } from "react";
import api from "@/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password ) {
      return toast.error("Please fill all fields");
    }

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user",user.name)

      toast.success("Login successful");

    switch (user.role) {
      case "admin":
        router.push("/dashboard/admin");
        break;

      case "teacher":
        router.push("/dashboard/teacher");
        break;

      case "student":
        router.push("/dashboard/student");
        break;

      case "parent":
        router.push("/dashboard/parent");
        break;

      default:
        router.push("/");
    }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <Toaster />

      <div className="row min-vh-100">

        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-dark text-white">
          <div className="text-center px-5">
            <h1 className="fw-bold p-2 nav-logo">Mad<span >ares</span></h1>

            <p className="fs-6">
               Management System
            </p>

            <img
              src="jaredd-craig-HH4WBGNyltc-unsplash.jpg"
              alt="school"
              className="img-fluid mt-4"
              style={{ maxHeight: "350px" }}
            />
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div
            className="card shadow-lg border-0 p-4 rounded-4"
            style={{ width: "100%", maxWidth: "450px" }}
          >
            <div className="text-center mb-4">
              <h2 className="fw-bold">Login</h2>
              <p className="text-muted">
                Login to your account
              </p>
            </div>

            <form onSubmit={login}>


              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control rounded-3"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>


              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control rounded-3"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 rounded-3 py-2 fw-bold"
              >
                Login
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;