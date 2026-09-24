import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../Services/Api";
import "../Styles/Overs.css";

function Overs({ matchId }) {
    const [innings1, setInnings1] = useState([]);
    const [innings2, setInnings2] = useState([]);

    const [activeInnings, setActiveInnings] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [nextUrl1, setNextUrl1] = useState(null);
    const [nextUrl2, setNextUrl2] = useState(null);

    const [loadingMore1, setLoadingMore1] = useState(false);
    const [loadingMore2, setLoadingMore2] = useState(false);

    // Tracks the in-flight matchId so a slow, stale response can't
    // overwrite newer data if the user switches matches quickly.
    const requestIdRef = useRef(0);


    // =========================================================
    // INITIAL LOAD (parallel + race-safe)
    // =========================================================

    useEffect(() => {
        if (!matchId) return;

        const thisRequestId = ++requestIdRef.current;
        const controller = new AbortController();

        setLoading(true);
        setError("");

        const fetchInnings = async (inningsId) => {
            const response = await api.get(
                `/mcenter/over-by-over/${matchId}/${inningsId}`,
                { signal: controller.signal }
            );

            const data = response?.data || {};
            return {
                overs: data?.paginatedData || [],
                nextUrl: data?.nextPaginationURL || null,
            };
        };

        Promise.all([fetchInnings(1), fetchInnings(2)])
            .then(([first, second]) => {
                if (thisRequestId !== requestIdRef.current) return;

                setInnings1(first.overs);
                setNextUrl1(first.nextUrl);

                setInnings2(second.overs);
                setNextUrl2(second.nextUrl);

                setLoading(false);
            })
            .catch((err) => {
                if (err?.name === "CanceledError" || err?.name === "AbortError") return;
                if (thisRequestId !== requestIdRef.current) return;

                setError("Over-by-over data load nahi ho paya.");
                setLoading(false);
            });

        return () => controller.abort();
    }, [matchId]);


    // =========================================================
    // SORT
    // =========================================================

    const sortedInnings1 = useMemo(
        () => [...innings1].sort((a, b) => Number(b.overs) - Number(a.overs)),
        [innings1]
    );

    const sortedInnings2 = useMemo(
        () => [...innings2].sort((a, b) => Number(b.overs) - Number(a.overs)),
        [innings2]
    );


    // =========================================================
    // LOAD MORE
    //
    // Bug fix: `nextPaginationURL` from the API can come back as either
    // a full absolute URL (https://...) or a path relative to the api
    // instance's baseURL. Passing an absolute URL straight into `api.get`
    // used to get the instance's baseURL prepended to it again, producing
    // an invalid, unreachable URL — so "View previous overs" would spin
    // and then silently fail. We now detect which kind it is and call it
    // correctly either way.
    // =========================================================

    const loadMoreOvers = useCallback(async (inningsId) => {
        const nextUrl = inningsId === 1 ? nextUrl1 : nextUrl2;
        const alreadyLoading = inningsId === 1 ? loadingMore1 : loadingMore2;

        if (!nextUrl || alreadyLoading) return;

        const setLoadingMore = inningsId === 1 ? setLoadingMore1 : setLoadingMore2;
        const setInnings = inningsId === 1 ? setInnings1 : setInnings2;
        const setNextUrl = inningsId === 1 ? setNextUrl1 : setNextUrl2;

        const isAbsolute = /^https?:\/\//i.test(nextUrl);
        const requestUrl = isAbsolute
            ? nextUrl
            : nextUrl.startsWith("/") ? nextUrl : `/${nextUrl}`;
        // Empty baseURL forces axios to use requestUrl as-is when it's
        // already a full URL, instead of prefixing the instance baseURL.
        const requestConfig = isAbsolute ? { baseURL: "" } : {};

        try {
            setLoadingMore(true);
            setError("");

            const response = await api.get(requestUrl, requestConfig);
            const data = response?.data || {};
            const newOvers = data?.paginatedData || [];

            setInnings((prev) => mergeOvers(prev, newOvers));
            setNextUrl(data?.nextPaginationURL || null);
        } catch (err) {
            console.error("Load more overs failed:", err);
            setError("Purane overs load nahi ho paye, dobara try karein.");
        } finally {
            setLoadingMore(false);
        }
    }, [nextUrl1, nextUrl2, loadingMore1, loadingMore2]);

    const loadMoreInnings1 = useCallback(() => loadMoreOvers(1), [loadMoreOvers]);
    const loadMoreInnings2 = useCallback(() => loadMoreOvers(2), [loadMoreOvers]);


    // =========================================================
    // TEAM NAMES
    // =========================================================

    const team1 = sortedInnings1?.[0]?.batTeamName || "Team 1";
    const team2 = sortedInnings2?.[0]?.batTeamName || "Team 2";


    // =========================================================
    // LOADING (skeleton instead of a blank spinner)
    // =========================================================

    if (loading) {
        return (
            <div className="overs-page">
                <div className="d-none d-lg-block">
                    <div className="row g-3">
                        <div className="col-lg-6"><OversSkeleton /></div>
                        <div className="col-lg-6"><OversSkeleton /></div>
                    </div>
                </div>
                <div className="d-lg-none">
                    <OversSkeleton />
                </div>
            </div>
        );
    }


    // =========================================================
    // EMPTY
    // =========================================================

    if (!sortedInnings1.length && !sortedInnings2.length) {
        return (
            <div className="overs-page">
                <div className="overs-empty">
                    {error || "No over-by-over data available."}
                </div>
            </div>
        );
    }


    return (
        <div className="overs-page">

            {error && (
                <div className="alert alert-danger py-2 mb-3" role="alert">
                    {error}
                </div>
            )}

            {/* MOBILE / TABLET TABS */}
            <div className="d-lg-none mb-3">
                <div className="innings-mobile-tabs">
                    <button
                        type="button"
                        onClick={() => setActiveInnings(1)}
                        className={`innings-mobile-tab ${activeInnings === 1 ? "active" : ""}`}
                    >
                        <span className="tab-team">{team1}</span>
                        <span className="tab-innings">1st Inn</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveInnings(2)}
                        className={`innings-mobile-tab ${activeInnings === 2 ? "active" : ""}`}
                    >
                        <span className="tab-team">{team2}</span>
                        <span className="tab-innings">2nd Inn</span>
                    </button>
                </div>
            </div>

            {/* DESKTOP: both columns */}
            <div className="d-none d-lg-block">
                <div className="row g-3">
                    <div className="col-lg-6">
                        <InningsPanel
                            team={team1}
                            inningsNumber={1}
                            overs={sortedInnings1}
                            nextUrl={nextUrl1}
                            loadingMore={loadingMore1}
                            onLoadMore={loadMoreInnings1}
                        />
                    </div>

                    <div className="col-lg-6">
                        <InningsPanel
                            team={team2}
                            inningsNumber={2}
                            overs={sortedInnings2}
                            nextUrl={nextUrl2}
                            loadingMore={loadingMore2}
                            onLoadMore={loadMoreInnings2}
                        />
                    </div>
                </div>
            </div>

            {/* MOBILE: selected innings only */}
            <div className="d-lg-none">
                {activeInnings === 1 ? (
                    <InningsPanel
                        team={team1}
                        inningsNumber={1}
                        overs={sortedInnings1}
                        nextUrl={nextUrl1}
                        loadingMore={loadingMore1}
                        onLoadMore={loadMoreInnings1}
                    />
                ) : (
                    <InningsPanel
                        team={team2}
                        inningsNumber={2}
                        overs={sortedInnings2}
                        nextUrl={nextUrl2}
                        loadingMore={loadingMore2}
                        onLoadMore={loadMoreInnings2}
                    />
                )}
            </div>

        </div>
    );
}


