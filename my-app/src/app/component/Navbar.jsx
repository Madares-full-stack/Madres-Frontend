"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    Router.push("/");
  };

  return (
    <nav className="nav shadow-sm">
      <div className="nav-logo">
        Mad<span>ares</span>
      </div>

      <div className="nav-links gap-3">
        {isLoggedIn && (
          <>
            <Link className="nav-link text-white fw-medium px-3" href="/lessons">
              Lessons
            </Link>
            <Link className="nav-link text-white fw-medium px-3" href="/schedule">
              Schedule
            </Link>
          </>
        )}

        <Link className="text-decoration-none text-white px-3" href="/contact">
          Contact
        </Link>

        <div className="nav-btn ms-2">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="btn-primary ms-2">
                Log in
              </Link>
              <Link href="/register" className="btn-warning ms-2">
                Get started
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;