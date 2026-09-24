import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BackApi from "../../Services/Back";
import "./Stats.css";

function Stats() {

    const { seriesId } = useParams();

    const [activeStat, setActiveStat] = useState("mostRuns");

    const [headers, setHeaders] = useState([]);
    const [statsData, setStatsData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    /* =========================================
       STATS MENU
    ========================================= */

    const battingStats = [
        { key: "mostRuns", title: "Most Runs", icon: "bi-graph-up" },
        { key: "highestScore", title: "Highest Scores", icon: "bi-trophy" },
        { key: "highestAvg", title: "Best Batting Average", icon: "bi-calculator" },
        { key: "highestSr", title: "Best Batting Strike Rate", icon: "bi-speedometer2" },
        { key: "mostHundreds", title: "Most Hundreds", icon: "bi-123" },
        { key: "mostFifties", title: "Most Fifties", icon: "bi-star" },
        { key: "mostFours", title: "Most Fours", icon: "bi-bounding-box" },
        { key: "mostSixes", title: "Most Sixes", icon: "bi-6-circle" },
        { key: "mostNineties", title: "Most Nineties", icon: "bi-9-circle" }
    ];

    const bowlingStats = [
        { key: "mostWickets", title: "Most Wickets", icon: "bi-crosshair" },
        { key: "lowestAvg", title: "Best Bowling Average", icon: "bi-calculator" },
        { key: "bestBowlingInnings", title: "Best Bowling", icon: "bi-stars" },
        { key: "mostFiveWickets", title: "Most Five Wickets", icon: "bi-5-circle" },
        { key: "lowestEcon", title: "Lowest Economy", icon: "bi-speedometer" },
        { key: "lowestSr", title: "Lowest Strike Rate", icon: "bi-lightning" }
    ];

    const allStats = [...battingStats, ...bowlingStats];


    /* =========================================
       WHICH COLUMN TO HIGHLIGHT AS THE
       "HEADLINE" STAT FOR EACH MENU ITEM
       (must match the exact header text the
       API returns for that statKey)
    ========================================= */

    const highlightColumnMap = {
        mostRuns: "RUNS",
        highestScore: "RUNS",
        highestAvg: "Avg",
        highestSr: "SR",
        mostHundreds: "100s",
        mostFifties: "50s",
        mostFours: "4s",
        mostSixes: "6s",
        mostNineties: "90s",
        mostWickets: "WKTS",
        lowestAvg: "Avg",
        bestBowlingInnings: "BBI",
        mostFiveWickets: "5-FERS",
        lowestEcon: "Eco",
        lowestSr: "SR"
    };


    /* =========================================
       ACTIVE STAT INFO
    ========================================= */

    const activeStatInfo = useMemo(() => {
        return (
            allStats.find((item) => item.key === activeStat) ||
            battingStats[1]
        );
    }, [activeStat]);


    /* =========================================
       FETCH STATS
    ========================================= */

    const getStats = async (statKey) => {

        try {

            setLoading(true);
            setError(false);
            setErrorMessage("");
            setStatsData([]);
            setHeaders([]);

            const response = await BackApi.get(
                `/series/${seriesId}/stats/${statKey}`
            );

            console.log(`${statKey} API:`, response.data);

            if (!response?.data?.success) {
                setError(true);
                setErrorMessage(
                    response?.data?.message ||
                        "Stats not available for this record."
                );
                return;
            }

            const apiHeaders = Array.isArray(response?.data?.headers)
                ? response.data.headers
                : [];

            const apiData = Array.isArray(response?.data?.data)
                ? response.data.data
                : [];

            setHeaders(apiHeaders);
            setStatsData(apiData);

        } catch (err) {

            console.log(`${statKey} API Error:`, err);

            setStatsData([]);
            setHeaders([]);
            setError(true);
            setErrorMessage("Something went wrong while loading this statistic.");

        } finally {
            setLoading(false);
        }
    };


    /* =========================================
       FIRST LOAD / ON CHANGE
    ========================================= */

    useEffect(() => {
        if (!seriesId) return;
        getStats(activeStat);
    }, [seriesId, activeStat]);


    /* =========================================
       HELPERS
    ========================================= */

    const getInitial = (name) => {
        if (!name) return "?";
        return name.trim().charAt(0).toUpperCase();
    };

    // First header from the API is always the player/batter/bowler name column
    const nameColumn = headers?.[0];

    // Remaining headers (rendered as plain table columns)
    const restColumns = headers?.slice(1) || [];

    const highlightColumn = highlightColumnMap[activeStat];


    /* =========================================
       MENU DESCRIPTION (static UI copy only)
    ========================================= */

    const getDescription = () => {
        switch (activeStat) {
            case "mostRuns": return "Top run scorers in the series";
            case "highestScore": return "Top individual scores in the series";
            case "highestAvg": return "Best batting averages in the series";
            case "highestSr": return "Best batting strike rates in the series";
            case "mostHundreds": return "Players with most hundreds";
            case "mostFifties": return "Players with most fifties";
            case "mostFours": return "Players with most fours";
            case "mostSixes": return "Players with most sixes";
            case "mostNineties": return "Players with scores in the nineties";
            case "mostWickets": return "Top wicket takers in the series";
            case "lowestAvg": return "Best bowling averages in the series";
            case "bestBowlingInnings": return "Best bowling performances";
            case "mostFiveWickets": return "Most five-wicket hauls";
            case "lowestEcon": return "Best economy rates in the series";
            case "lowestSr": return "Best bowling strike rates";
            default: return "Series statistics";
        }
    };


    /* =========================================
       RENDER
    ========================================= */

    return (
        <div className="stats-page">

            {/* =====================================
                SERIES HEADER
            ===================================== */}

            <div className="stats-series-header">

                <div className="stats-series-title">

                    <div className="stats-series-icon">
                        <i className="bi bi-trophy-fill"></i>
                    </div>

                    <div>
                        <h2>Series Statistics</h2>
                        <p>Detailed batting and bowling records</p>
                    </div>

                </div>

                <div className="stats-series-id">
                    <span>Series ID:</span>
                    <strong>{seriesId}</strong>
                </div>

            </div>


            {/* =====================================
                MAIN STATS AREA
            ===================================== */}

            <div className="stats-layout">

                {/* =================================
                    LEFT MENU
                ================================= */}

                <aside className="stats-sidebar">

                    {/* BATTING */}
                    <div className="stats-menu-section">

                        <div className="stats-menu-title">
                            <i className="bi bi-badge-4k-fill"></i>
                            <span>Batting</span>
                        </div>

                        <div className="stats-menu-list">
                            {battingStats.map((stat) => (
                                <button
                                    key={stat.key}
                                    type="button"
                                    className={`stats-menu-item ${
                                        activeStat === stat.key ? "active" : ""
                                    }`}
                                    onClick={() => setActiveStat(stat.key)}
                                >
                                    <span>{stat.title}</span>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* BOWLING */}
                    <div className="stats-menu-section">

                        <div className="stats-menu-title">
                            <i className="bi bi-circle-half"></i>
                            <span>Bowling</span>
                        </div>

                        <div className="stats-menu-list">
                            {bowlingStats.map((stat) => (
                                <button
                                    key={stat.key}
                                    type="button"
                                    className={`stats-menu-item ${
                                        activeStat === stat.key ? "active" : ""
                                    }`}
                                    onClick={() => setActiveStat(stat.key)}
                                >
                                    <span>{stat.title}</span>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            ))}
                        </div>

                    </div>

                </aside>


                {/* =================================
                    RIGHT CONTENT
                ================================= */}

                <main className="stats-content">

                    {/* HEADER */}
                    <div className="stats-content-header">

                        <div className="stats-heading">

                            <div className="stats-heading-icon">
                                <i className="bi bi-bar-chart-fill"></i>
                            </div>

                            <div>
                                <h1>{activeStatInfo.title}</h1>
                                <p>{getDescription()}</p>
                            </div>

                        </div>

                        <div className="stats-header-right">
                            <div className="stats-format">
                                <span>Series</span>
                                <i className="bi bi-chevron-down"></i>
                            </div>
                        </div>

                    </div>


                    {/* =================================
                        TABLE
                    ================================= */}

                    <div className="stats-table-wrapper">

                        {loading ? (

                            <div className="stats-loading">

                                <div className="stats-loading-header"></div>

                                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                                    <div className="stats-loading-row" key={item}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                ))}

                            </div>

                        ) : error ? (

                            <div className="stats-empty">

                                <div className="stats-empty-icon">
                                    <i className="bi bi-exclamation-circle"></i>
                                </div>

                                <h4>Unable to load statistics</h4>

                                <p>{errorMessage}</p>

                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => getStats(activeStat)}
                                >
                                    <i className="bi bi-arrow-clockwise me-2"></i>
                                    Try Again
                                </button>

                            </div>

                        ) : statsData.length === 0 ? (

                            <div className="stats-empty">

                                <div className="stats-empty-icon">
                                    <i className="bi bi-bar-chart"></i>
                                </div>

                                <h4>No Data Available</h4>

                                <p>No records are available for this statistic.</p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table
                                    className="table stats-table"
                                    style={{ "--bs-table-bg": "transparent" }}
                                >

                                    <thead>
                                        <tr>

                                            <th style={{ width: "50px" }}>#</th>

                                            <th>{nameColumn}</th>

                                            {restColumns.map((col) => (
                                                <th
                                                    key={col}
                                                    className={
                                                        col === highlightColumn
                                                            ? "stats-th-highlight"
                                                            : ""
                                                    }
                                                >
                                                    {col}
                                                </th>
                                            ))}

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {statsData.map((row, index) => {

                                            const playerName = row?.[nameColumn] || "Unknown";

                                            return (
                                                <tr key={index}>

                                                    {/* RANK */}
                                                    <td className="stats-rank">
                                                        {index + 1}
                                                    </td>

                                                    {/* PLAYER */}
                                                    <td>
                                                        <div className="stats-player">

                                                            <div className="stats-player-image">
                                                                {getInitial(playerName)}
                                                            </div>

                                                            <div className="stats-player-info">
                                                                <span className="stats-player-name">
                                                                    {playerName}
                                                                </span>
                                                            </div>

                                                        </div>
                                                    </td>

                                                    {/* REMAINING API COLUMNS, IN ORDER */}
                                                    {restColumns.map((col) => (
                                                        <td
                                                            key={col}
                                                            className={
                                                                col === highlightColumn
                                                                    ? "stats-main-value"
                                                                    : ""
                                                            }
                                                        >
                                                            {row?.[col] ?? "-"}
                                                        </td>
                                                    ))}

                                                </tr>
                                            );
                                        })}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>


                    {/* FOOTER */}
                    {!loading && !error && statsData.length > 0 && (

                        <div className="stats-content-footer">

                            <span>Showing {statsData.length} players</span>

                            <button
                                type="button"
                                className="stats-full-list-btn"
                                onClick={() => getStats(activeStat)}
                            >
                                Refresh List
                                <i className="bi bi-arrow-right"></i>
                            </button>

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
}

export default Stats;