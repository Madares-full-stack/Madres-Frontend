import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-copy">
        &copy; {new Date().getFullYear()} Madares. All rights reserved.
      </p>

      <div className="footer-links">
        <Link href="/contact">Contact</Link>
      </div>

    
    </footer>
  );
};

export default Footer;