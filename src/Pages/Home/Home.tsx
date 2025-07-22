import type React from "react"
import { Link } from "react-router-dom"
import "./Home.css"
import M15 from "../../assets/Images/mirkuzphotos-15.png"
import M12 from "../../assets/Images/mirkuzphotos-12.png"
import M14 from "../../assets/Images/mirkuzphotos-14.png"
import SearchIcon from "@mui/icons-material/Search"
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos"

const Home: React.FC = () => {
  return (
    <>
      <div className="home-main">
        {/* Left Side: Welcome and Bottom Links */}
        <div className="home-left">
          <h1 className="welcome-title">
            <span className="near-blue">Even the Strongest</span>
            <span className="black">
              <h3>
                Missions <br />
                Need Support
              </h3>
            </span>
          </h1>
          <p className="welcome-desc">
            <span className="welcome-first-part">Register Now – </span>
            <span className="welcome-second-part">Meet Volunteers Ready to Help</span>
          </p>
          <div className="button-home">
            <Link to="/register" className="button-home">
              Sign up
            </Link>
          </div>
          <div className="already-account">
            already have an <span className="blue-black">account</span>?
          </div>
        </div>
        <div className="home-right">
          <div className="Home-container">
            <div className="image-collage">
              <div className="collage-row">
                <div className="collage-row img1">
                  <img
                    src={M15 || "/placeholder.svg"}
                    alt="image-1"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="home-stats-section">
        <div className="home-stats-item">
          <div className="home-stats-value">9000+</div>
          <div className="home-stats-label">Donors</div>
        </div>
        <div className="home-stats-divider" />
        <div className="home-stats-item">
          <div className="home-stats-value">15k</div>
          <div className="home-stats-label">Volunteers</div>
        </div>
        <div className="home-stats-divider" />
        <div className="home-stats-item">
          <div className="home-stats-value">$10k</div>
          <div className="home-stats-label">Raised</div>
        </div>
      </div>

      {/* About Section */}
      <div className="home-about-section">
        <div className="home-about-images">
          <img src={M12 || "/placeholder.svg"} alt="about-1" className="home-about-img" />
          <img src={M14 || "/placeholder.svg"} alt="about-2" className="home-about-img" />
        </div>
        <div className="home-about-text">
          <div className="home-about-title">about</div>
          <div className="home-about-desc">
            Raise a donation for your cause easily with our admin panel and volunteer by adding what you simply want
            with one click away
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="home-cta-section">
        <div className="home-cta-text">
          <span className="home-cta-blue">
            Wish to donate
            <br />
            or volunteer??
          </span>
          <br />
          <span className="home-cta-black">
            <Link to="/mobile-app" className="home-cta-link">
              Download the app.
            </Link>
          </span>
        </div>
      </div>

      {/* Features Section */}
      <div className="home-features-section">
        <div className="home-feature-card">
          <span className="home-feature-icon">
            <SearchIcon fontSize="inherit" />
          </span>
          <div className="home-feature-bar"></div>
        </div>
        <div className="home-feature-card">
          <span className="home-feature-icon">
            <Link to="/create-event">
              <AddToPhotosIcon fontSize="inherit" />
            </Link>
          </span>
          <div className="home-feature-bar"></div>
        </div>
        <div className="home-feature-card">
          <span className="home-feature-icon">
            <i className="fa fa-hand-holding-usd"></i>
          </span>
          <div className="home-feature-bar"></div>
        </div>
        <div className="home-feature-card">
          <span className="home-feature-icon"></span>
          <div className="home-feature-bar"></div>
        </div>
      </div>
    </>
  )
}

export default Home
