import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* First Section */}
      <div className="features">
        <div className="feature-box"> <h3 className="hover-green">Easy</h3> <p>ShortURL is easy and fast, enter the long link to get your shortened link</p> </div>
        <div className="feature-box"> <h3 className="hover-red">Shortened</h3> <p>Use any link, no matter what size, ShortURL always shortens</p> </div>
        <div className="feature-box"> <h3 className="hover-green">Secure</h3> <p>It is fast and secure, our service has HTTPS protocol and data encryption</p> </div>
        <div className="feature-box"> <h3 className="hover-green">Statistics</h3> <p>Check the number of clicks that your shortened URL received</p> </div>
        <div className="feature-box"> <h3 className="hover-red">Reliable</h3> <p>All links that try to disseminate spam, viruses and malware are deleted</p> </div>
        <div className="feature-box"> <h3 className="hover-green">Devices</h3> <p>Compatible with smartphones, tablets and desktops</p> </div>
      </div>

      {/* Second Section */}
      <div className="footer-main">
        <div className="footer-links">
          <a  href="#">Report Malicious URL</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
        <div className="social-links">
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-linkedin"></i></a>
        </div>
        <p className="copyright">© 2025 ShortURL. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
