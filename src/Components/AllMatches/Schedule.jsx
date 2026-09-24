import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import BackApi from "../../Services/Back";
import "./Schedule.css";


function Schedule() {

    const { seriesId } = useParams();
    const navigate = useNavigate();

    const [seriesinfo, setSriesinfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    // =====================================================
    // GET SERIES DETAILS
    // =====================================================

    const SeriesDetails = async () => {

        try {

            setLoading(true);
            setError(false);

            const response =
                await BackApi.get(
                    `/series/${seriesId}/details`
                );

            setSriesinfo(
                response?.data || null
            );

            console.log(
                "Series Details:",
                response?.data
            );

        } catch (err) {

            console.log(
                "Series Details Error:",
                err
            );

            setError(true);
            setSriesinfo(null);

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        if (!seriesId) return;

        SeriesDetails();

    }, [seriesId]);


    const allmatches =
        seriesinfo?.matches || [];


    // =====================================================
    // CONTAINER ANIMATION
    // =====================================================

    const containerVariants = {
        hidden: {
            opacity: 0,
        },

        visible: {
            opacity: 1,

            transition: {
                staggerChildren: 0.08,
            },
        },
    };


    // =====================================================
    // CARD ANIMATION
    // =====================================================

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 24,
            scale: 0.985,
        },

        visible: {
            opacity: 1,
            y: 0,
            scale: 1,

            transition: {
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };


    return (
        <div className="schedule-page">


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <motion.div
                    className="schedule-loading-wrapper"

                    initial={{
                        opacity: 0,
                    }}

                    animate={{
                        opacity: 1,
                    }}

                    transition={{
                        duration: 0.3,
                    }}
                >

                    {[1, 2, 3].map(
                        (item) => (

                            <div
                                className="schedule-card schedule-skeleton"
                                key={item}
                            >

                                <div className="skeleton-header"></div>

                                <div className="skeleton-date"></div>

                                <div className="skeleton-team"></div>

                                <div className="skeleton-vs"></div>

                                <div className="skeleton-team"></div>

                                <div className="skeleton-venue"></div>

                                <div className="skeleton-result"></div>

                            </div>

                        )
                    )}

                </motion.div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {!loading && error && (

                <motion.div
                    className="schedule-empty-state"

                    initial={{
                        opacity: 0,
                        y: 20,
                        scale: 0.97,
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}

                    transition={{
                        duration: 0.4,
                    }}
                >

                    <motion.div
                        className="schedule-empty-icon"

                        animate={{
                            y: [0, -5, 0],
                        }}

                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <i className="bi bi-exclamation-triangle"></i>
                    </motion.div>


                    <h5>
                        Something went wrong
                    </h5>


                    <p>
                        Unable to load the match schedule.
                    </p>


                    <motion.button
                        type="button"

                        className="schedule-retry-btn"

                        onClick={SeriesDetails}

                        whileHover={{
                            y: -2,
                        }}

                        whileTap={{
                            scale: 0.96,
                        }}
                    >

                        <i className="bi bi-arrow-clockwise"></i>

                        <span>
                            Try Again
                        </span>

                    </motion.button>

                </motion.div>

            )}


            {/* =================================================
                NO MATCHES
            ================================================= */}

            {!loading &&
                !error &&
                allmatches.length === 0 && (

                    <motion.div
                        className="schedule-empty-state"

                        initial={{
                            opacity: 0,
                            y: 20,
                        }}

                        animate={{
                            opacity: 1,
                            y: 0,
                        }}

                        transition={{
                            duration: 0.4,
                        }}
                    >

                        <motion.div
                            className="schedule-empty-icon"

                            animate={{
                                rotate: [0, -5, 5, 0],
                            }}

                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <i className="bi bi-calendar-x"></i>
                        </motion.div>


                        <h5>
                            No Matches Found
                        </h5>


                        <p>
                            There are no matches available
                            for this series.
                        </p>

                    </motion.div>
                )}


            {/* =================================================
                MATCH CARDS
            ================================================= */}

            {!loading &&
                !error &&
                allmatches.length > 0 && (

                    <motion.div
                        className="schedule-matches-list"

                        variants={containerVariants}

                        initial="hidden"

                        animate="visible"
                    >

                        {allmatches.map(
                            (item, index) => {

                                const isComplete =
                                    item?.state?.toLowerCase() ===
                                    "complete";


                                const matchState =
                                    item?.state ||
                                    "Upcoming";


                                return (

                                    <motion.div
                                        className="schedule-card"

                                        key={
                                            item?.matchId ||
                                            index
                                        }

                                        variants={cardVariants}

                                        whileHover={{
                                            y: -5,
                                            transition: {
                                                duration: 0.22,
                                            },
                                        }}

                                        whileTap={{
                                            scale: 0.995,
                                        }}

                                        onClick={() =>
                                            navigate(
                                                `/match/${item?.matchId}`
                                            )
                                        }
                                    >


                                        {/* =================================
                                            TOP LINE
                                        ================================= */}

                                        <div className="schedule-card-glow"></div>


                                        {/* =================================
                                            HEADER
                                        ================================= */}

                                        <div className="schedule-card-header">

                                            <div className="schedule-match-info">

                                                <span className="schedule-match-number">
                                                    {item?.matchDesc ||
                                                        "Match"}
                                                </span>

                                                <span className="schedule-match-label">
                                                    Match{" "}
                                                    {index + 1}
                                                </span>

                                            </div>


                                            {/* STATUS */}

                                            <motion.span
                                                className={`schedule-status ${
                                                    isComplete
                                                        ? "schedule-status-complete"
                                                        : "schedule-status-upcoming"
                                                }`}

                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}

                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}

                                                transition={{
                                                    delay:
                                                        index * 0.08 +
                                                        0.15,
                                                    duration: 0.25,
                                                }}
                                            >

                                                <span className="schedule-status-dot"></span>

                                                {matchState}

                                            </motion.span>

                                        </div>


                                        {/* =================================
                                            DATE / TIME
                                        ================================= */}

                                        {(item?.date ||
                                            item?.time) && (

                                            <div className="schedule-date-row">

                                                {item?.date && (

                                                    <div className="schedule-date-item">

                                                        <i className="bi bi-calendar3"></i>

                                                        <span>
                                                            {item.date}
                                                        </span>

                                                    </div>

                                                )}


                                                {item?.date &&
                                                    item?.time && (

                                                        <span className="schedule-date-separator">
                                                            •
                                                        </span>
                                                    )}


                                                {item?.time && (

                                                    <div className="schedule-date-item">

                                                        <i className="bi bi-clock"></i>

                                                        <span>
                                                            {item.time}
                                                        </span>

                                                    </div>

                                                )}

                                            </div>
                                        )}


                                        {/* =================================
                                            MATCH BODY
                                        ================================= */}

                                        <div className="schedule-card-body">


                                            {/* TEAM 1 */}

                                            <div className="schedule-team">

                                                <div className="schedule-team-left">

                                                    <motion.div
                                                        className="schedule-team-logo schedule-team-logo-one"

                                                        whileHover={{
                                                            scale: 1.08,
                                                            rotate: 3,
                                                        }}
                                                    >
                                                        {item?.team1?.charAt(0) ||
                                                            "T"}
                                                    </motion.div>


                                                    <div className="schedule-team-name">
                                                        {item?.team1 ||
                                                            "Team 1"}
                                                    </div>

                                                </div>


                                                <div className="schedule-score">
                                                    {item?.team1Score ||
                                                        "-"}
                                                </div>

                                            </div>


                                            {/* VS */}

                                            <div className="schedule-vs-row">

                                                <div className="schedule-line"></div>


                                                <motion.span
                                                    className="schedule-vs"

                                                    whileHover={{
                                                        scale: 1.08,
                                                    }}
                                                >
                                                    VS
                                                </motion.span>


                                                <div className="schedule-line"></div>

                                            </div>


                                            {/* TEAM 2 */}

                                            <div className="schedule-team">

                                                <div className="schedule-team-left">

                                                    <motion.div
                                                        className="schedule-team-logo schedule-team-logo-two"

                                                        whileHover={{
                                                            scale: 1.08,
                                                            rotate: -3,
                                                        }}
                                                    >
                                                        {item?.team2?.charAt(0) ||
                                                            "T"}
                                                    </motion.div>


                                                    <div className="schedule-team-name">
                                                        {item?.team2 ||
                                                            "Team 2"}
                                                    </div>

                                                </div>


                                                <div className="schedule-score">
                                                    {item?.team2Score ||
                                                        "-"}
                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================
                                            VENUE
                                        ================================= */}

                                        {(item?.venue ||
                                            item?.city) && (

                                            <div className="schedule-venue">

                                                <div className="schedule-venue-icon">
                                                    <i className="bi bi-geo-alt-fill"></i>
                                                </div>


                                                <div className="schedule-venue-text">

                                                    <span className="schedule-venue-label">
                                                        Venue
                                                    </span>


                                                    <span className="schedule-venue-name">

                                                        {item?.venue ||
                                                            "Venue"}

                                                        {item?.city &&
                                                            `, ${item.city}`}

                                                    </span>

                                                </div>

                                            </div>
                                        )}


                                        {/* =================================
                                            RESULT
                                        ================================= */}

                                        <div
                                            className={`schedule-result ${
                                                isComplete
                                                    ? "schedule-result-complete"
                                                    : "schedule-result-upcoming"
                                            }`}
                                        >

                                            <motion.div
                                                className="schedule-result-icon"

                                                animate={
                                                    !isComplete
                                                        ? {
                                                              rotate: [
                                                                  0,
                                                                  5,
                                                                  -5,
                                                                  0,
                                                              ],
                                                          }
                                                        : {}
                                                }

                                                transition={{
                                                    duration: 2.5,
                                                    repeat:
                                                        Infinity,
                                                    ease:
                                                        "easeInOut",
                                                }}
                                            >

                                                <i
                                                    className={
                                                        isComplete
                                                            ? "bi bi-trophy-fill"
                                                            : "bi bi-hourglass-split"
                                                    }
                                                ></i>

                                            </motion.div>


                                            <div className="schedule-result-content">

                                                <span className="schedule-result-label">

                                                    {isComplete
                                                        ? "Match Result"
                                                        : "Match Status"}

                                                </span>


                                                <span className="schedule-result-text">

                                                    {item?.status ||
                                                        item?.result ||
                                                        "Match scheduled"}

                                                </span>

                                            </div>

                                        </div>

                                    </motion.div>
                                );
                            }
                        )}

                    </motion.div>
                )}

        </div>
    );
}


export default Schedule;