// =============================================================
// SKELETON (renders instantly, no network wait)
// =============================================================

function OversSkeleton() {
    return (
        <div className="over-skeleton">
            <div className="skeleton-block skel-header" />
            <div className="skeleton-block skel-row" />
            <div className="skeleton-block skel-row" />
            <div className="skeleton-block skel-row" />
        </div>
    );
}


// =============================================================
// INNINGS PANEL — memoized: only re-renders when its own props change
// =============================================================

const InningsPanel = memo(function InningsPanel({
    team,
    inningsNumber,
    overs,
    nextUrl,
    loadingMore,
    onLoadMore,
}) {
    const latest = overs?.[0];

    const runRate = useMemo(() => {
        if (!latest?.overs || !latest?.score) return "0.00";
        return (Number(latest.score) / Number(latest.overs)).toFixed(2);
    }, [latest]);

    return (
        <div className="innings-panel">

            <div className="innings-top">
                <div className="d-flex align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <div className="team-avatar">{getTeamInitials(team)}</div>

                        <div className="min-width-0">
                            <div className="d-flex align-items-center gap-2">
                                <h5 className="team-title mb-0">{team}</h5>
                                <span className="innings-small-badge">
                                    {inningsNumber === 1 ? "1st Inn" : "2nd Inn"}
                                </span>
                            </div>
                            <div className="innings-caption">Over by over</div>
                        </div>
                    </div>

                    {latest && (
                        <div className="main-score">
                            <strong>{latest.score}</strong>
                            <span>/{latest.wickets}</span>
                        </div>
                    )}
                </div>

                {latest && (
                    <div className="d-flex align-items-center innings-stats">
                        <div className="stat-block">
                            <span>OVERS</span>
                            <strong>{latest.overs}</strong>
                        </div>

                        <div className="stats-line" />

                        <div className="stat-block">
                            <span>RUN RATE</span>
                            <strong>{runRate}</strong>
                        </div>

                        <div className="stats-line" />

                        <div className="stat-block">
                            <span>WICKETS</span>
                            <strong>{latest.wickets}</strong>
                        </div>
                    </div>
                )}
            </div>

            <div className="over-column-header">
                <div>OVER</div>
                <div>DELIVERY</div>
                <div className="text-end">RUNS</div>
            </div>

            <div className="innings-over-list">
                {overs.map((item, index) => (
                    <OverItem
                        key={`${item.inningsId}-${item.overs}-${index}`}
                        item={item}
                        latest={index === 0}
                    />
                ))}
            </div>

            {nextUrl && (
                <div className="text-center p-3">
                    <button
                        type="button"
                        className="btn load-overs-btn"
                        onClick={onLoadMore}
                        disabled={loadingMore}
                    >
                        {loadingMore && (
                            <span className="spinner-border spinner-border-sm me-2" />
                        )}
                        {loadingMore ? "Loading..." : "View previous overs"}
                    </button>
                </div>
            )}

        </div>
    );
});


