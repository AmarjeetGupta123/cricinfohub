import React, { useEffect, useMemo, useState } from "react";
import api from "../Services/Api";

function BallMap({ matchId }) {
    // =====================================================
    // STATE
    // =====================================================

    const [ballData, setBallData] = useState({
        balls: [],
        batters: [],
        bowlers: [],
        scoreDetails: null,
    });

    const [activeInnings, setActiveInnings] = useState(1);
    const [loading, setLoading] = useState(false);


    // =====================================================
    // GET BALL DATA
    // =====================================================

    const Balling = async (inningsId) => {
        try {
            setLoading(true);

            const response = await api.get(
                `/mcenter/balls-map/${matchId}/${inningsId}`
            );

            console.log(`Ball Map - Innings ${inningsId}:`, response.data);

            // Store complete API response
            setBallData({
                balls: response?.data?.balls || [],
                batters: response?.data?.batters || [],
                bowlers: response?.data?.bowlers || [],
                scoreDetails: response?.data?.scoreDetails || null,
            });

        } catch (err) {
            console.log("Ball Map Error:", err);

            setBallData({
                balls: [],
                batters: [],
                bowlers: [],
                scoreDetails: null,
            });

        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // INITIAL / INNINGS CHANGE
    // =====================================================

    useEffect(() => {
        if (!matchId) return;

        Balling(activeInnings);
    }, [matchId, activeInnings]);


    // =====================================================
    // GROUP BALLS BY OVER
    // =====================================================

    const groupedOvers = useMemo(() => {
        const groups = {};

        ballData.balls.forEach((ball) => {
            const overNum = Number(ball?.overNum);

            if (Number.isNaN(overNum)) {
                return;
            }

            /*
                0.1 - 0.6  => Over 1
                1.1 - 1.6  => Over 2
                10.1       => Over 11
            */
            const over = Math.floor(overNum) + 1;

            if (!groups[over]) {
                groups[over] = {
                    over,
                    balls: [],
                };
            }

            groups[over].balls.push(ball);
        });

        return Object.values(groups)
            .sort((a, b) => a.over - b.over)
            .map((overData) => ({
                ...overData,

                // API balls are newest first,
                // so display them in ball order.
                balls: [...overData.balls].sort(
                    (a, b) =>
                        Number(a.ballNbr) - Number(b.ballNbr)
                ),
            }));

    }, [ballData.balls]);


    // =====================================================
    // BALL BUTTON COLOR
    // =====================================================

    const getBallClass = (label) => {
        const value = String(label || "")
            .trim()
            .toUpperCase();


        // WICKET
        if (
            value === "W" ||
            value.startsWith("W/")
        ) {
            return "btn btn-danger";
        }


        // FOUR / SIX
        if (
            value === "4" ||
            value === "6"
        ) {
            return "btn btn-success";
        }


        // 1 / 2 / 3
        if (
            value === "1" ||
            value === "2" ||
            value === "3"
        ) {
            return "btn btn-primary";
        }


        // DOT BALL
        if (
            value === "•" ||
            value === "." ||
            value === "0"
        ) {
            return "btn btn-info";
        }


        // WIDE / NO BALL / BYE / LEG BYE
        if (
            value.startsWith("WD") ||
            value.startsWith("NB") ||
            value.startsWith("B") ||
            value.startsWith("LB") ||
            value.startsWith("L")
        ) {
            return "btn btn-warning";
        }


        // DEFAULT
        return "btn btn-secondary";
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="text-center py-5">
                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="container-fluid px-0">

            {/* =================================================
                INNINGS TABS
            ================================================= */}

            <div className="d-flex gap-2 mb-3">

                <button
                    type="button"
                    className={`btn rounded-pill px-4 ${
                        activeInnings === 1
                            ? "btn-success"
                            : "btn-outline-secondary"
                    }`}
                    onClick={() => setActiveInnings(1)}
                >
                    1st Innings
                </button>


                <button
                    type="button"
                    className={`btn rounded-pill px-4 ${
                        activeInnings === 2
                            ? "btn-success"
                            : "btn-outline-secondary"
                    }`}
                    onClick={() => setActiveInnings(2)}
                >
                    2nd Innings
                </button>

            </div>


            {/* =================================================
                NO DATA
            ================================================= */}

            {groupedOvers.length === 0 ? (

               <div className="d-flex justify-content-center align-items-center py-5">
    <div className="text-center">

        <div
            className="bg-secondary bg-opacity-10 border border-secondary border-opacity-25 rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
            style={{ width: "70px", height: "70px" }}
        >
            <i className="bi bi-hourglass-split fs-2 text-secondary"></i>
        </div>

        <h5 className="text-light fw-bold mb-2">
            Second Innings Not Started
        </h5>

        <p className="text-secondary mb-0">
            Waiting for the second innings to begin.
        </p>

    </div>
</div>

            ) : (

                <div className="row g-3">

                    {/* =================================================
                        LEFT - BALL BY BALL
                    ================================================= */}

                    <div className="col-lg-6">

                        <div className="card border-0 shadow-sm bg-transparent">

                            <div className="card-header border-0">
                                <h5 className="mb-0 fw-bold text-white">
                                    Over by Over
                                </h5>
                            </div>


                            <div className="card-body">

                                <div className="d-flex flex-column gap-2">

                                    {groupedOvers.map((overData) => (

                                        <div
                                            key={overData.over}
                                            className="d-flex flex-wrap align-items-center gap-2"
                                        >

                                            {/* OVER LABEL */}

                                            <span
                                                className="badge text-bg-warning rounded-2 px-3 py-2"
                                                style={{
                                                    minWidth: "75px",
                                                }}
                                            >
                                                Over : {overData.over}
                                            </span>


                                            {/* BALLS */}

                                            {overData.balls?.map((ball) => (

                                                <button
                                                    key={`${ball.ballNbr}-${ball.timestamp}`}
                                                    type="button"
                                                    className={`${getBallClass(
                                                        ball.ballLabel
                                                    )} rounded-2`}
                                                    style={{
                                                        minWidth: "40px",
                                                    }}
                                                    title={`Ball ${ball.overNum}`}
                                                >
                                                    {ball.ballLabel}
                                                </button>

                                            ))}

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT - SCORE DETAILS
                    ================================================= */}

                   {/* =================================================
    RIGHT - SCORE DETAILS
================================================= */}

<div className="col-lg-6">

    <div className="card  shadow-none bg-transparent">

        {/* HEADER */}
        <div className="card-header bg-transparent border-secondary border-opacity-25 px-0 pb-3">

            <div className="d-flex justify-content-between align-items-center">

                <h5 className="mb-0 fw-bold text-light">
                    Score Details
                </h5>

                <span className="badge rounded-pill text-bg-success px-3 py-2">
                    {activeInnings === 1 ? "1st Innings" : "2nd Innings"}
                </span>

            </div>

        </div>


        <div className="card-body px-0">


            {/* =================================================
                SCORE SUMMARY
            ================================================= */}

            {ballData.scoreDetails && (

                <div className="row g-2 mb-4">

                    {/* SCORE */}
                    <div className="col-4">

                        <div className="border  border-opacity-25 rounded-3 p-3 h-100">

                            <small className="text-secondary d-block mb-1">
                                Score
                            </small>

                            <div className="fw-bold text-light fs-4">
                                {ballData.scoreDetails.runs}
                                <span className="text-secondary">
                                    /
                                </span>
                                {ballData.scoreDetails.wickets}
                            </div>

                        </div>

                    </div>


                    {/* OVERS */}
                    <div className="col-4">

                        <div className="border border-secondary border-opacity-25 rounded-3 p-3 h-100">

                            <small className="text-secondary d-block mb-1">
                                Overs
                            </small>

                            <div className="fw-bold text-light fs-4">
                                {ballData.scoreDetails.overs}
                            </div>

                        </div>

                    </div>


                    {/* RUN RATE */}
                    <div className="col-4">

                        <div className="border border-secondary border-opacity-25 rounded-3 p-3 h-100">

                            <small className="text-secondary d-block mb-1">
                                Run Rate
                            </small>

                            <div className="fw-bold text-success fs-4">
                                {ballData.scoreDetails.runRate}
                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                BATTERS
            ================================================= */}

            <div className="mb-4">

                <div className="d-flex justify-content-between align-items-center mb-2">

                    <h6 className="text-light fw-bold mb-0">
                        Batsmen
                    </h6>

                    <span className="badge text-bg-secondary">
                        R / B
                    </span>

                </div>


                <div className="table-responsive">

                    <table className="table table-dark table-hover align-middle mb-0 rounded-3 overflow-hidden">

                        <thead>

                            <tr className="text-secondary">

                                <th className="fw-semibold">
                                    Batsman
                                </th>

                                <th className="text-center">
                                    R
                                </th>

                                <th className="text-center">
                                    B
                                </th>

                                <th className="text-center">
                                    4s
                                </th>

                                <th className="text-center">
                                    6s
                                </th>

                                <th className="text-center">
                                    SR
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {ballData.batters?.map((item) => (

                                <tr key={item.batId}>

                                    <td className="fw-semibold text-light">

                                        {item.batName}

                                    </td>


                                    {/* RUNS */}

                                    <td className="text-center">

                                        <span className="badge text-bg-success px-2 py-1">
                                            {item.runs}
                                        </span>

                                    </td>


                                    {/* BALLS */}

                                    <td className="text-center text-light">
                                        {item.balls}
                                    </td>


                                    {/* FOURS */}

                                    <td className="text-center">

                                        <span className="badge text-bg-warning px-2 py-1">
                                            {item.fours}
                                        </span>

                                    </td>


                                    {/* SIXES */}

                                    <td className="text-center">

                                        <span className="badge text-bg-info px-2 py-1">
                                            {item.sixes}
                                        </span>

                                    </td>


                                    {/* STRIKE RATE */}

                                    <td className="text-center text-light">
                                        {item.strikeRate}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                BOWLERS
            ================================================= */}

            {ballData.bowlers?.length > 0 && (

                <div>

                    <div className="d-flex justify-content-between align-items-center mb-2">

                        <h6 className="text-light fw-bold mb-0">
                            Bowlers
                        </h6>

                        <span className="badge text-bg-secondary">
                            O / R / W
                        </span>

                    </div>


                    <div className="table-responsive">

                        <table className="table table-dark table-hover align-middle mb-0">

                            <thead>

                                <tr className="text-secondary">

                                    <th>
                                        Bowler
                                    </th>

                                    <th className="text-center">
                                        O
                                    </th>

                                    <th className="text-center">
                                        M
                                    </th>

                                    <th className="text-center">
                                        R
                                    </th>

                                    <th className="text-center">
                                        W
                                    </th>

                                    <th className="text-center">
                                        Econ
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {ballData.bowlers.map((item) => (

                                    <tr key={item.bowlerId}>

                                        <td className="fw-semibold text-light">
                                            {item.bowlName}
                                        </td>


                                        <td className="text-center text-light">
                                            {item.overs}
                                        </td>


                                        <td className="text-center text-light">
                                            {item.maidens}
                                        </td>


                                        <td className="text-center text-light">
                                            {item.runs}
                                        </td>


                                        <td className="text-center">

                                            <span className="badge text-bg-danger px-2 py-1">
                                                {item.wickets}
                                            </span>

                                        </td>


                                        <td className="text-center text-light">
                                            {item.economy}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>

    </div>

</div>

                </div>

            )}

        </div>
    );
}

export default BallMap;