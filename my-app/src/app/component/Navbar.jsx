"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const Router =useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    Router.push("/")
  };

  return (
    <nav className="nav">
      <div className="nav-logo">
        Mad<span>ares</span>
      </div>

      <div className="nav-links gap-3">
        <Link className="text-decoration-none text-white" href="/contact">
          Contact
        </Link>

      <div className="nav-btn">
        {!isLoggedIn ? (
          <>
            <Link href="/login" className="btn-primary">
              Log in
            </Link>
            <Link href="/register" className="btn-warning">
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