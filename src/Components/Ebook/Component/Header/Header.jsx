import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`ebook-header ${scrolled ? "header-scrolled" : ""}`}>
      <div className="ebook-header-container">

        {/* LOGO */}
        <a href="#home" className="ebook-logo" onClick={closeMenu}>
          <div className="ebook-logo-icon">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 49C32 49 12 43 12 27C12 18 20 12 32 8C44 12 52 18 52 27C52 43 32 49 32 49Z"
                stroke="currentColor"
                strokeWidth="2.5"
              />

              <path
                d="M32 49V21"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <path
                d="M32 29C27 24 22 23 18 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M32 34C38 28 43 27 47 29"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="ebook-logo-content">
            <span className="ebook-logo-title">
              सत्संग प्रश्नोत्तरी
            </span>

            <span className="ebook-logo-subtitle">
              प्रश्न से समझ तक
            </span>
          </div>
        </a>

        {/* DESKTOP NAV */}
        <nav className="ebook-nav">
          <a href="#home">होम</a>

          <a href="#about">
            पुस्तक के बारे में
          </a>

          <a href="#preview">
            अंदर से देखें
          </a>

          <a href="#reviews">
            समीक्षाएं
          </a>

          <a href="#faq">
            FAQ
          </a>
        </nav>

        {/* DESKTOP CTA */}
        <div className="ebook-header-action">
          <a href="#pricing" className="header-cta">
            अभी प्राप्त करें
            <span>→</span>
          </a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className={`mobile-menu-btn ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        <nav className="mobile-nav">

          <a href="#home" onClick={closeMenu}>
            होम
          </a>

          <a href="#about" onClick={closeMenu}>
            पुस्तक के बारे में
          </a>

          <a href="#preview" onClick={closeMenu}>
            अंदर से देखें
          </a>

          <a href="#reviews" onClick={closeMenu}>
            समीक्षाएं
          </a>

          <a href="#faq" onClick={closeMenu}>
            FAQ
          </a>

          <a
            href="#pricing"
            className="mobile-cta"
            onClick={closeMenu}
          >
            Ebook अभी प्राप्त करें
            <span>→</span>
          </a>

        </nav>
      </div>
    </header>
  );
};

export default Header;