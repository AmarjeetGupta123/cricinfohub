import React, { useEffect, useState } from "react";
import api from "../Services/Api";

function Scorecard({ matchId }) {

    const [scorecard, setScorecard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeInnings, setActiveInnings] = useState(0);


    const getScorecard = async (showLoading = false) => {

        try {

            if (showLoading) {
                setLoading(true);
            }

            const response = await api.get(
                `/mcenter/scorecard/${matchId}`
            );

            console.log(
                "Scorecard API:",
                response.data
            );

            setScorecard(response.data);

        } catch (error) {

            console.error(
                "Scorecard Error:",
                error
            );

            setError(
                "Unable to load scorecard."
            );

        } finally {

            if (showLoading) {
                setLoading(false);
            }

        }

    };


    useEffect(() => {

        setActiveInnings(0);
        getScorecard(true);

        const interval = setInterval(() => {
            getScorecard(false);
        }, 30000);

        return () => {
            clearInterval(interval);
        };

    }, [matchId]);


    if (loading) {

        return (
            <div className="modern-scorecard-loading">

                <div
                    className="spinner-border"
                    role="status"
                ></div>

                <span>
                    Loading scorecard...
                </span>

            </div>
        );

    }


    if (error) {

        return (
            <div className="modern-scorecard-error">

                <i className="bi bi-exclamation-circle"></i>

                <span>
                    {error}
                </span>

            </div>
        );

    }


    const innings =
        scorecard?.scoreCard || [];

    const ordinal = (n) => {
        const labels = ["1st", "2nd", "3rd", "4th"];
        return labels[n] || `${n + 1}th`;
    };

    const currentInnings = innings[activeInnings] || null;


    return (

        <div className="modern-scorecard">


            {/* =================================
                SCORECARD HEADER
            ================================= */}

            <div className="modern-scorecard-header">

                <div>

                    <div className="scorecard-overline">

                        <span className="live-dot"></span>

                        SCORECARD

                    </div>


                    <h2>
                        Match Scorecard
                    </h2>


                    <p>
                        Complete batting & bowling
                        statistics
                    </p>

                </div>


                <div className="scorecard-header-badge">

                    <i className="bi bi-bar-chart-fill"></i>

                    {innings.length}{" "}
                    {innings.length === 1
                        ? "Innings"
                        : "Innings"
                    }

                </div>

            </div>



            {/* =================================
                INNINGS TABS
            ================================= */}

            {innings.length > 1 && (

                <div className="innings-tabs" role="tablist">

                    {innings.map((inning, index) => {

                        const isActive = index === activeInnings;

                        const teamShort =
                            inning.batTeamDetails
                                ?.batTeamShortName ||
                            inning.batTeamDetails
                                ?.batTeamName;

                        const runs =
                            inning.scoreDetails?.runs ?? 0;

                        const wkts =
                            inning.scoreDetails?.wickets ?? 0;

                        return (

                            <button
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                key={
                                    inning.inningsId ||
                                    index
                                }
                                className={
                                    "innings-tab" +
                                    (isActive
                                        ? " innings-tab-active"
                                        : "")
                                }
                                onClick={() =>
                                    setActiveInnings(index)
                                }
                            >

                                <span className="innings-tab-ordinal">
                                    {ordinal(index)} INNINGS
                                </span>

                                <span className="innings-tab-score">
  <span className="innings-team">{teamShort}</span>

  <strong className="innings-score">
    {runs}/{wkts}
  </strong>

  <span className="innings-separator">•</span>

  <span className="innings-overs">
    {inning.scoreDetails?.overs} OVERS
  </span>

  <span className="innings-separator">•</span>

  <span className="innings-rr">
    RR {inning.scoreDetails?.runRate}
  </span>
</span>

                            </button>

                        );

                    })}

                </div>

            )}



            {/* =================================
                SELECTED INNINGS
            ================================= */}

            {currentInnings && (() => {

                const inning = currentInnings;
                const index = activeInnings;

                const battingPlayers =
                    Object.values(
                        inning.batTeamDetails
                            ?.batsmenData || {}
                    );


                const bowlers =
                    Object.values(
                        inning.bowlTeamDetails
                            ?.bowlersData || {}
                    );


                const wickets =
                    Object.values(
                        inning.wicketsData || {}
                    );


                const partnerships =
                    Object.values(
                        inning.partnershipsData || {}
                    );


                return (

                    <section
                        className="modern-innings"
                        key={
                            inning.inningsId ||
                            index
                        }
                    >


                        



                        {/* =========================
                            QUICK STATS
                        ========================= */}

                        <div className="score-quick-stats">


                            <div className="quick-stat-card">

                                <div className="quick-stat-icon">
                                    <i className="bi bi-lightning-charge-fill"></i>
                                </div>

                                <div>

                                    <span>
                                        EXTRAS
                                    </span>

                                    <strong>
                                        {
                                            inning
                                                .extrasData
                                                ?.total ?? 0
                                        }
                                    </strong>

                                </div>

                            </div>



                            <div className="quick-stat-card">

                                <div className="quick-stat-icon">
                                    <i className="bi bi-speedometer2"></i>
                                </div>

                                <div>

                                    <span>
                                        RUN RATE
                                    </span>

                                    <strong>
                                        {
                                            inning
                                                .scoreDetails
                                                ?.runRate ??
                                            "-"
                                        }
                                    </strong>

                                </div>

                            </div>



                            <div className="quick-stat-card">

                                <div className="quick-stat-icon">
                                    <i className="bi bi-x-circle-fill"></i>
                                </div>

                                <div>

                                    <span>
                                        WICKETS
                                    </span>

                                    <strong>
                                        {
                                            inning
                                                .scoreDetails
                                                ?.wickets ??
                                            0
                                        }
                                    </strong>

                                </div>

                            </div>



                            <div className="quick-stat-card">

                                <div className="quick-stat-icon">
                                    <i className="bi bi-clock-fill"></i>
                                </div>

                                <div>

                                    <span>
                                        OVERS
                                    </span>

                                    <strong>
                                        {
                                            inning
                                                .scoreDetails
                                                ?.overs ??
                                            "-"
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>



                        {/* =========================
                            BATTING
                        ========================= */}

                        <div className="modern-section">


                            <div className="modern-section-heading">

                                <div>

                                    <span className="section-kicker">
                                        BATTING
                                    </span>

                                    <h3>
                                        Batting Performance
                                    </h3>

                                </div>


                                <div className="section-icon">

                                    <i className="bi bi-person-fill"></i>

                                </div>

                            </div>


                            <div className="modern-table-labels">
                                <span className="label-name">BATTER</span>
                                <span>R</span>
                                <span>B</span>
                                <span>4s</span>
                                <span>6s</span>
                                <span>SR</span>
                            </div>


                            <div className="batting-list">


                                {battingPlayers
                                .filter((batter)=>batter.outDesc?.trim())
                                .map(
                                    (batter) => (

                                        <div
                                            className={"modern-batter"}
                                            key={batter.batId}
                                        >

                                            <div className="batter-main">

                                                <div className="batter-avatar">

                                                    {batter.batName?.charAt(0)?.toUpperCase()}

                                                </div>


                                                <div>

                                                    <strong>

                                                        {batter.outDesc && batter.batName}

                                                    </strong>


                                                    <span>

                                                        {batter.outDesc}

                                                    </span>

                                                </div>

                                            </div>


                                            <div className="batter-stat">

                                                <strong>
                                                    {
                                                        batter
                                                            .runs
                                                    }
                                                </strong>

                                                <span>
                                                    RUNS
                                                </span>

                                            </div>


                                            <div className="batter-stat">

                                                <strong>
                                                    {
                                                        batter
                                                            .balls
                                                    }
                                                </strong>

                                                <span>
                                                    BALLS
                                                </span>

                                            </div>


                                            <div className="batter-stat">

                                                <strong>
                                                    {
                                                        batter
                                                            .fours
                                                    }
                                                </strong>

                                                <span>
                                                    4s
                                                </span>

                                            </div>


                                            <div className="batter-stat">

                                                <strong>
                                                    {
                                                        batter
                                                            .sixes
                                                    }
                                                </strong>

                                                <span>
                                                    6s
                                                </span>

                                            </div>


                                            <div className="batter-stat strike-rate">

                                                <strong>
                                                    {
                                                        batter
                                                            .strikeRate
                                                    }
                                                </strong>

                                                <span>
                                                    SR
                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>



                        {/* =========================
                            EXTRAS
                        ========================= */}
<div className="d-xs-flex w-xs-100 gap-2">
                        <div className="modern-extra-card w-xs-50">

                            <div>

                                <span>
                                    EXTRAS
                                </span>

                                <strong>
                                    {
                                        inning
                                            .extrasData
                                            ?.total ?? 0
                                    }
                                </strong>

                            </div>


                            <p>

                                b{" "}
                                {
                                    inning
                                        .extrasData
                                        ?.byes ?? 0
                                }

                                <span>•</span>

                                lb{" "}
                                {
                                    inning
                                        .extrasData
                                        ?.legByes ?? 0
                                }

                                <span>•</span>

                                w{" "}
                                {
                                    inning
                                        .extrasData
                                        ?.wides ?? 0
                                }

                                <span>•</span>

                                nb{" "}
                                {
                                    inning
                                        .extrasData
                                        ?.noBalls ?? 0
                                }

                                <span>•</span>

                                p{" "}
                                {
                                    inning
                                        .extrasData
                                        ?.penalty ?? 0
                                }

                            </p>

                        </div>



                        {/* =========================
                            TOTAL
                        ========================= */}

                        <div className="modern-total-card w-xs-50">

                            <div>

                                <span>
                                    INNINGS TOTAL
                                </span>

                                <strong>

                                    {
                                        inning
                                            .scoreDetails
                                            ?.runs
                                    }
                                    /
                                    {
                                        inning
                                            .scoreDetails
                                            ?.wickets
                                    }

                                </strong>

                            </div>


                            <div className="total-meta">
                               (
                                <span>Overs</span>

                                <strong>{inning.scoreDetails?.overs},</strong>


                                <span>Run Rate</span>

                                <strong>{inning.scoreDetails?.runRate}</strong>
                               )
                            </div>

                        </div>
</div>

{/* =========================
                            YET TO BAT
                        ========================= */}

                        <div className="yet-to-bat-card">

                            <div className="yet-icon">

                                <i className="bi bi-list-stars"></i>

                            </div>


                            <div>

                                <span>
                                    YET TO BAT
                                </span>

                                <p>

                                    {battingPlayers
                                        .filter(
                                            (player) =>
                                                !player.outDesc &&
                                                Number(
                                                    player.runs
                                                ) === 0 &&
                                                Number(
                                                    player.balls
                                                ) === 0
                                        )
                                        .map(
                                            (player) =>
                                                player.batName
                                        )
                                        .join(
                                            ", "
                                        ) ||
                                        "None"
                                    }

                                </p>

                            </div>

                        </div>
                        {/* =========================
                            BOWLING
                        ========================= */}

                        <div className="modern-section">


                            <div className="modern-section-heading">

                                <div>

                                    <span className="section-kicker">
                                        BOWLING
                                    </span>

                                    <h3>
                                        Bowling Performance
                                    </h3>

                                </div>


                                <div className="section-icon">

                                    <i className="bi bi-bullseye"></i>

                                </div>

                            </div>


                            <div className="modern-table-labels modern-table-labels-bowl">
                                <span className="label-name">BOWLER</span>
                                <span>O</span>
                                <span>M</span>
                                <span>R</span>
                                <span>W</span>
                                <span>ECO</span>
                            </div>


                            <div className="bowling-list">


                                {bowlers.map(
                                    (bowler) => (

                                        <div
                                            className="modern-bowler"
                                            key={
                                                bowler
                                                    .bowlerId
                                            }
                                        >

                                            <div className="bowler-name">

                                                <div className="bowler-avatar">

                                                    {
                                                        bowler
                                                            .bowlName
                                                            ?.charAt(0)
                                                            ?.toUpperCase()
                                                    }

                                                </div>


                                                <strong>

                                                    {
                                                        bowler
                                                            .bowlName
                                                    }

                                                </strong>

                                            </div>


                                            <div>
                                                <span>
                                                    O
                                                </span>

                                                <strong>
                                                    {
                                                        bowler
                                                            .overs
                                                    }
                                                </strong>
                                            </div>


                                            <div>
                                                <span>
                                                    M
                                                </span>

                                                <strong>
                                                    {
                                                        bowler
                                                            .maidens
                                                    }
                                                </strong>
                                            </div>


                                            <div>
                                                <span>
                                                    R
                                                </span>

                                                <strong>
                                                    {
                                                        bowler
                                                            .runs
                                                    }
                                                </strong>
                                            </div>


                                            <div className="wicket-stat">

                                                <span>
                                                    W
                                                </span>

                                                <strong>
                                                    {
                                                        bowler
                                                            .wickets
                                                    }
                                                </strong>

                                            </div>


                                            <div>
                                                <span>
                                                    ECO
                                                </span>

                                                <strong>
                                                    {
                                                        bowler
                                                            .economy
                                                    }
                                                </strong>
                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>



                        {/* =========================
                            FALL OF WICKETS
                        ========================= */}

                        {wickets.length > 0 && (

                            <div className="modern-section">


                                <div className="modern-section-heading">

                                    <div>

                                        <span className="section-kicker">
                                            WICKETS
                                        </span>

                                        <h3>
                                            Fall of Wickets
                                        </h3>

                                    </div>

                                    <div className="section-icon">

                                        <i className="bi bi-x-circle"></i>

                                    </div>

                                </div>



                                <div className="wicket-grid">

                                    {wickets.map(
                                        (wicket) => (

                                            <div
                                                className="wicket-card"
                                                key={
                                                    wicket
                                                        .wktNbr
                                                }
                                            >

                                                <div className="wicket-number">

                                                    {
                                                        wicket
                                                            .wktNbr
                                                    }

                                                </div>


                                                <div>

                                                    <strong>

                                                        {
                                                            wicket
                                                                .batName
                                                        }

                                                    </strong>

                                                    <span>

                                                        {
                                                            wicket
                                                                .wktOver
                                                        }{" "}
                                                        overs

                                                    </span>

                                                </div>


                                                <strong>

                                                    {
                                                        wicket
                                                            .wktRuns
                                                    }

                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}



                        {/* =========================
                            PARTNERSHIPS
                        ========================= */}

                        {partnerships.length > 0 && (

                            <div className="modern-section">


                                <div className="modern-section-heading">

                                    <div>

                                        <span className="section-kicker">
                                            PARTNERSHIPS
                                        </span>

                                        <h3>
                                            Batting Partnerships
                                        </h3>

                                    </div>

                                    <div className="section-icon">

                                        <i className="bi bi-people-fill"></i>

                                    </div>

                                </div>



                                <div className="partnership-list">


                                    {partnerships.map(
                                        (
                                            partnership,
                                            partnershipIndex
                                        ) => (

                                            <div
                                                className="partnership-card"
                                                key={
                                                    partnershipIndex
                                                }
                                            >

                                                <div>

                                                    <strong>

                                                        {
                                                            partnership
                                                                .bat1Name
                                                        }

                                                    </strong>

                                                    <span>

                                                        {
                                                            partnership
                                                                .bat1Runs
                                                        }{" "}
                                                        (
                                                        {
                                                            partnership
                                                                .bat1balls
                                                        }
                                                        )

                                                    </span>

                                                </div>


                                                <div className="partnership-center">

                                                    <strong>

                                                        {
                                                            partnership
                                                                .totalRuns
                                                        }

                                                    </strong>

                                                    <span>

                                                        {
                                                            partnership
                                                                .totalBalls
                                                        }{" "}
                                                        balls

                                                    </span>

                                                </div>


                                                <div className="partnership-right">

                                                    <strong>

                                                        {
                                                            partnership
                                                                .bat2Name
                                                        }

                                                    </strong>

                                                    <span>

                                                        {
                                                            partnership
                                                                .bat2Runs
                                                        }{" "}
                                                        (
                                                        {
                                                            partnership
                                                                .bat2balls
                                                        }
                                                        )

                                                    </span>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}



                        


                    </section>

                );

            })()}

        </div>

    );

}


export default Scorecard;