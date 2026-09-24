import React, { useEffect, useState } from "react";
import api from "../Services/Api";
import Scorecard from "./Scorecard";
import { useNavigate, useParams } from "react-router-dom";
import Squad from "./Squad";
import Overs from "./Overs";
import BallMap from "./BallMap";
import MatchFacts from "./Info/MatchFacts";


function MatchCenter() {
const [commentaryMatchHeader, setCommentaryMatchHeader] = useState(null);
const [commentaryMiniScore, setCommentaryMiniScore] = useState(null);    const [matchData, setMatchData] = useState(null);
    const [commentaryData, setCommentaryData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("Live");

    const navigate = useNavigate();
    const { matchId } = useParams();

    // ==========================================
    // GET LIVE MATCH DATA
    // ==========================================

    const getMatchDetails = async (showLoading = false) => {

        try {

            if (showLoading) {
                setLoading(true);
            }

            const response = await api.get(
                `/mcenter/livescore/${matchId}`
            );

            setMatchData(response.data);

        } catch (error) {

            console.error(
                "Match Details Error:",
                error
            );

        } finally {

            if (showLoading) {
                setLoading(false);
            }

        }

    };


    // ==========================================
    // GET COMMENTARY
    // ==========================================

  const getCommentary = async () => {
  try {
    const response = await api.get(`/mcenter/comm/${matchId}`);

    const commentaryObject =
      response.data?.matchCommentary || {};

    const commentaryArray =
      Object.values(commentaryObject);

    setCommentaryData(commentaryArray);

    setCommentaryMatchHeader(
      response.data?.matchHeader || null
    );

    setCommentaryMiniScore(
      response.data?.miniscore || null
    );

  } catch (error) {
    console.error("Commentary API Error:", error);
  }
};


    // ==========================================
    // API CALL + AUTO UPDATE
    // ==========================================

    useEffect(() => {

        getMatchDetails(true);
        getCommentary();

        const interval = setInterval(() => {

            getMatchDetails(false);
            getCommentary();

        }, 30000);

        return () => {
            clearInterval(interval);
        };

    }, [matchId]);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main className="match-center-page">

                <div className="match-loading">

                    <div
                        className="spinner-border"
                        role="status"
                    ></div>

                    <p>
                        Loading match...
                    </p>

                </div>

            </main>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (!matchData) {

        return (

            <main className="match-center-page">

                <div className="alert alert-danger">

                    Match data could not be loaded.

                </div>


                

            </main>

        );

    }


    // ==========================================
    // API DATA
    // ==========================================

    const mini =
        matchData?.miniscore;


    const matchInfo =
        mini?.matchScoreDetails;


    const innings =
        matchInfo?.inningsScoreList || [];


    const latestPerformance =
        matchData?.latestPerformance || [];


    const currentTeam =
        mini?.batTeam;



    return (

        <main className="match-center-page">


            {/* =====================================
                TOP BAR
            ===================================== */}

            <div className="match-top-bar">

               

                <span className="match-live-label">

                    {matchData?.status || "LIVE"}

                </span>

            </div>



            {/* =====================================
                TABS
            ===================================== */}

            <div className="scorecard-tabs">


                {/* LIVE */}

                <button
                    className={`scorecard-tab ${
                        activeTab === "Live"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab("Live")
                    }
                >

                    <i className="bi bi-broadcast"></i>

                    Live

                </button>



                {/* INFO */}

                <button
                    className={`scorecard-tab ${
                        activeTab === "Info"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab("Info")
                    }
                >

                    <i className="bi bi-info-circle"></i>

                    Info

                </button>



                {/* SCORECARD */}

                <button
                    className={`scorecard-tab ${
                        activeTab === "Scorecard"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab("Scorecard")
                    }
                >

                    <i className="bi bi-bar-chart-fill"></i>

                    Scorecard

                </button>



                {/* SQUADS */}

                <button
                    className={`scorecard-tab ${
                        activeTab === "Squads"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab("Squads")
                    }
                >

                    <i className="bi bi-people-fill"></i>

                    Squads

                </button>



                {/* OVERS */}

                <button
                    className={`scorecard-tab ${
                        activeTab === "Overs"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab("Overs")
                    }
                >

                    <i className="bi bi-clock-history"></i>

                    Overs

                </button>



                {/* GRAPHS */}

                <button
                    className={`scorecard-tab ${
                        activeTab === "Graphs"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab("Graphs")
                    }
                >

                    <i className="bi bi-graph-up"></i>

                    Graphs

                </button>


            </div>



            {/* =====================================
                LIVE TAB
            ===================================== */}

            {activeTab === "Live" && (

                <>

                    <div className="match-container">
    {/* Ek chota anonymous function banakar use turant () se call kar denge */}
    {(() => {
      switch (matchInfo?.state) {
        case 'Preview': {
  const MatchCountdown = () => {
    const startStatus =
      matchData?.miniscore?.matchScoreDetails?.customStatus ||
      matchData?.miniscore?.status ||
      '';

    const [timeLeft, setTimeLeft] = React.useState({
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: false
    });

    React.useEffect(() => {
      if (!startStatus) return;

      const match = startStatus.match(
        /Match starts at\s+([A-Za-z]{3})\s+(\d{1,2}),\s+(\d{1,2}):(\d{2})\s+GMT/i
      );

      if (!match) return;

      const [, month, day, hour, minute] = match;

      const now = new Date();
      let year = now.getUTCFullYear();

      let targetDate = Date.parse(
        `${month} ${day}, ${year} ${hour}:${minute}:00 GMT`
      );

      /* Agar API ka date next year ka ho */
      if (targetDate < Date.now()) {
        targetDate = Date.parse(
          `${month} ${day}, ${year + 1} ${hour}:${minute}:00 GMT`
        );
      }

      const updateTimer = () => {
        const difference = targetDate - Date.now();

        if (difference <= 0) {
          setTimeLeft({
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true
          });
          return;
        }

        const totalSeconds = Math.floor(difference / 1000);

        setTimeLeft({
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
          isExpired: false
        });
      };

      updateTimer();

      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }, [startStatus]);

    return (
      <div className="preview-countdown">
        {timeLeft.isExpired ? (
          <div className="match-started">
            🔴 Match Has Started!
          </div>
        ) : (
          <>
            <div className="countdown-title">
              Match Starts In
            </div>

            <div className="countdown-boxes">
              {[
                ['hours', 'HOURS'],
                ['minutes', 'MINUTES'],
                ['seconds', 'SECONDS']
              ].map(([key, label], index) => (
                <React.Fragment key={key}>

                  {index > 0 && (
                    <span className="countdown-separator">
                      :
                    </span>
                  )}

                  <div className="countdown-item">
                    <strong>
                      {String(timeLeft[key]).padStart(2, '0')}
                    </strong>

                    <span>
                      {label}
                    </span>
                  </div>

                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="preview-section">

      {/* HEADER */}
      <div className="preview-header d-flex justify-content-between align-items-center">

        <span className="match-format-badge">
          🏏 {matchInfo?.matchFormat || 'MATCH'}
        </span>

        <span className="upcoming-badge">
          UPCOMING
        </span>

      </div>


      {/* STATUS */}
      <div className="preview-status">
        {matchData?.miniscore?.matchScoreDetails?.customStatus ||
          matchData?.miniscore?.status ||
          'Match will begin soon'}
      </div>


      {/* COUNTDOWN */}
      <MatchCountdown />

    </div>
  );
}
case 'Complete': {
  const playersOfTheMatch =
    commentaryMatchHeader?.playersOfTheMatch || [];

  const playersOfTheSeries =
    commentaryMatchHeader?.playersOfTheSeries || [];

 const innings =
  commentaryMiniScore?.matchScoreDetails?.inningsScoreList || [];
  return (
    <div className="complete-match-section">

      {/* ==========================================
          MATCH SCORE
      ========================================== */}

      {innings.length > 0 && (
  <div className="complete-score-section">
<h1 className="match-status">
  {matchData?.miniscore?.status}
</h1>
    {innings.map((item, index) => (
      <div
        key={item?.inningsId || index}
        className="complete-score-card d-flex align-items-center justify-content-between"
      >

        <div className="complete-score-team">
          <h5>
            {item?.batTeamName || "Team"}
          </h5>
        </div>

        <div className="complete-score-right d-flex align-items-center">

          <div className="complete-score">
            <span className="score-runs">
              {item?.score ?? 0}
            </span>

            <span className="score-slash">
              /
            </span>

            <span className="score-wickets">
              {item?.wickets ?? 0}
            </span>
          </div>

          <span className="complete-overs">
            {item?.overs ?? 0} ov
          </span>

        </div>

      </div>
    ))}

  </div>
)}


      {/* ==========================================
          PLAYER OF THE MATCH
      ========================================== */}

      {playersOfTheMatch.length > 0 && (
        <div className="award-section">

          <div className="award-title d-flex align-items-center">

            <span className="award-icon">
              🏆
            </span>

            <div>
              <h2>
                Player of the Match
              </h2>

              <p>
                Outstanding performance in the match
              </p>
            </div>

          </div>


          <div className="players-grid">

            {playersOfTheMatch.map((player, index) => (
              <div
                className="player-card d-flex align-items-center"
                key={player.id || index}
              >

                <div className="player-image-wrapper flex-shrink-0">

                  <img
                    src={`https://static.cricbuzz.com/a/img/v1/i1/c${player?.imageDetails?.imageId}/dan-lawrence.jpg?d=low&p=gthumb`}
                    alt={player.name || "Player"}
                    className="player-image"
                  />

                </div>


                <div className="player-info flex-grow-1">

                  <h3>
                    {player.name}
                  </h3>

                  {player.fullName &&
                    player.fullName !== player.name && (
                      <span className="player-full-name">
                        {player.fullName}
                      </span>
                    )}


                  <div className="player-stats d-flex">

                    {player.battingSummary && (
                      <div className="stat-box">

                        <span className="text-light">
                          BAT&nbsp;
                        </span>

                        <strong>
                          {player.battingSummary}
                        </strong>

                      </div>
                    )}


                    {player.bowlingSummary && (
                      <div className="stat-box">

                        <span className="text-light">
                          BOWL&nbsp;
                        </span>

                        <strong>
                          {player.bowlingSummary}
                        </strong>

                      </div>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>
      )}


      {/* ==========================================
          PLAYER OF THE SERIES
      ========================================== */}

      {playersOfTheSeries.length > 0 && (
        <div className="award-section">

          <div className="award-title d-flex align-items-center">

            <span className="award-icon">
              ⭐
            </span>

            <div>
              <h2>
                Player of the Series
              </h2>

              <p>
                Top performer of the series
              </p>
            </div>

          </div>


          <div className="players-grid">

            {playersOfTheSeries.map((player, index) => (
              <div
                className="player-card d-flex align-items-center"
                key={player.id || index}
              >

                <div className="player-image-wrapper flex-shrink-0">

                  <img
                    src={`https://static.cricbuzz.com/a/img/v1/i1/c${player?.imageDetails?.imageId}/dan-lawrence.jpg?d=low&p=gthumb`}
                    alt={player.name || "Player"}
                    className="player-image"
                  />

                </div>


                <div className="player-info flex-grow-1">

                  <h3>
                    {player.name}
                  </h3>

                  {player.fullName &&
                    player.fullName !== player.name && (
                      <span className="player-full-name">
                        {player.fullName}
                      </span>
                    )}


                  <div className="player-stats d-flex">

                    {player.battingSummary && (
                      <div className="stat-box">
                        <span>
                          BAT
                        </span>

                        <strong>
                          {player.battingSummary}
                        </strong>
                      </div>
                    )}

                    {player.bowlingSummary && (
                      <div className="stat-box">
                        <span>
                          BOWL
                        </span>

                        <strong>
                          {player.bowlingSummary}
                        </strong>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

        case 'In Progress':
          return <> <section className="score-section">


                        {/* SCORE HEADER */}

                        <div className="score-header">

                            <div>

                                <span className="score-label">

                                    {matchInfo?.matchFormat ||
                                        "CRICKET"}

                                </span>


                                <h1>

                                    {currentTeam?.teamScore ??
                                        "-"}

                                    <small>

                                        /
                                        {currentTeam?.teamWkts ??
                                            "-"}

                                    </small>

                                </h1>


                                <div className="score-overs">

                                    {mini?.overs ?? "-"}
                                    {" "}
                                    overs


                                    <span>

                                        CRR:
                                        {" "}
                                        {mini?.currentRunRate ??
                                            "-"}

                                    </span>

                                </div>

                            </div>



                            <div className="score-status">

                                <span>

                                    {matchData?.status}

                                </span>


                                <strong>

                                    {matchInfo?.customStatus}

                                </strong>

                            </div>

                        </div>



                        {/* =================================
                            INNINGS
                        ================================= */}

                        <div className="innings-section">


                            <div className="section-title">

                                <i className="bi bi-bar-chart-fill"></i>

                                Score Summary

                            </div>


                            <div className="innings-list">


                                {innings.map(
                                    (inning, index) => (

                                        <div
                                            className="innings-card"
                                            key={
                                                inning.inningsId ||
                                                index
                                            }
                                        >


                                            <div>

                                                <span className="innings-team">

                                                    {
                                                        inning.batTeamName
                                                    }

                                                </span>


                                                <small>

                                                    Innings{" "}
                                                    {index + 1}

                                                </small>

                                            </div>



                                            <div className="innings-score">

                                                <strong>

                                                    {inning.score}

                                                    <small>

                                                        /
                                                        {
                                                            inning.wickets
                                                        }

                                                    </small>

                                                </strong>


                                                <span>

                                                    {
                                                        inning.overs
                                                    }
                                                    {" "}
                                                    overs

                                                </span>

                                            </div>


                                        </div>

                                    )
                                )}

                            </div>

                        </div>



                        {/* =================================
                            BATTERS + BOWLERS
                        ================================= */}

                        <div className="player-stats">


                            {/* BATTING */}

                            <div className="stat-box">


                                <div className="stat-heading">

                                    <i className="bi bi-person-fill"></i>

                                    Batting

                                </div>


                                <div className="player-row header-row">

                                    <span>
                                        Batter
                                    </span>

                                    <span>
                                        R
                                    </span>

                                    <span>
                                        B
                                    </span>

                                    <span>
                                        4s
                                    </span>

                                    <span>
                                        6s
                                    </span>

                                    <span>
                                        SR
                                    </span>

                                </div>


                                <PlayerRow
                                    player={
                                        mini?.batsmanStriker
                                    }
                                    active
                                />


                                <PlayerRow
                                    player={
                                        mini?.batsmanNonStriker
                                    }
                                />

                            </div>



                            {/* BOWLING */}

                            <div className="stat-box">


                                <div className="stat-heading">

                                    <i className="bi bi-bullseye"></i>

                                    Bowling

                                </div>


                                <div className="player-row header-row">

                                    <span>
                                        Bowler
                                    </span>

                                    <span>
                                        O
                                    </span>

                                    <span>
                                        M
                                    </span>

                                    <span>
                                        R
                                    </span>

                                    <span>
                                        W
                                    </span>

                                    <span>
                                        ECO
                                    </span>

                                </div>


                                <BowlerRow
                                    player={
                                        mini?.bowlerStriker
                                    }
                                    active
                                />


                                <BowlerRow
                                    player={
                                        mini?.bowlerNonStriker
                                    }
                                />

                            </div>

                        </div>



                        {/* =================================
                            KEY STATS
                        ================================= */}

                        <div className="key-stats">


                            <div className="key-stat">

                                <span>
                                    Partnership
                                </span>


                                <strong>

                                    {
                                        mini?.partnerShip?.runs ??
                                        0
                                    }

                                    <small>

                                        (
                                        {
                                            mini?.partnerShip?.balls ??
                                            0
                                        }
                                        )

                                    </small>

                                </strong>

                            </div>



                            <div className="key-stat">

                                <span>
                                    Last Wicket
                                </span>


                                <strong>

                                    {
                                        mini?.lastWicket ||
                                        "No wicket"
                                    }

                                </strong>

                            </div>



                            <div className="key-stat">

                                <span>
                                    Recent Overs
                                </span>


                                <strong>

                                    {
                                        mini?.recentOvsStats ||
                                        "-"
                                    }

                                </strong>

                            </div>



                            <div className="key-stat">

                                <span>
                                    Toss
                                </span>


                                <strong>

                                    {
                                        matchInfo?.tossResults
                                            ?.tossWinnerName

                                        ? `${matchInfo.tossResults.tossWinnerName} (${matchInfo.tossResults.decision})`

                                        : "-"
                                    }

                                </strong>

                            </div>


                        </div>



                        {/* =================================
                            LATEST PERFORMANCE
                        ================================= */}

                        {latestPerformance.length > 0 && (

                            <div className="performance-box">


                                {latestPerformance.map(
                                    (item, index) => (

                                        <div key={index}>

                                            <span>
                                                {item.label}
                                            </span>


                                            <strong>

                                                {item.runs}
                                                {" "}
                                                runs


                                                {item.wkts > 0 &&
                                                    `, ${item.wkts} wkts`
                                                }

                                            </strong>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section></>;
        default:
          return <>Koi data nahi hai</>;
      }
    })()} {/* Dhyan dein: function ke khatam hote hi end mein () lagana zaroori hai */}
  </div>


                   



                    {/* =====================================
                        COMMENTARY
                    ===================================== */}

                    <section className="commentary-section">


                        <div className="commentary-header">


                            <div>

                                <span>
                                    MATCH CENTER
                                </span>


                                <h2>
                                    Commentary
                                </h2>

                            </div>


                            <div className="commentary-ball">

                                <i className="bi bi-broadcast-pin"></i>

                                LIVE

                            </div>


                        </div>



                        <div className="commentary-list">


                            {commentaryData.length > 0 ? (

                                commentaryData.map(
                                    (item, index) => (

                                        <div
                                            className="commentary-item"
                                            key={`${item.timestamp}-${index}`}
                                        >


                                            {/* BALL */}

                                            <div className="commentary-over">

                                                {
                                                    item.ballMetric
                                                        ? item.ballMetric
                                                        : item.overSeparator
                                                            ?.overNumber
                                                            ? `${item.overSeparator.overNumber}`
                                                            : "-"
                                                }

                                            </div>



                                            {/* CONTENT */}

                                            <div className="commentary-content">


                                                <div className="commentary-meta">


                                                    <strong>

                                                        {
                                                            item.teamName ||
                                                            ""
                                                        }

                                                    </strong>


                                                    {item.batsmanDetails
                                                        ?.playerName && (

                                                        <span>

                                                            {
                                                                item.batsmanDetails.playerName
                                                            }

                                                        </span>

                                                    )}


                                                    {item.bowlerDetails
                                                        ?.playerName && (

                                                        <span>

                                                            vs{" "}

                                                            {
                                                                item.bowlerDetails.playerName
                                                            }

                                                        </span>

                                                    )}

                                                </div>



                                                <p
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            item.commText ||
                                                            ""
                                                    }}
                                                />

                                            </div>


                                        </div>

                                    )
                                )

                            ) : (

                                <div className="no-commentary">

                                    No commentary available.

                                </div>

                            )}

                        </div>

                    </section>

                </>

            )}



            {/* =====================================
                SCORECARD TAB
            ===================================== */}

            {activeTab === "Scorecard" && (

                <Scorecard
                    matchId={matchId}
                />

            )}



            {/* =====================================
                INFO TAB
            ===================================== */}

            {activeTab === "Info" && (

                <MatchFacts matchId={matchId} />

            )}



            {/* =====================================
                SQUADS TAB
            ===================================== */}

            {activeTab === "Squads" && (

                <Squad
                    matchId={matchId}
                />

            )}



            {/* =====================================
                OVERS TAB
            ===================================== */}

            {activeTab === "Overs" && (

                <Overs
                    matchId={matchId}
                />
            )}



            {/* =====================================
                GRAPHS TAB
            ===================================== */}

            {activeTab === "Graphs" && (

                <BallMap
                    matchId={matchId}
                />

            )}

        </main>

    );

}



/* ==========================================
   PLAYER ROW
========================================== */

function PlayerRow({ player, active }) {

    if (!player) {
        return null;
    }


    return (

        <div className="player-row">


            <span
                className={
                    active
                        ? "active-player"
                        : ""
                }
            >

                {player.batName}

                {active && " *"}

            </span>


            <span>
                {player.batRuns}
            </span>


            <span>
                {player.batBalls}
            </span>


            <span>
                {player.batFours}
            </span>


            <span>
                {player.batSixes}
            </span>


            <span>

                {
                    Number(
                        player.batStrikeRate || 0
                    ).toFixed(2)
                }

            </span>


        </div>

    );

}



/* ==========================================
   BOWLER ROW
========================================== */

function BowlerRow({ player, active }) {

    if (!player) {
        return null;
    }


    return (

        <div className="player-row">


            <span
                className={
                    active
                        ? "active-player"
                        : ""
                }
            >

                {player.bowlName}

                {active && " *"}

            </span>


            <span>
                {player.bowlOvs}
            </span>


            <span>
                {player.bowlMaidens}
            </span>


            <span>
                {player.bowlRuns}
            </span>


            <span>
                {player.bowlWkts}
            </span>


            <span>
                {player.bowlEcon}
            </span>


        </div>

    );

}


export default MatchCenter;