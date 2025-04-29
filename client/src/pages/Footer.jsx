import React from "react";
import "./Footer.css";
import { toast } from 'react-hot-toast';

const Footer = () => {
  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Generate short URLs instantly with our optimized service"
    },
    {
      icon: "🔒",
      title: "Secure",
      description: "Your data is protected with HTTPS encryption"
    },
    {
      icon: "📊",
      title: "Analytics",
      description: "Track clicks and monitor your link performance"
    },
    {
      icon: "🌐",
      title: "Reliable",
      description: "High availability and uptime for your shortened URLs"
    }
  ];

  const handleFeatureClick = (e) => {
    e.preventDefault();
    // Changed from toast.info to toast()
    toast('This feature is under construction! 🚧', {
      duration: 2000,
      icon: '🏗️'
    });
  };

  return (
    <footer className="footer-container">
      {/* Features Section */}
      <div className="features">
        <div className="feature-box"> <h3 className="hover-green">Easy</h3> <p>ShortURL is easy and fast, enter the long link to get your shortened link</p> </div>
        <div className="feature-box"> <h3 className="hover-red">Shortened</h3> <p>Use any link, no matter what size, ShortURL always shortens</p> </div>
        <div className="feature-box"> <h3 className="hover-green">Secure</h3> <p>It is fast and secure, our service has HTTPS protocol and data encryption</p> </div>
        <div className="feature-box"> <h3 className="hover-green">Statistics</h3> <p>Check the number of clicks that your shortened URL received</p> </div>
        <div className="feature-box"> <h3 className="hover-red">Reliable</h3> <p>All links that try to disseminate spam, viruses and malware are deleted</p> </div>
        <div className="feature-box"> <h3 className="hover-green">Devices</h3> <p>Compatible with smartphones, tablets and desktops</p> </div>
      </div>

      {/* Information Section
      <div className="footer-info">
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#" onClick={handleFeatureClick}>About Us</a></li>
            <li><a href="#" onClick={handleFeatureClick}>Our Team</a></li>
            <li><a href="#" onClick={handleFeatureClick}>Careers</a></li>
            <li><a href="#" onClick={handleFeatureClick}>Press</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Solutions</h4>
          <ul>
            <li><a href="#" onClick={handleFeatureClick}>Link Management</a></li>
            <li><a href="#" onClick={handleFeatureClick}>QR Codes</a></li>
            <li><a href="#" onClick={handleFeatureClick}>Link Analytics</a></li>
            <li><a href="#" onClick={handleFeatureClick}>API</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="#" onClick={handleFeatureClick}>Blog</a></li>
            <li><a href="#" onClick={handleFeatureClick}>Developers</a></li>
            <li><a href="#" onClick={handleFeatureClick}>Support</a></li>
            <li><a href="#" onClick={handleFeatureClick}>Documentation</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#" onClick={handleFeatureClick}>Privacy Policy</a></li>
            <li><a href="#" onClick={handleFeatureClick}>Terms of Service</a></li>
            <li><a href="#" onClick={handleFeatureClick}>GDPR Compliance</a></li>
            <li><a href="#" onClick={handleFeatureClick}>Security</a></li>
          </ul>
        </div>
      </div> */}

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="social-links">
          <a href="#" onClick={handleFeatureClick} aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="#" onClick={handleFeatureClick} aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" onClick={handleFeatureClick} aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" onClick={handleFeatureClick} aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
          <a href="#" onClick={handleFeatureClick} aria-label="GitHub"><i className="fab fa-github"></i></a>
        </div>
        <div className="copyright">
          <p>© 2025 ShortURL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
