import React, { useEffect, useState } from "react";
import BackApi from "../Services/Back";
import "../Styles/Squad.css";

function Squad({ matchId }) {
    const [loading, setLoading] = useState(true);
    const [mainsquad, setMainsquad] = useState(null);

    const Squaddetail = async () => {
        try {
            setLoading(true);

            const response = await BackApi.get(`/${matchId}`);

            console.log("squad API:", response.data);

            setMainsquad(response.data);
        } catch (error) {
            console.error("Squad Error:", error);
            setMainsquad(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (matchId) {
            Squaddetail();
        }
    }, [matchId]);

    if (loading) {
        return (
            <div className="squad-loading">
                <div className="spinner-border" role="status"></div>
                <span>Loading squad...</span>
            </div>
        );
    }

    if (!mainsquad) {
        return (
            <div className="squad-empty">
                <i className="bi bi-exclamation-circle"></i>
                <h5>Squad not available</h5>
                <p>Unable to load squad information.</p>
            </div>
        );
    }

    // ==============================
    // DATA
    // ==============================

    const playingXI = mainsquad?.playingXI?.players || [];
    const benchPlayers = mainsquad?.bench?.players || [];
    const squadPlayers = mainsquad?.squad?.players || [];
    const supportStaff = mainsquad?.supportStaff?.staff || [];

    const team1 = mainsquad?.team1;
    const team2 = mainsquad?.team2;

    const hasPlayingXI = playingXI.length > 0;
    const hasBench = benchPlayers.length > 0;
    const hasSquad = squadPlayers.length > 0;
    const hasStaff = supportStaff.length > 0;

    const hasAnyPlayer = hasPlayingXI || hasBench || hasSquad || hasStaff;

    // ==============================
    // TEAM FILTER
    // ==============================

    const getTeamPlayers = (players, teamShortName) => {
        return players.filter(
            (player) =>
                player?.team?.toLowerCase() ===
                teamShortName?.toLowerCase()
        );
    };

    // Playing XI
    const team1Playing = getTeamPlayers(
        playingXI,
        team1?.shortName
    );

    const team2Playing = getTeamPlayers(
        playingXI,
        team2?.shortName
    );

    // Bench
    const team1Bench = getTeamPlayers(
        benchPlayers,
        team1?.shortName
    );

    const team2Bench = getTeamPlayers(
        benchPlayers,
        team2?.shortName
    );

    // Full Squad
    const team1Squad = getTeamPlayers(
        squadPlayers,
        team1?.shortName
    );

    const team2Squad = getTeamPlayers(
        squadPlayers,
        team2?.shortName
    );

    // Support Staff
    const team1Staff = getTeamPlayers(
        supportStaff,
        team1?.shortName
    );

    const team2Staff = getTeamPlayers(
        supportStaff,
        team2?.shortName
    );

    // ==============================
    // PLAYER CARD
    // ==============================

    const PlayerCard = ({ player, index }) => {
        return (
            <div className="squad-player-card">

                <div className="player-number">
                    {index + 1}
                </div>

                <div className="player-image-wrapper">

                    {player?.imageUrl ? (
                        <img
                            src={player.imageUrl.replace(
                                /&amp;/g,
                                "&"
                            )}
                            alt={player?.name || "Player"}
                            className="player-image"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";

                                if (e.currentTarget.nextSibling) {
                                    e.currentTarget.nextSibling.style.display =
                                        "flex";
                                }
                            }}
                        />
                    ) : null}

                    <div
                        className="player-image-placeholder"
                        style={{
                            display: player?.imageUrl
                                ? "none"
                                : "flex",
                        }}
                    >
                        <i className="bi bi-person-fill"></i>
                    </div>

                </div>

                <div className="player-info">

                    <div className="player-name">
                        {player?.name || "Unknown Player"}
                    </div>

                    <div className="player-role">
                        <i className="bi bi-person-badge"></i>
                        {player?.role || "Player"}
                    </div>

                </div>

            </div>
        );
    };

    // ==============================
    // PLAYER LIST
    // ==============================

    const PlayerList = ({ players }) => {

        if (!players || players.length === 0) {
            return (
                <div className="no-players">
                    No players available
                </div>
            );
        }

        return (
            <div className="players-list">

                {players.map((player, index) => (
                    <PlayerCard
                        key={
                            player?.id ||
                            `${player?.name}-${index}`
                        }
                        player={player}
                        index={index}
                    />
                ))}

            </div>
        );
    };

    // ==============================
    // TEAM COLUMN
    // ==============================

    const TeamColumn = ({
        team,
        players,
        title,
        badgeClass,
        emptyText = "No players available"
    }) => {

        return (
            <div className="col-lg-6">

                <div className="team-column">

                    {/* Team Header */}

                    <div className="team-header">

                        <div
                            className={`team-logo ${badgeClass}`}
                        >
                            {team?.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div>

                            <h4>
                                {team?.name || "Unknown Team"}
                            </h4>

                            <span>
                                {team?.shortName || ""}
                            </span>

                        </div>

                    </div>

                    {/* Section Title */}

                    <div className="section-title">

                        <span>
                            {title}
                        </span>

                        <span className="player-count">
                            {players.length}
                        </span>

                    </div>

                    {players.length > 0 ? (
                        <PlayerList players={players} />
                    ) : (
                        <div className="no-players">
                            {emptyText}
                        </div>
                    )}

                </div>

            </div>
        );
    };

    // ==============================
    // MAIN UI
    // ==============================

    return (
        <div className="squad-page">

            {/* ================================= */}
            {/* PAGE HEADER */}
            {/* ================================= */}

            <div className="squad-page-header">

                <div>

                    <div className="squad-title">

                        <i className="bi bi-people-fill"></i>

                        <div>

                            <h3>
                                Team Squad
                            </h3>

                            <p>
                                {hasPlayingXI
                                    ? "Playing XI announced"
                                    : hasSquad
                                        ? "Team squad information"
                                        : "Squad information"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================================= */}
            {/* NOT ANNOUNCED */}
            {/* ================================= */}

            {!hasAnyPlayer ? (

                <div className="squad-not-announced">

                    <div className="announce-icon">
                        <i className="bi bi-people"></i>
                    </div>

                    <h4>
                        Team Squad Not Announced Yet
                    </h4>

                    <p>
                        Playing XI, bench players and squad
                        information will appear here once the
                        teams announce their squad.
                    </p>

                </div>

            ) : (

                <>

                    {/* ================================= */}
                    {/* PLAYING XI */}
                    {/* ================================= */}

                    {hasPlayingXI && (

                        <section className="squad-section">

                            <div className="section-heading">

                                <div>

                                    <span className="section-label">
                                        MATCH SQUAD
                                    </span>

                                    <h4>
                                        Playing XI
                                    </h4>

                                </div>

                                <span className="section-badge">
                                    {playingXI.length} Players
                                </span>

                            </div>

                            <div className="row g-3">

                                <TeamColumn
                                    team={team1}
                                    players={team1Playing}
                                    title="Playing XI"
                                    badgeClass="team-one"
                                    emptyText="No Playing XI available"
                                />

                                <TeamColumn
                                    team={team2}
                                    players={team2Playing}
                                    title="Playing XI"
                                    badgeClass="team-two"
                                    emptyText="No Playing XI available"
                                />

                            </div>

                        </section>

                    )}

                    {/* ================================= */}
                    {/* BENCH */}
                    {/* ================================= */}

                    {hasBench && (

                        <section className="squad-section">

                            <div className="section-heading">

                                <div>

                                    <span className="section-label">
                                        RESERVES
                                    </span>

                                    <h4>
                                        Bench
                                    </h4>

                                </div>

                                <span className="section-badge">
                                    {benchPlayers.length} Players
                                </span>

                            </div>

                            <div className="row g-3">

                                <TeamColumn
                                    team={team1}
                                    players={team1Bench}
                                    title="Bench"
                                    badgeClass="team-one"
                                    emptyText="No bench players"
                                />

                                <TeamColumn
                                    team={team2}
                                    players={team2Bench}
                                    title="Bench"
                                    badgeClass="team-two"
                                    emptyText="No bench players"
                                />

                            </div>

                        </section>

                    )}

                    {/* ================================= */}
                    {/* FULL SQUAD */}
                    {/* ================================= */}

                    {hasSquad && (

                        <section className="squad-section">

                            <div className="section-heading">

                                <div>

                                    <span className="section-label">
                                        SQUAD
                                    </span>

                                    <h4>
                                        Full Squad
                                    </h4>

                                </div>

                                <span className="section-badge">
                                    {squadPlayers.length} Players
                                </span>

                            </div>

                            <div className="row g-3">

                                <TeamColumn
                                    team={team1}
                                    players={team1Squad}
                                    title="Squad"
                                    badgeClass="team-one"
                                    emptyText="No squad players"
                                />

                                <TeamColumn
                                    team={team2}
                                    players={team2Squad}
                                    title="Squad"
                                    badgeClass="team-two"
                                    emptyText="No squad players"
                                />

                            </div>

                        </section>

                    )}

                    {/* ================================= */}
                    {/* SUPPORT STAFF */}
                    {/* ================================= */}

                    {hasStaff && (

                        <section className="squad-section">

                            <div className="section-heading">

                                <div>

                                    <span className="section-label">
                                        TEAM MANAGEMENT
                                    </span>

                                    <h4>
                                        Support Staff
                                    </h4>

                                </div>

                                <span className="section-badge">
                                    {supportStaff.length} Staff
                                </span>

                            </div>

                            <div className="row g-3">

                                <TeamColumn
                                    team={team1}
                                    players={team1Staff}
                                    title="Support Staff"
                                    badgeClass="team-one"
                                    emptyText="No support staff available"
                                />

                                <TeamColumn
                                    team={team2}
                                    players={team2Staff}
                                    title="Support Staff"
                                    badgeClass="team-two"
                                    emptyText="No support staff available"
                                />

                            </div>

                        </section>

                    )}

                </>
            )}

        </div>
    );
}

export default Squad;