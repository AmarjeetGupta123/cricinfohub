import React, { useEffect, useState } from "react";
import api from "../Services/Api";
import { useNavigate } from "react-router-dom";

function Dashboard({ onMatchClick }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  useEffect(() => {

    getMatches(true);

    const interval = setInterval(() => {
      getMatches(false);
    }, 50000);

    return () => {
      clearInterval(interval);
    };

  }, []);

  const getMatches = async (showLoading = false) => {

    try {

      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/home");

      console.log("API Response:", response.data);

      setMatches(response.data?.matches || []);

    } catch (error) {

      console.error("Match API Error:", error);

      setError("Unable to load matches.");

    } finally {

      if (showLoading) {
        setLoading(false);
      }

    }
  };

  const getMatchStatus = (item) => {
    const state = item?.match?.matchInfo?.state;

    if (state === "In Progress") {
      return "LIVE";
    }

    if (state === "Complete") {
      return "COMPLETED";
    }

    return "UPCOMING";
  };

  const getStatusClass = (match) => {
    const status = getMatchStatus(match);

    if (status === "LIVE") {
      return "match-status live";
    }

    if (status === "COMPLETE") {
      return "match-status completed";
    }

    return "match-status upcoming";
  };

  const getTeamScore = (item, teamNumber) => {
    const score =
      teamNumber === 1
        ? item?.match?.matchScore?.team1Score
        : item?.match?.matchScore?.team2Score;

    if (!score) {
      return null;
    }

    const innings = Object.values(score);

    if (!innings.length) {
      return null;
    }

    return innings.map((inning) => ({
      inningsId: inning?.inningsId,
      runs: inning?.runs ?? "-",
      wickets: inning?.wickets ?? "-",
      overs: inning?.overs ?? "-",
    }));
  };

  const formatTeamName = (team) => {
    return team?.teamSName || team?.teamName || team?.imageId || "Team";
  };

  const formatMatchTitle = (item) => {
    return (
      item?.match?.matchInfo?.seriesName ||
      "Cricket Match"
    );
  };

  const formatMatchDescription = (item) => {
    return (
      item?.match?.matchInfo?.status ||
      item?.match?.matchInfo?.shortStatus ||
      "Match information available"
    );
  };

  if (loading) {
    return (
      <div className="p-2">

        <div className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              CRICKET INFORMATION
            </span>

            <h1>
              Match Center
            </h1>

            <p>
              Live scores, results and upcoming matches
            </p>
          </div>
        </div>

        <div className="matches-loading">

          <div className="spinner-border" role="status">
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <span>
            Loading latest matches...
          </span>

        </div>

      </div>
    );
  }

  if (error) {
    return (
     <div className="p-2">

        <div className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              CRICKET INFORMATION
            </span>

            <h1>
              Match Center
            </h1>
          </div>
        </div>

        <div className="api-error-card">

          <i className="bi bi-exclamation-triangle"></i>

          <h5>
            Unable to load matches
          </h5>

          <p>
            {error}
          </p>

          <button
            className="btn btn-success"
            onClick={getMatches}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="p-2">
      {/* ================= DASHBOARD HEADER ================= */}

      <div className="dashboard-header">

        <div>

          <span className="dashboard-eyebrow">
            CRICKET INFORMATION
          </span>
          <h1>
            Match Center
          </h1>

          <p>
            Stay updated with the latest cricket action.
          </p>

        </div>

        <div className="match-count">

          <span className="match-count-dot"></span>

          {matches.length} Matches
        </div>

      </div>


      {/* ================= QUICK STATS ================= */}

      <div className="row g-3 dashboard-stats">

        <div className="col-6 col-lg-3">

          <div className="stat-card">

            <div className="stat-icon live-icon">
              <i className="bi bi-broadcast"></i>
            </div>

            <div>
              <span>Live Matches</span>

              <strong>
                {
                  matches.filter(
                    (match) =>
                      getMatchStatus(match) === "LIVE"
                  ).length
                }
              </strong>
            </div>

          </div>

        </div>


        <div className="col-6 col-lg-3">

          <div className="stat-card">

            <div className="stat-icon completed-icon">
              <i className="bi bi-check-circle"></i>
            </div>

            <div>
              <span>Completed</span>

              <strong>
                {
                  matches.filter(
                    (match) =>
                      getMatchStatus(match) === "COMPLETED"
                  ).length
                }
              </strong>
            </div>

          </div>

        </div>


        <div className="col-6 col-lg-3">

          <div className="stat-card">

            <div className="stat-icon upcoming-icon">
              <i className="bi bi-calendar-event"></i>
            </div>

            <div>
              <span>Upcoming</span>

              <strong>
                {
                  matches.filter(
                    (match) =>
                      getMatchStatus(match) === "UPCOMING"
                  ).length
                }
              </strong>
            </div>

          </div>

        </div>


        <div className="col-6 col-lg-3">

          <div className="stat-card">

            <div className="stat-icon cricket-icon">
              <i className="bi bi-trophy"></i>
            </div>

            <div>
              <span>Total Matches</span>

              <strong>
                {matches.length}
              </strong>
            </div>

          </div>

        </div>

      </div>


      {/* ================= MATCH SECTION ================= */}

      <div className="section-heading">

        <div>

          <span>
            LIVE & RECENT
          </span>

          <h2>
            Match Update
          </h2>

        </div>

        <button
          className="refresh-btn"
          onClick={getMatches}
          title="Refresh matches"
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>

      </div>


      {/* ================= MATCH CARDS ================= */}

      <div className="matches-scroll">

        {matches.map((item, index) => {

          const match = item?.match?.matchInfo;

          const team1 = match?.team1;
          const team2 = match?.team2;

          const score1 = getTeamScore(item, 1);
          const score2 = getTeamScore(item, 2);

          return (
            <div
              className="match-card"
              key={match?.matchId || index}
              onClick={() => navigate(`/match/${match?.matchId}`)}
            >

              {/* Card Top */}

              <div className="match-card-top">

                <div className="series-info">

                  <span className="match-type">
                    {match?.matchFormat || "MATCH"}
                  </span>

                  <span className="series-name">
                    {formatMatchTitle(item)}
                  </span>

                </div>

                <span className={getStatusClass(item)}>
                  {getMatchStatus(item)}
                </span>

              </div>


              {/* Teams */}

              <div className="teams-wrapper">

                {/* Team 1 */}

                <div className="team-row">

                  <div className="team-info">

                    <div
                      className="team-logoo"
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <img
                        src={`https://static.cricbuzz.com/a/img/v1/0x0/i1/c${team1?.imageId}/india.jpg`}
                        alt={team1?.teamName || "Team"}
                        style={{
                         
                          height: "100%",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    </div>
                    <div>

                      <strong>
                        {formatTeamName(team1)}
                      </strong>

                      <small>
                        {team1?.teamName || ""}
                      </small>

                    </div>

                  </div>

                  <div className="team-score">

                    {score1?.length ? (
                      <div className="team-score-list">
                        {score1.map((inning, index) => (
                          <React.Fragment key={inning.inningsId || index}>

                            {index > 0 && (
                              <span className="score-separator">&</span>
                            )}

                            <div className="team-score-item">
                              <strong>
                                {inning.runs}
                                <small>
                                  /{inning.wickets}
                                </small>
                              </strong>

                              <span>
                                {inning.overs} overs
                              </span>
                            </div>

                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <span className="no-score"> </span>
                    )}

                  </div>

                </div>


                {/* VS */}

                <div className="match-divider">

                  <span>
                    VS
                  </span>

                </div>


                {/* Team 2 */}

                <div className="team-row">

                  <div className="team-info">

                    <div
                      className="team-logoo team-logo-two"
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <img
                        src={`https://static.cricbuzz.com/a/img/v1/0x0/i1/c${team2?.imageId}/india.jpg`}
                        alt={team2?.teamName || "Team"}
                        style={{
                         
                          height: "100%",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    </div>
                    <div>

                      <strong>
                        {formatTeamName(team2)}
                      </strong>

                      <small>
                        {team2?.teamName || ""}
                      </small>

                    </div>

                  </div>

                  <div className="team-score">

                    {score2?.length ? (
                      <div className="team-score-list">

                        {score2.map((inning, index) => (
                          <React.Fragment key={inning.inningsId || index}>

                            {index > 0 && (
                              <span className="score-separator">&</span>
                            )}

                            <div className="team-score-item">

                              <strong>
                                {inning.runs}
                                <small>
                                  /{inning.wickets}
                                </small>
                              </strong>

                              <span>
                                {inning.overs} overs
                              </span>

                            </div>

                          </React.Fragment>
                        ))}

                      </div>
                    ) : (
                      <span className="no-score">
                        
                      </span>
                    )}

                  </div>

                </div>

              </div>


              {/* Match Status */}

              <div className="match-result">

                <i className="bi bi-info-circle"></i>

                <span>
                  {formatMatchDescription(item)}
                </span>

              </div>


              {/* Footer */}

              <div className="match-card-footer">

                <span>
                  <i className="bi bi-geo-alt"></i>

                  {match?.venueInfo?.ground ||
                    "Venue TBA"}
                </span>

                <span
                  className="d-inline-flex align-items-center gap-2 text-success fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/all-matches/${match?.seriesId}`);
                  }}
                >
                  All Matches
                  <i className="bi bi-arrow-right"></i>
                </span>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default Dashboard;