// =============================================================
// OVER ITEM — memoized, parses its own ball summary once per item
// =============================================================

const OverItem = memo(function OverItem({ item, latest }) {
    const balls = useMemo(() => parseOverSummary(item?.ovrSummary), [item?.ovrSummary]);

    const score = Number(item?.score || 0);
    const wickets = Number(item?.wickets || 0);
    const overRuns = Number(item?.runs || 0);

    const wicketsInOver = useMemo(
        () => balls.filter((ball) => ball.type === "wicket").length,
        [balls]
    );

    const scoreBefore = Math.max(0, score - overRuns);
    const wicketsBefore = Math.max(0, wickets - wicketsInOver);

    const bowler = item?.bowlNames?.length ? item.bowlNames.join(" & ") : "Unknown bowler";

    const uniqueBatsmen = useMemo(() => {
        const batsmen = [...(item?.batStrikerNames || []), ...(item?.batNonStrikerNames || [])];
        return [...new Set(batsmen.filter(Boolean))];
    }, [item?.batStrikerNames, item?.batNonStrikerNames]);

    return (
        <div className={`over-item ${latest ? "latest-over" : ""}`}>

            <div className="over-left">
                <div className="over-number">{item?.overs}</div>
                <div className="before-score">{scoreBefore}-{wicketsBefore}</div>
            </div>

            <div className="over-center">
                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                    {latest && <span className="live-over-dot" />}
                    <span className="bowler-name">{bowler}</span>
                    {latest && <span className="latest-text">LATEST</span>}
                </div>

                {uniqueBatsmen.length > 0 && (
                    <div className="batsmen-text">to {uniqueBatsmen.join(" & ")}</div>
                )}

                <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                    {balls.map((ball, index) => (
                        <Ball key={`${ball.value}-${index}`} ball={ball} />
                    ))}
                </div>
            </div>

            <div className="over-right">
                <strong>{overRuns}</strong>
                <span>runs</span>
            </div>

        </div>
    );
});


// =============================================================
// BALL — memoized, trivial but rendered in bulk
// =============================================================

const Ball = memo(function Ball({ ball }) {
    return <span className={`delivery-ball ball-${ball.type}`}>{ball.value}</span>;
});


// =============================================================
// PARSE SUMMARY
// =============================================================

function parseOverSummary(summary) {
    if (!summary) return [];

    return String(summary)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((value) => {
            const v = value.toUpperCase();

            if (v === "W" || v.startsWith("W/")) return { value, type: "wicket" };
            if (v.startsWith("WD")) return { value, type: "wide" };
            if (v.startsWith("NB")) return { value, type: "noball" };
            if (v.startsWith("LB") || /^L\d/.test(v)) return { value, type: "legbye" };
            if (v.startsWith("B")) return { value, type: "bye" };
            if (v === "0" || v === ".") return { value: "•", type: "dot" };
            if (v === "4") return { value: "4", type: "four" };
            if (v === "6") return { value: "6", type: "six" };
            if (v === "1" || v === "2" || v === "3") return { value, type: "run" };

            return { value, type: "extra" };
        });
}


// =============================================================
// MERGE PAGINATION DATA
// =============================================================

function mergeOvers(oldData, newData) {
    const map = new Map();
    [...oldData, ...newData].forEach((item) => {
        map.set(`${item.inningsId}-${item.overs}`, item);
    });
    return [...map.values()];
}


// =============================================================
// TEAM INITIALS
// =============================================================

function getTeamInitials(team = "") {
    const words = team.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
    return words.slice(0, 3).map((word) => word[0]).join("").toUpperCase();
}


export default Overs;