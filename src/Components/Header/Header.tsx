"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "./Header.css"
import logo from "../../assets/Images/mirkuzz-03.png" 

interface HeaderProps {
  customLogo?: string
}

const Header: React.FC<HeaderProps> = ({ customLogo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  // Close menu when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 540 && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMenuOpen])

  const handleSignOut = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  let buttonText = "Sign In"
  let buttonLink = "/login"
  if (location.pathname === "/login") {
    buttonText = "Sign Up"
    buttonLink = "/register"
  }
  if (token) {
    buttonText = "Logout"
  }

  return (
    <header className="header">
      {/* Desktop Header */}
      <div className="desktop-header">
        <div className="logo">
          <Link to="/" className="logo-container">
            <img src={customLogo || logo} alt="Mirkuz Logo" className="logo-img" />
            <span className="logo-text">Mirkuz</span>
          </Link>
        </div>

        <nav className="nav-center">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </nav>

        <div className="auth-button-container">
          {token ? (
            <button className="signin-btn" onClick={handleSignOut}>
              {buttonText}
            </button>
          ) : (
            <Link to={buttonLink} className="signin-btn">
              {buttonText}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-header-top">
          <div className="logo">
            <Link to="/" className="logo-container">
              <img src={customLogo || logo} alt="Mirkuz Logo" className="logo-img" />
              <span className="logo-text">Mirkuz</span>
            </Link>
          </div>

          <div className="mobile-controls">
            <div className="auth-button-container">
              {token ? (
                <button className="signin-btn" onClick={handleSignOut}>
                  {buttonText}
                </button>
              ) : (
                <Link to={buttonLink} className="signin-btn">
                  {buttonText}
                </Link>
              )}
            </div>

            <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
              <div className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></div>
              <div className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></div>
              <div className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <nav className={`mobile-nav ${isMenuOpen ? "show" : ""}`}>
          <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
          <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            Profile
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
