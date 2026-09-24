import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackApi from "../../Services/Back";
import "./PointTable.css";

function PointTable() {
    const { seriesId } = useParams();
    const navigate = useNavigate();

    const [pointsData, setPointsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [expandedTeam, setExpandedTeam] = useState(null);

    const getPointsTable = async () => {
        try {
            setLoading(true);
            setError(false);

            const response = await BackApi.get(
                `/series/${seriesId}/points-table`
            );

            console.log("Points Table:", response.data);

            const tableData =
                response?.data?.pointsTable?.[0]?.pointsTableInfo || [];

            setPointsData(tableData);
        } catch (err) {
            console.log("Points Table Error:", err);
            setError(true);
            setPointsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!seriesId) return;

        getPointsTable();
    }, [seriesId]);

    const toggleTeam = (teamId) => {
        setExpandedTeam(
            expandedTeam === teamId ? null : teamId
        );
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "-";

        const date = new Date(Number(timestamp));

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
        });
    };

    const getResultClass = (result) => {
        if (!result) return "pt-badge pt-badge-neutral";

        const value = result.toLowerCase();

        if (value.startsWith("won")) {
            return "pt-badge pt-badge-win";
        }

        if (value.startsWith("lost")) {
            return "pt-badge pt-badge-loss";
        }

        if (value.includes("tied")) {
            return "pt-badge pt-badge-tie";
        }

        return "pt-badge pt-badge-neutral";
    };

    const getFormClass = (form) => {
        switch (form) {
            case "W":
                return "pt-form-dot pt-form-win";

            case "L":
                return "pt-form-dot pt-form-loss";

            case "T":
                return "pt-form-dot pt-form-tie";

            default:
                return "pt-form-dot pt-form-neutral";
        }
    };

    const getRankClass = (index) => {
        if (index === 0) return "pt-rank pt-rank-gold";
        if (index === 1) return "pt-rank pt-rank-silver";
        if (index === 2) return "pt-rank pt-rank-bronze";
        return "pt-rank";
    };


    /* =========================================
        LOADING
    ========================================= */

    if (loading) {
        return (
            <div className="container-fluid py-4 pt-wrapper">

                <div className="pt-skeleton-head mb-3"></div>

                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="pt-skeleton-row mb-2"
                    ></div>
                ))}

            </div>
        );
    }


    /* =========================================
        ERROR
    ========================================= */

    if (error) {
        return (
            <div className="container-fluid py-5 text-center pt-wrapper">

                <div className="pt-error-box d-inline-block px-4 py-3 mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Unable to load points table.
                </div>

                <div>
                    <button
                        className="btn pt-btn-primary"
                        onClick={getPointsTable}
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Try Again
                    </button>
                </div>

            </div>
        );
    }

    return (
        <div className="container-fluid py-3 pt-wrapper">

            {/* =========================================
                TITLE
            ========================================= */}

            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">

                <div>
                    <h5 className="mb-1 fw-bold pt-title">
                        Points Table
                    </h5>

                    <small className="pt-subtitle">
                        Series {seriesId}
                    </small>
                </div>

                <button
                    type="button"
                    className="btn btn-sm pt-btn-refresh"
                    onClick={getPointsTable}
                >
                    <i className="bi bi-arrow-clockwise"></i>
                </button>

            </div>


            {/* =========================================
                EMPTY
            ========================================= */}

            {pointsData.length === 0 ? (

                <div className="pt-empty-box text-center">
                    <i className="bi bi-table me-2"></i>
                    No points table data available.
                </div>

            ) : (

                <div className="pt-table-card table-responsive">

                    <table className="table table-hover align-middle mb-0 pt-table"  style={{ "--bs-table-bg": "transparent" }}>

                        {/* ================= HEADER ================= */}

                        <thead>

                            <tr>

                                <th
                                    className="text-center"
                                    style={{ width: "50px" }}
                                >
                                    #
                                </th>

                                <th>
                                    Teams
                                </th>

                                <th className="text-center">
                                    P
                                </th>

                                <th className="text-center">
                                    W
                                </th>

                                <th className="text-center">
                                    L
                                </th>

                                <th className="text-center">
                                    NR
                                </th>

                                <th className="text-center">
                                    PTS
                                </th>

                                <th className="text-center">
                                    NRR
                                </th>

                                <th
                                    className="text-center"
                                    style={{ width: "60px" }}
                                >
                                    {/* Arrow */}
                                </th>

                            </tr>

                        </thead>


                        {/* ================= BODY ================= */}

                        <tbody>

                            {pointsData.map((team, index) => {

                                const isExpanded =
                                    expandedTeam === team.teamId;

                                return (
                                    <React.Fragment key={team.teamId}>

                                        {/* ================= TEAM ROW ================= */}

                                        <tr
                                            className={`pt-row ${
                                                isExpanded ? "pt-row-active" : ""
                                            }`}
                                            onClick={() => toggleTeam(team.teamId)}
                                        >

                                            {/* Position */}

                                            <td className="text-center">
                                                <span className={getRankClass(index)}>
                                                    {index + 1}
                                                </span>
                                            </td>


                                            {/* Team */}

                                            <td>

                                                <div className="d-flex align-items-center gap-2">

                                                    <div className="pt-team-logo">
                                                        {team?.teamName?.charAt(0)}
                                                    </div>

                                                    <div>

                                                        <div className="d-flex align-items-center gap-2">

                                                            <span className="pt-team-name">
                                                                {team?.teamName}
                                                            </span>

                                                            {team?.teamQualifyStatus && (
                                                                <span
                                                                    className={`pt-tag ${
                                                                        team.teamQualifyStatus === "Q"
                                                                            ? "pt-tag-q"
                                                                            : team.teamQualifyStatus === "E"
                                                                                ? "pt-tag-e"
                                                                                : "pt-tag-n"
                                                                    }`}
                                                                >
                                                                    {team.teamQualifyStatus}
                                                                </span>
                                                            )}

                                                        </div>

                                                        <small className="pt-team-full">
                                                            {team?.teamFullName}
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* Played */}

                                            <td className="text-center">
                                                <span className="pt-badge pt-badge-neutral">
                                                    {team?.matchesPlayed ?? 0}
                                                </span>
                                            </td>


                                            {/* Won */}

                                            <td className="text-center">
                                                <span className="pt-badge pt-badge-win">
                                                    {team?.matchesWon ?? 0}
                                                </span>
                                            </td>


                                            {/* Lost */}

                                            <td className="text-center">
                                                <span className="pt-badge pt-badge-loss">
                                                    {team?.matchesLost ?? 0}
                                                </span>
                                            </td>


                                            {/* NR */}

                                            <td className="text-center">
                                                <span className="pt-badge pt-badge-neutral">
                                                    {team?.noRes ?? 0}
                                                </span>
                                            </td>


                                            {/* Points */}

                                            <td className="text-center">

                                                <span className="pt-badge pt-badge-points">
                                                    {team?.points ?? 0}
                                                </span>

                                            </td>


                                            {/* NRR */}

                                            <td className="text-center">

                                                <span
                                                    className={`pt-badge ${
                                                        String(team?.nrr || "").startsWith("+")
                                                            ? "pt-badge-win"
                                                            : "pt-badge-loss"
                                                    }`}
                                                >
                                                    {team?.nrr || "0.000"}
                                                </span>

                                            </td>


                                            {/* Arrow */}

                                            <td className="text-center">

                                                <button
                                                    type="button"
                                                    className="pt-expand-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleTeam(team.teamId);
                                                    }}
                                                >
                                                    <i
                                                        className={`bi bi-chevron-down pt-chevron ${
                                                            isExpanded ? "pt-chevron-open" : ""
                                                        }`}
                                                    ></i>
                                                </button>

                                            </td>

                                        </tr>


                                        {/* =================================================
                                            EXPANDED MATCH DETAILS
                                        ================================================= */}

                                        {isExpanded && (
                                            <tr className="pt-expand-row">

                                                <td
                                                    colSpan="9"
                                                    className="p-0"
                                                >

                                                    <div className="pt-expand-panel">

                                                        {/* Team summary */}

                                                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">

                                                            <div className="d-flex align-items-center gap-2">

                                                                <span className="pt-badge pt-badge-points px-3 py-2">
                                                                    {team?.teamName}
                                                                </span>

                                                                <span className="pt-subtitle">
                                                                    Match Details
                                                                </span>

                                                            </div>

                                                            <div className="d-flex gap-2 flex-wrap">

                                                                <span className="pt-badge pt-badge-neutral">
                                                                    Played: {team?.matchesPlayed}
                                                                </span>

                                                                <span className="pt-badge pt-badge-win">
                                                                    Won: {team?.matchesWon}
                                                                </span>

                                                                <span className="pt-badge pt-badge-loss">
                                                                    Lost: {team?.matchesLost}
                                                                </span>

                                                            </div>

                                                        </div>


                                                        {/* =================
                                                            FORM
                                                        ================= */}

                                                        {team?.form?.length > 0 && (

                                                            <div className="mb-3">

                                                                <div className="pt-section-label mb-2">
                                                                    Recent Form
                                                                </div>

                                                                <div className="d-flex gap-2 flex-wrap">

                                                                    {team.form.map(
                                                                        (form, formIndex) => (
                                                                            <span
                                                                                key={formIndex}
                                                                                className={getFormClass(form)}
                                                                                style={{
                                                                                    animationDelay: `${
                                                                                        formIndex * 0.05
                                                                                    }s`,
                                                                                }}
                                                                            >
                                                                                {form}
                                                                            </span>
                                                                        )
                                                                    )}

                                                                </div>

                                                            </div>

                                                        )}


                                                        {/* =================
                                                            MATCH TABLE
                                                        ================= */}

                                                        {team?.teamMatches?.length > 0 ? (

                                                            <div className="table-responsive pt-subtable-wrap">

                                                                <table className="table table-hover align-middle mb-0 pt-subtable">

                                                                    <thead>

                                                                        <tr>

                                                                            <th>
                                                                                Opposition
                                                                            </th>

                                                                            <th>
                                                                                Description
                                                                            </th>

                                                                            <th>
                                                                                Date
                                                                            </th>

                                                                            <th>
                                                                                Result
                                                                            </th>

                                                                            <th>
                                                                                NRR Change
                                                                            </th>

                                                                            <th>
                                                                                Match ID
                                                                            </th>

                                                                            <th>
                                                                                Details
                                                                            </th>

                                                                        </tr>

                                                                    </thead>


                                                                    <tbody>

                                                                        {team.teamMatches.map(
                                                                            (match, matchIndex) => (

                                                                                <tr
                                                                                    key={match.matchId}
                                                                                    className="pt-subrow"
                                                                                    style={{
                                                                                        animationDelay: `${
                                                                                            matchIndex * 0.04
                                                                                        }s`,
                                                                                    }}
                                                                                >

                                                                                    {/* Opposition */}

                                                                                    <td>

                                                                                        <div className="d-flex align-items-center gap-2">

                                                                                            <div className="pt-opp-logo">
                                                                                                {match?.opponentSName?.charAt(
                                                                                                    0
                                                                                                )}
                                                                                            </div>

                                                                                            <div>

                                                                                                <div className="pt-opp-name">
                                                                                                    {match?.opponentSName}
                                                                                                </div>

                                                                                                <small className="pt-team-full">
                                                                                                    {match?.opponent}
                                                                                                </small>

                                                                                            </div>

                                                                                        </div>

                                                                                    </td>


                                                                                    {/* Description */}

                                                                                    <td>

                                                                                        <span className="pt-badge pt-badge-outline">
                                                                                            {match?.matchName}
                                                                                        </span>

                                                                                    </td>


                                                                                    {/* Date */}

                                                                                    <td>

                                                                                        <span className="pt-badge pt-badge-info">
                                                                                            {formatDate(
                                                                                                match?.startdt
                                                                                            )}
                                                                                        </span>

                                                                                    </td>


                                                                                    {/* Result */}

                                                                                    <td>

                                                                                        <span
                                                                                            className={getResultClass(
                                                                                                match?.result
                                                                                            )}
                                                                                        >
                                                                                            {match?.result ||
                                                                                                "-"}
                                                                                        </span>

                                                                                    </td>


                                                                                    {/* NRR */}

                                                                                    <td>

                                                                                        <span
                                                                                            className={`pt-badge ${
                                                                                                String(
                                                                                                    match?.nrrChanges
                                                                                                ).startsWith("+")
                                                                                                    ? "pt-badge-win"
                                                                                                    : String(
                                                                                                          match?.nrrChanges
                                                                                                      ).startsWith("-")
                                                                                                        ? "pt-badge-loss"
                                                                                                        : "pt-badge-neutral"
                                                                                            }`}
                                                                                        >
                                                                                            {match?.nrrChanges ||
                                                                                                "-"}
                                                                                        </span>

                                                                                    </td>


                                                                                    {/* Match ID */}

                                                                                    <td>

                                                                                        <span className="pt-badge pt-badge-neutral">
                                                                                            {match?.matchId}
                                                                                        </span>

                                                                                    </td>


                                                                                    {/* Details */}

                                                                                    <td>

                                                                                        <button
                                                                                            type="button"
                                                                                            className="pt-goto-btn"
                                                                                            onClick={() =>
                                                                                                navigate(
                                                                                                    `/match/${match?.matchId}`
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <i className="bi bi-arrow-right"></i>
                                                                                        </button>

                                                                                    </td>

                                                                                </tr>

                                                                            )
                                                                        )}

                                                                    </tbody>

                                                                </table>

                                                            </div>

                                                        ) : (

                                                            <div className="pt-empty-box mb-0">
                                                                No match details available.
                                                            </div>

                                                        )}

                                                    </div>

                                                </td>

                                            </tr>
                                        )}

                                    </React.Fragment>
                                );
                            })}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default PointTable;