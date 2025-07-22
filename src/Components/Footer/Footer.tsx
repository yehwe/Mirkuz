import type React from "react"
import { Link } from "react-router-dom";
import "./Footer.css"
import logo from "../../assets/Images/mirkuzz-03.png" 

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="logo-container">
            <img src={logo} alt="Mirkuz Logo" className="footer-logo" />
          </div>
          <p className="footer-description">
            Be the Support Someone Needs.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">
              <i className="social-icon facebook"></i>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="social-link">
              <i className="social-icon instagram"></i>
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="social-link">
              <i className="social-icon twitter"></i>
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
           <nav className="footer-nav">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/about" className="footer-link">About</Link>
          <Link to="/create-event" className="footer-link">Events</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </nav>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <i className="contact-icon phone"></i>
              <span>(251) 113-7890</span>
            </div>
            <div className="contact-item">
              <i className="contact-icon email"></i>
              <span>info@mirkuz.com</span>
            </div>
            <div className="contact-item">
              <i className="contact-icon location"></i>
              <span>Bole, A.A, Ethiopia</span>
            </div>
          </div>
        </div>
      </div>

      <div className="copyright">
        <p>© {new Date().getFullYear()} Mirkuz. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
