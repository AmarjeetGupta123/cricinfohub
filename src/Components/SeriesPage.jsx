import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Schedule from "./AllMatches/Schedule";
import PointTable from "./PointTable/PointTable";
import Stats from "./Stats/Stats";
import Squad from "./SeriesSquad/SeriesSquad";

import "../Styles/SeriesPage.css";


const TABS = [
    {
        key: "matches",
        label: "All Matches",
        icon: "bi-calendar3",
    },
    {
        key: "points",
        label: "Points Table",
        icon: "bi-trophy",
    },
    {
        key: "stats",
        label: "Stats",
        icon: "bi-bar-chart-line",
    },
    {
        key: "squad",
        label: "Squad",
        icon: "bi-people",
    },
];


function SeriesPage() {

    const { seriesId } = useParams();

    const [activePage, setActivePage] =
        useState("matches");


    const handleTabChange = (tab) => {
        setActivePage(tab);
    };


    return (
        <div className="series-main-page">

            {/* ==========================================
                SERIES HEADER
            ========================================== */}

            <motion.div
                className="series-page-header"

                initial={{
                    opacity: 0,
                    y: -18,
                }}

                animate={{
                    opacity: 1,
                    y: 0,
                }}

                transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >

                <div className="series-page-heading">

                    <span className="series-page-kicker">
                        CRICKET SERIES
                    </span>

                    <h1>
                        Series Overview
                    </h1>

                    <p>
                        Matches, points table, statistics
                        and squad information.
                    </p>

                </div>


                {/* Series ID intentionally subtle */}
                <div className="series-id-badge">
                    Series #{seriesId}
                </div>

            </motion.div>


            {/* ==========================================
                SERIES NAVIGATION
            ========================================== */}

            <motion.div
                className="series-tabs-wrapper"

                initial={{
                    opacity: 0,
                    y: 10,
                }}

                animate={{
                    opacity: 1,
                    y: 0,
                }}

                transition={{
                    duration: 0.4,
                    delay: 0.08,
                }}
            >

                <div className="series-tabs">

                    {TABS.map((tab) => {

                        const isActive =
                            activePage === tab.key;


                        return (
                            <motion.button
                                key={tab.key}

                                type="button"

                                className={`series-tab-btn ${
                                    isActive
                                        ? "active"
                                        : ""
                                }`}

                                onClick={() =>
                                    handleTabChange(
                                        tab.key
                                    )
                                }

                                whileHover={{
                                    y: -2,
                                }}

                                whileTap={{
                                    scale: 0.97,
                                }}
                            >

                                <i
                                    className={`bi ${tab.icon}`}
                                />

                                <span>
                                    {tab.label}
                                </span>


                                {isActive && (
                                    <motion.span
                                        className="series-tab-active-line"

                                        layoutId="seriesActiveTab"

                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 35,
                                        }}
                                    />
                                )}

                            </motion.button>
                        );

                    })}

                </div>

            </motion.div>


            {/* ==========================================
                CONTENT
            ========================================== */}

            <div className="series-content-area">

                <AnimatePresence
                    mode="wait"
                >

                    <motion.div
                        key={activePage}

                        className="series-tab-content"

                        initial={{
                            opacity: 0,
                            y: 14,
                        }}

                        animate={{
                            opacity: 1,
                            y: 0,
                        }}

                        exit={{
                            opacity: 0,
                            y: -10,
                        }}

                        transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >

                        {activePage === "matches" && (
                            <Schedule
                                seriesId={seriesId}
                            />
                        )}


                        {activePage === "points" && (
                            <PointTable
                                seriesId={seriesId}
                            />
                        )}


                        {activePage === "stats" && (
                            <Stats
                                seriesId={seriesId}
                            />
                        )}


                        {activePage === "squad" && (
                            <Squad
                                seriesId={seriesId}
                            />
                        )}

                    </motion.div>

                </AnimatePresence>

            </div>

        </div>
    );
}


export default SeriesPage;