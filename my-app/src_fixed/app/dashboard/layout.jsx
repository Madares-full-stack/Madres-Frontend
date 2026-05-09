"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { MessageCircle, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");

    setUserName(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <div className="min-vh-100 bg-light">
      <Toaster />

      <div
        className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
        style={{
          backgroundColor: "#122438",
        }}
      >
        <div className="fw-bold fs-4 text-white">
          Mad<span style={{ color: "#f97316" }}>ares</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="position-relative">
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="d-flex align-items-center gap-2 text-white cursor-pointer "
              style={{
                cursor: "pointer",
              }}
            >
              <div
                className="rounded-circle d-flex justify-content-center align-items-center "
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#22c55e",
                }}
              >
                <User size={18} />
              </div>
            </div>
            {showMenu && (
              <div
                className="position-absolute end-0 mt-2 bg-white shadow rounded-3 p-2  "
                style={{
                  width: "170px",
                  zIndex: 1000,
                }}
              >
                <small className="d-flex justify-content-center  ">
                  {userName}
                </small>

                <Link href="/message" className="text-decoration-none">
                  <div
                    className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                    style={{
                      backgroundColor: "#1e293b",
                      color: "white",
                    }}
                  >
                    <MessageCircle size={18} />
                    <span>Messages</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div >{children}</div>
    </div>
  );
};

export default Layout;
