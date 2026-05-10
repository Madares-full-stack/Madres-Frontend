"use client";

import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "../component/Navbar";


const Layout = ({ children }) => {
  return (
    <div className="min-vh-100 bg-light">
      <Toaster />

<Navbar/>

      <div>{children}</div>
    </div>
  );
};

export default Layout;