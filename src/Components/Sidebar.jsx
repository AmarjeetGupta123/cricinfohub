import { useNavigate } from "react-router-dom";


const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "bi-speedometer2",
  },
  {
    key: "matches",
    label: "Live Matches",
    icon: "bi-broadcast",
    badge: 3,
    badgeType: "live",
  },
  {
    key: "wtc-points-table",
    label: "WTC Points Table",
    icon: "bi-people",
  },
  {
  key: "rankings",
  label: "ICC Rankings",
  icon: "bi-bar-chart-line",
},
  {
    key: "upcoming-matches",
    label: "Schedule",
    icon: "bi-calendar-event",
  },
  {
    key: "stats",
    label: "Stats & Records",
    icon: "bi-bar-chart-line",
  },
  {
  key: "E-Book",
  label: "E-Book",
  icon: "bi-journal-bookmark-fill",
  badge: 5,
},
{
  key: "E-Store",
  label: "E-store",
  icon: "bi-bag-heart-fill",
},
];
 
const SQUAD = [
  {
    name: "Rohan Verma",
    role: "Captain",
    color: "#7ED957",
  },
  {
    name: "Ayesha Khan",
    role: "Vice Captain",
    color: "#FF6B6B",
  },
  {
    name: "Karan Mehta",
    role: "Bowler",
    color: "#4DA3FF",
  },
];

function Sidebar({
  collapsed,
  mobileOpen,
  isMobile,
  active,
  setActive,
  closeMobile,
  darkMode,
  setDarkMode,
}) {
  const navigate = useNavigate();
  return (
    <aside
  className={`cd-sidebar ${
    collapsed ? "collapsed" : ""
  } ${mobileOpen ? "mobile-open" : ""}`}
  onScroll={(e) => {
    e.currentTarget.classList.add("is-scrolling");

    clearTimeout(e.currentTarget._scrollTimer);

    e.currentTarget._scrollTimer = setTimeout(() => {
      e.currentTarget.classList.remove("is-scrolling");
    }, 700);
  }}
>

      {/* Navigation */}
      <ul className="cd-nav">

        {NAV_ITEMS.map((item) => (
          <li
            key={item.key}
            className={`cd-nav-item ${
              active === item.key ? "active" : ""
            }`}
            onClick={() => {
              setActive(item.key);
if (item.key === "dashboard") {
    navigate("/");
  } else if (item.key === "matches") {
    navigate("/matches");
  } else if (item.key === "wtc-points-table") {
    navigate("/WTCPointsTable");
  } else if (item.key === "rankings") {
    navigate("/rankings");
  } else if (item.key === "upcoming-matches") {
    navigate("/upcoming-matches");
  } else if (item.key === "stats") {
    navigate("/records");
  } else if (item.key === "E-Book") {
    navigate("/e-book");
  } else if (item.key === "E-Store") {
    navigate("/e-store");
  }
              if (isMobile) {
                closeMobile();
              }
            }}
          >

            <i className={`bi ${item.icon}`}></i>

            <span className="cd-nav-label">
              {item.label}
            </span>

            {item.badge != null && (
              <span
                className={`cd-badge ${
                  item.badgeType === "live"
                    ? "live"
                    : ""
                }`}
              >
                {item.badgeType === "live"
                  ? "LIVE"
                  : item.badge}
              </span>
            )}

            {/* Tooltip for collapsed sidebar */}
            {collapsed && !isMobile && (
              <span className="cd-tooltip">
                {item.label}
              </span>
            )}

          </li>
        ))}

      </ul>

      {/* Squad */}
      <div className="cd-section-title">
        <span>Squad</span>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          View all
        </a>
      </div>

      <ul className="cd-squad">

        {SQUAD.map((player) => (
          <li key={player.name}>

            <div
              className="cd-avatar"
              style={{
                background: player.color,
              }}
            >
              {player.name
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </div>

            <div>
              <div>{player.name}</div>

              <span className="role">
                {player.role}
              </span>
            </div>

          </li>
        ))}

      </ul>

      {/* Upload */}
      <div className="cd-upload">

        <i className="bi bi-cloud-arrow-up"></i>

        Drag &amp; drop match footage

      </div>

      {/* Theme Toggle */}
      <div className="cd-theme-toggle">

        <button
          className={darkMode ? "active" : ""}
          onClick={() => setDarkMode(true)}
        >
          <i className="bi bi-moon-stars"></i>

          <span className="cd-theme-label">
            Dark
          </span>
        </button>

        <button
          className={!darkMode ? "active" : ""}
          onClick={() => setDarkMode(false)}
        >
          <i className="bi bi-sun"></i>

          <span className="cd-theme-label">
            Light
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;