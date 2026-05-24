import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="craft-footer">
      <div className="craft-footer-content">
        <p className="footer-tagline">© 2026 CraftURL - Shorten. Craft. Conquer.</p>
        <div className="footer-links">
          <a href="#eula" className="footer-link">EULA</a>
          <span className="footer-divider">•</span>
          <a href="#privacy" className="footer-link">Privacy Scrolls</a>
          <span className="footer-divider">•</span>
          <a href="#terms" className="footer-link">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
