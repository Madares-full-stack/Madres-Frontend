"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Notifications from "./Notifications";
import { MessageCircle, User, LogOut } from "lucide-react";

const Navbar = () => {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser({ name: storedUser });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
      style={{ backgroundColor: "#122438" }}
    >
      <div className="fw-bold fs-4 text-white">
        <Link href="/" className="text-decoration-none text-white">
          Mad<span style={{ color: "#f97316" }}>ares</span>
        </Link>
      </div>
     

      <div className="d-flex align-items-center gap-3">

        <Link href="/contact" className="text-white text-decoration-none">
          Contact
        </Link>

        {isLoggedIn ? (
          <>
            <Notifications user={user} />

            <div className="position-relative">
              <div
                onClick={() => setShowMenu(!showMenu)}
                className="d-flex align-items-center gap-2 text-white"
                style={{ cursor: "pointer" }}
              >
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: "38px",
                    height: "38px",
                    backgroundColor: "#22c55e",
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>

                <span>{user?.name || "User"}</span>
              </div>

              {showMenu && (
                <div
                  className="position-absolute end-0 mt-2 bg-white shadow rounded-3 p-2"
                  style={{ width: "180px", zIndex: 999 }}
                >
                  <Link
                    href="/message"
                    className="text-decoration-none d-block mb-2"
                  >
                    <div className="d-flex align-items-center gap-2 px-2 py-2 rounded-2 bg-dark text-white">
                      <MessageCircle size={16} />
                      Messages
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
          </>
        ) : (
          <>
            <Link href="/login" className="text-white">
              Login
            </Link>
            <Link href="/register" className="btn btn-warning btn-sm">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;