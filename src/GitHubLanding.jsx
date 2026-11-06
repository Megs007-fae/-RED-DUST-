import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./GitHubLanding.css";

function GitHubLanding() {
  const [buildPending, setBuildPending] = useState(false);
  return (
    <div className="landing-page">

      {/* NAVIGATION */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span>✦</span> MARS / EXPLORATION
        </div>

        <div className="nav-links">
          <a href="#overview">OVERVIEW</a>
          <a href="#gameplay">SCREENSHOTS</a>
          <a href="#download">DOWNLOAD</a>
          <Link to="/dashboard">MISSION CONTROL</Link>
        </div>

        <a
          className="github-link"
          href="https://github.com/Megs007-fae/Project-Red-dust"
          target="_blank"
          rel="noreferrer"
        >
          GITHUB ↗
        </a>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <p className="hero-tag">
          NASA SPACE APPS CHALLENGE / 2026
        </p>

        <h1>
          BEYOND
          <span> THE RED PLANET.</span>
        </h1>

        <p className="hero-description">
          An immersive Mars exploration experience powered
          by planetary science, real-world data and technology.
        </p>

        <div className="hero-buttons">
  <a href="#download" className="primary-btn">
    DOWNLOAD GAME ↓
  </a>

  <a href="#overview" className="secondary-btn">
    EXPLORE PROJECT →
  </a>

  <Link to="/dashboard" className="secondary-btn">
    LAUNCH MISSION CONTROL ↗
  </Link>
</div>

        <div className="hero-coordinate">
          MISSION STATUS: ACTIVE
          <span> // SECTOR 04 // MARS</span>
        </div>
      </section>

      {/* PROJECT OVERVIEW */}
      <section className="landing-overview" id="overview">
        <p className="section-label">01 / MISSION BRIEF</p>

        <h2>THE PROJECT</h2>

        <p>
          Discover the Martian environment through an
          interactive exploration experience. Our project
          brings planetary science and technology together
          to make Mars exploration more engaging and accessible.
        </p>
        <small className="data-source-note">
         DATA SOURCE: NASA PDS Curiosity REMS (Sol 4710)
        </small>
        
      </section>
      
{/* MISSION CAPABILITIES */}

<section className="features-section">
  <p className="section-label">02 / SYSTEM CAPABILITIES</p>

  <h2>ENGINEERED FOR EXPLORATION.</h2>

  <div className="features-grid">

    <div className="feature-card">
      <span>◈</span>
      <h3>PLANETARY DATA</h3>
      <p>
        Explore Mars through scientific observations
        and environmental datasets.
      </p>
      <small>01 / DATA INTELLIGENCE</small>
    </div>

    <div className="feature-card">
      <span>⌖</span>
      <h3>MISSION CONTROL</h3>
      <p>
        Monitor mission parameters through an
        interactive command interface.
      </p>
      <small>02 / MONITORING SYSTEM</small>
    </div>

    <div className="feature-card">
      <span>⌁</span>
      <h3>VISUAL ANALYTICS</h3>
      <p>
        Transform planetary observations into
        meaningful scientific visualizations.
      </p>
      <small>03 / SCIENTIFIC ANALYSIS</small>
    </div>

    <div className="feature-card">
      <span>✦</span>
      <h3>SPACE EXPLORATION</h3>
      <p>
        Experience planetary science through
        an engaging exploration environment.
      </p>
      <small>04 / EXPLORATION</small>
    </div>

  </div>
</section>


      {/* SCREENSHOT */}
      <section className="gameplay-section" id="gameplay">
        <p className="section-label">03 / VISUAL ARCHIVE</p>

        <h2>MISSION SCREENSHOTS</h2>

        <div className="screenshot-placeholder mars-preview">

  <div className="mars-hud">
    <div className="hud-top">
      <span>◉ LIVE SIMULATION</span>
      <span>SECTOR 04 / MARS</span>
    </div>

    <div className="hud-center">
      <p>PLANETARY EXPLORATION</p>
      <h3>THE RED FRONTIER</h3>
      <span>MISSION ENVIRONMENT INITIALIZED</span>
    </div>

    <div className="hud-bottom">
      <span>COORDINATES: 14.5°N / 175.2°E</span>
      <span>SYSTEM STATUS: ONLINE</span>
    </div>
  </div>

</div>
      </section>

      {/* DOWNLOAD */}
      
<section className="download-section" id="download">
  <p className="section-label">04 / DEPLOYMENT CENTER</p>

  <h2>YOUR MISSION AWAITS.</h2>

  <p>
    Ready to explore the Red Planet? Get the application
    and begin your journey through Mars.
  </p>

  <div className="release-panel">

    <div className="release-info">
      <span className="release-indicator"></span>
      <span>MISSION BUILD / 2026</span>
    </div>

    <h3>MARS EXPLORATION</h3>

    <div className="release-details">
      <span>PLATFORM</span>
      <strong>WINDOWS PC</strong>

      <span>VERSION</span>
      <strong>V1.0.0</strong>

      <span>FILE FORMAT</span>
      <strong>EXECUTABLE (.EXE)</strong>
    </div>

    <a
  href="#download"
  className="download-btn"
  onClick={(e) => {
    e.preventDefault();
    setBuildPending(true);
  }}
>
  {buildPending
    ? "BUILD PENDING // NOV 14"
    : "↓ DOWNLOAD .EXE"}
</a>

    <small>EXECUTABLE BUILD / RELEASE STATUS: PENDING</small>

  </div>
</section>


      {/* FOOTER */}
      <footer className="landing-footer">
        <span>© 2026 MARS EXPLORATION PROJECT</span>
        <span>BUILT FOR NASA SPACE APPS CHALLENGE</span>
      </footer>

    </div>
  );
}

export default GitHubLanding;