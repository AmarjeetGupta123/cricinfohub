import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";

import Dashboard from "./Components/Dashboard";
import MatchCenter from "./Components/matchCenter";
import SeriesPage from "./Components/SeriesPage";
import UpcomingMatches from "./Components/UpcomingMatches/UpcomingMatches";
import WTCPointsTable from "./Components/WTC/WTCPointsTable";
import Ranking from "./Components/Ranking/Ranking";
import Records from "./Components/Record/Records";
import Estore from "./Components/Estore/Estore";
import Ebook from "./Components/Ebook/Ebook";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 992);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  // Sidebar toggle
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((value) => !value);
    } else {
      setCollapsed((value) => !value);
    }
  };

  // Close mobile sidebar
  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <BrowserRouter>
      <div className={`cd-root ${darkMode ? "cd-dark" : "cd-light"}`}>

        {/* ================= HEADER ================= */}
        <Header
          isMobile={isMobile}
          mobileOpen={mobileOpen}
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
        />

        {/* ================= BODY ================= */}
        <div className="cd-body">

          {/* Mobile Overlay */}
          <div
            className={`cd-overlay ${mobileOpen ? "show" : ""}`}
            onClick={closeMobile}
          ></div>

          {/* ================= SIDEBAR ================= */}
          <Sidebar
            collapsed={collapsed}
            mobileOpen={mobileOpen}
            isMobile={isMobile}
            active={active}
            setActive={setActive}
            closeMobile={closeMobile}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          {/* ================= MAIN CONTENT ================= */}
          <main className="cd-main">
            <Routes>

              {/* Dashboard */}
              <Route
                path="/"
                element={<Dashboard setActive={setActive} />}
              />

              {/* Match Center */}
              <Route
                path="/match/:matchId"
                element={<MatchCenter setActive={setActive} />}
              />
<Route
  path="/rankings"
  element={<Ranking />}
/>
<Route path="/records" element={<Records />} />
<Route path="/e-book" element={<Ebook />} />

<Route path="/e-store" element={<Estore />} />

              {/* Series Matches */}
              <Route
                path="/all-matches/:seriesId"
                element={<SeriesPage />}
              />

              {/* Upcoming Matches */}
              <Route
                path="/upcoming-matches"
                element={<UpcomingMatches />}
              />

              {/* WTC Points Table */}
              <Route
                path="/WTCPointsTable"
                element={<WTCPointsTable />}
              />

            </Routes>
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;