import React, { useRef } from "react";

function Header({
  isMobile,
  mobileOpen,
  collapsed,
  toggleSidebar,
}) {
  const searchRef = useRef(null);

  return (
    <header className="cd-header">

      {/* Left Section */}
      <div className="d-flex align-items-center gap-3">

        <button
          className={`cd-burger ${
            (isMobile ? mobileOpen : !collapsed) ? "is-open" : ""
          }`}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="bi bi-list"></i>
        </button>

        <div className="cd-brand">
          <span className="ball-dot"></span>

          <span className="txt">
            Cric<span style={{ color: "var(--pitch)" }}>InfoHub</span>
          </span>
        </div>

      </div>

      {/* Search */}
      <div className="cd-search-wrap">

        <i className="bi bi-search"></i>

        <input
          ref={searchRef}
          type="text"
          placeholder="Search players, teams, matches..."
        />

      </div>

      {/* Right Section */}
      <div className="cd-header-actions">

        {/* Notification */}
        <button
          className="cd-icon-btn"
          aria-label="Notifications"
        >
          <i className="bi bi-bell"></i>
          <span className="dot"></span>
        </button>

        {/* Messages */}
        <button
          className="cd-icon-btn"
          aria-label="Messages"
        >
          <i className="bi bi-chat-dots"></i>
        </button>

        {/* Profile */}
        <div className="cd-profile">

          <img
            src="https://i.pravatar.cc/64?img=13"
            alt="User avatar"
          />

          <div>
            <div className="name">Amarjeet G.</div>
            <div className="role">Manager</div>
          </div>

          <i
            className="bi bi-chevron-down"
            style={{
              fontSize: ".7rem",
              color: "var(--text-soft)",
            }}
          ></i>

        </div>

      </div>

    </header>
  );
}

export default Header;