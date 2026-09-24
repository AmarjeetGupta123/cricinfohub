import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Ranking.css";
import RankingApi from "../../Services/Ranking";

/* =========================================================
   FORMAT CONFIG
========================================================= */

const FORMAT_CONFIG = {
  test: {
    label: "Test",
  },

  odi: {
    label: "ODI",
  },

  t20: {
    label: "T20",
  },
};

/* =========================================================
   RANKING TYPES
========================================================= */

const RANKING_TYPES = [
  {
    key: "team",
    label: "Teams",
    icon: "bi-people-fill",
  },

  {
    key: "bat",
    label: "Batting",
    icon: "bi-person-fill",
  },

  {
    key: "bowl",
    label: "Bowling",
    icon: "bi-bullseye",
  },

  {
    key: "allrounder",
    label: "All-Rounders",
    icon: "bi-stars",
  },
];

/* =========================================================
   GET RANKING ROOT
========================================================= */

const getRankingRoot = (response, rankType) => {
  const source = response?.data ?? response ?? {};

  const possibleKeys = [
    `${rankType}-rank`,

    rankType === "team"
      ? "team-rank"
      : null,

    "ranking",

    "rank",
  ].filter(Boolean);

  for (const key of possibleKeys) {
    if (source?.[key]) {
      return source[key];
    }
  }

  const foundKey = Object.keys(source).find(
    (key) =>
      key.toLowerCase().includes("rank")
  );

  return foundKey
    ? source[foundKey]
    : null;
};

/* =========================================================
   FIND RANKING ARRAY
========================================================= */

const getRankingArray = (root) => {
  if (!root) {
    return [];
  }

  if (Array.isArray(root)) {
    return root;
  }

  const possibleArrays = [
    root?.rank,
    root?.ranking,
    root?.rankings,
    root?.items,
    root?.teams,
    root?.players,
  ];

  for (const value of possibleArrays) {
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
};

/* =========================================================
   NORMALIZE RANKING
========================================================= */

const normalizeRanking = (
  response,
  rankType
) => {
  const root = getRankingRoot(
    response,
    rankType
  );

  if (!root) {
    return {
      lastUpdated: null,
      rankDate: null,
      rankType,
      players: [],
    };
  }

  const rankings =
    getRankingArray(root);

  return {
    lastUpdated:
      root?.last_updated ||
      root?.lastUpdated ||
      null,

    rankDate:
      root?.rank_date ||
      root?.rankDate ||
      null,

    rankType:
      root?.["rank-type"] ||
      root?.rankType ||
      rankType,

    players: rankings.map(
      (item, index) => ({
        /* ---------------------------------------------
           RANK
        --------------------------------------------- */

        rank:
          item?.no ??
          item?.rank ??
          index + 1,

        /* ---------------------------------------------
           CHANGE
        --------------------------------------------- */

        change:
          item?.change ??
          item?.rank_change ??
          "",

        /* ---------------------------------------------
           NAME
        --------------------------------------------- */

        name:
          item?.["Player-name"] ||
          item?.player_name ||
          item?.playerName ||
          item?.team_name ||
          item?.teamName ||
          "Unknown",

        /* ---------------------------------------------
           PLAYER ID
        --------------------------------------------- */

        playerId:
          item?.["Player_id"] ||
          item?.player_id ||
          item?.["PlayerId"] ||
          item?.playerId ||
          null,

        /* ---------------------------------------------
           COUNTRY ID
        --------------------------------------------- */

        countryId:
          item?.["Country_id"] ||
          item?.country_id ||
          item?.countryId ||
          null,

        /* ---------------------------------------------
           COUNTRY NAME
        --------------------------------------------- */

        countryName:
          item?.["Country_name"] ||
          item?.country_name ||
          item?.countryName ||
          item?.Country ||
          "",

        /* ---------------------------------------------
           COUNTRY
        --------------------------------------------- */

        country:
          item?.Country ||
          item?.country ||
          "",

        /* ---------------------------------------------
           TEAM ID
        --------------------------------------------- */

        teamId:
          item?.["Team_id"] ||
          item?.team_id ||
          item?.["TeamId"] ||
          item?.teamId ||
          null,

        /* ---------------------------------------------
           TEAM NAME
        --------------------------------------------- */

        teamName:
          item?.team_name ||
          item?.teamName ||
          "",

        /* ---------------------------------------------
           TEAM URL
        --------------------------------------------- */

        teamUrl:
          item?.team_url ||
          item?.teamUrl ||
          null,

        /* ---------------------------------------------
           POINTS / RATING
        --------------------------------------------- */

        points:
          item?.Points ??
          item?.points ??
          item?.rating ??
          "0",

        /* ---------------------------------------------
           CAREER BEST
        --------------------------------------------- */

        careerBest:
          item?.careerbest ??
          item?.career_best ??
          "",

        /* ---------------------------------------------
           RANK DATE
        --------------------------------------------- */

        rankDate:
          item?.rankdate ||
          item?.rank_date ||
          null,

        /* ---------------------------------------------
           PLAYER PROFILE URL
        --------------------------------------------- */

        playerUrl:
          item?.Player_url ||
          item?.player_url ||
          item?.playerUrl ||
          null,

        /* ---------------------------------------------
           IMAGE

           Only top 5 will actually render this.
        --------------------------------------------- */

        imageUrl:
          item?.imageUrl ||
          item?.image_url ||
          item?.playerImage ||
          item?.player_image ||
          item?.image ||
          item?.ImageUrl ||
          null,
      })
    ),
  };
};

/* =========================================================
   CHANGE TYPE
========================================================= */

const getChangeType = (change) => {
  if (
    change === null ||
    change === undefined ||
    change === ""
  ) {
    return "neutral";
  }

  const value = String(change)
    .trim()
    .toLowerCase();

  if (
    value === "=" ||
    value === "-" ||
    value === "0" ||
    value === "same"
  ) {
    return "neutral";
  }

  if (value.includes("+")) {
    return "up";
  }

  if (value.includes("-")) {
    return "down";
  }

  const number = Number(value);

  if (!Number.isNaN(number)) {
    if (number > 0) {
      return "up";
    }

    if (number < 0) {
      return "down";
    }
  }

  return "neutral";
};

/* =========================================================
   CHANGE ICON
========================================================= */

const getChangeIcon = (change) => {
  const type =
    getChangeType(change);

  if (type === "up") {
    return "bi-arrow-up";
  }

  if (type === "down") {
    return "bi-arrow-down";
  }

  return "bi-dash";
};

/* =========================================================
   ICC IMAGE URL
========================================================= */

const getRankingImageUrl = (item, isTeamRanking) => {
  if (isTeamRanking) {
    const teamId = item?.teamId;

    if (!teamId) {
      return null;
    }

    return `https://assets-icc.sportz.io/static-assets/buildv3-stg/images/teams/${teamId}.png`;
  }

  const playerId = item?.playerId;

  if (!playerId) {
    return null;
  }

  return `https://images.icc-cricket.com/icc-web/image/upload/t_player-headshot-portrait-webp/prd/assets/players/generic/colored/${playerId}.png`;
};

/* =========================================================
   IMAGE FALLBACK
========================================================= */

const handleImageError = (event) => {
  event.currentTarget.style.display =
    "none";
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Ranking = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [gender, setGender] =
    useState("men");

  const [format, setFormat] =
    useState("test");

  const [rankingType, setRankingType] =
    useState("team");

  const [rankingData, setRankingData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     COMP TYPE

     Men:
       test
       odi
       t20

     Women:
       testw
       odiw
       t20w
  ======================================================= */

  const compType = useMemo(() => {
    if (gender === "women") {
      return `${format}w`;
    }

    return format;
  }, [gender, format]);

  /* =======================================================
     LOAD RANKING
  ======================================================= */

  const loadRanking = async () => {
    try {
      setLoading(true);
      setError("");

      /*
        Direct .NET API

        Example:

        https://cricinfohub-api.onrender.com/api/ranking/test/team
      */

      const response =
        await RankingApi.getRanking(
          compType,
          rankingType
        );

      console.log(
        "Ranking API Response:",
        response
      );

      const normalized =
        normalizeRanking(
          response,
          rankingType
        );

      console.log(
        "Normalized Ranking:",
        normalized
      );

      setRankingData(
        normalized
      );
    } catch (err) {
      console.error(
        "Ranking API Error:",
        err
      );

      const apiMessage =
        err?.response?.data?.message;

      setError(
        apiMessage ||
          err?.message ||
          "Unable to load rankings."
      );

      setRankingData(null);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD WHEN FILTER CHANGES
  ======================================================= */

  useEffect(() => {
    loadRanking();
  }, [
    compType,
    rankingType,
  ]);

  /* =======================================================
     DATA
  ======================================================= */

  const rankings =
    rankingData?.players || [];

  const topFive =
    rankings.slice(0, 5);

  const remaining =
    rankings.slice(5);

  const selectedFormat =
    FORMAT_CONFIG[
      format
    ]?.label || format;

  const selectedType =
    RANKING_TYPES.find(
      (item) =>
        item.key === rankingType
    )?.label || "Rankings";

  const isTeamRanking =
    rankingType === "team";

  /* =======================================================
     TITLE
  ======================================================= */

  const genderLabel =
    gender === "women"
      ? "Women"
      : "Men";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <motion.div
      className="ranking-page"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.45,
      }}
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="ranking-page-header">

        <div className="ranking-heading">

          <div className="ranking-eyebrow">
            <span className="ranking-live-dot"></span>

            ICC RANKINGS
          </div>

          <h1>
            Cricket Rankings
          </h1>

          <p>
            Official international cricket
            rankings across formats and
            categories.
          </p>

        </div>

        <div className="ranking-header-icon">
          <i className="bi bi-bar-chart-line-fill"></i>
        </div>

      </div>


      {/* ===================================================
          CONTROLS
      =================================================== */}

      <motion.div
        className="ranking-controls"
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.08,
        }}
      >

        {/* ===============================================
            GENDER
        =============================================== */}

        <div className="ranking-control-block">

          <span className="control-label">
            CATEGORY
          </span>

          <div className="ranking-segment">

            <button
              type="button"
              className={
                gender === "men"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setGender("men")
              }
            >
              <i className="bi bi-gender-male"></i>

              Men
            </button>

            <button
              type="button"
              className={
                gender === "women"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setGender("women")
              }
            >
              <i className="bi bi-gender-female"></i>

              Women
            </button>

          </div>

        </div>


        {/* ===============================================
            FORMAT
        =============================================== */}

        <div className="ranking-control-block">

          <span className="control-label">
            FORMAT
          </span>

          <div className="ranking-tabs">

            {Object.entries(
              FORMAT_CONFIG
            ).map(
              ([key, item]) => (
                <button
                  type="button"
                  key={key}
                  className={
                    format === key
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setFormat(key)
                  }
                >

                  {item.label}

                  {format === key && (
                    <motion.span
                      layoutId="format-active"
                      className="tab-active-line"
                    />
                  )}

                </button>
              )
            )}

          </div>

        </div>


        {/* ===============================================
            RANKING TYPE
        =============================================== */}

        <div className="ranking-control-block ranking-type-control">

          <span className="control-label">
            RANKING
          </span>

          <div className="ranking-type-tabs">

            {RANKING_TYPES.map(
              (item) => (
                <button
                  type="button"
                  key={item.key}
                  className={
                    rankingType ===
                    item.key
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setRankingType(
                      item.key
                    )
                  }
                >

                  <i
                    className={`bi ${item.icon}`}
                  ></i>

                  <span>
                    {item.label}
                  </span>

                </button>
              )
            )}

          </div>

        </div>

      </motion.div>


      {/* ===================================================
          CURRENT SELECTION
      =================================================== */}

      <div className="ranking-selection-bar">

        <div>

          <span className="selection-kicker">
            CURRENT RANKING
          </span>

          <strong>
            {genderLabel}
            {" · "}
            {selectedFormat}
            {" · "}
            {selectedType}
          </strong>

        </div>

        {!loading &&
          rankings.length > 0 && (
            <div className="ranking-total">

              <i className="bi bi-list-ol"></i>

              {rankings.length}
              {" Rankings"}

            </div>
          )}

      </div>


      {/* ===================================================
          LOADING
      =================================================== */}

      {loading && (
        <RankingSkeleton />
      )}


      {/* ===================================================
          ERROR
      =================================================== */}

      {!loading &&
        error && (

          <motion.div
            className="ranking-error"
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
          >

            <div className="error-icon">

              <i className="bi bi-exclamation-triangle"></i>

            </div>

            <h3>
              Rankings unavailable
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadRanking
              }
            >

              <i className="bi bi-arrow-clockwise"></i>

              Try Again

            </button>

          </motion.div>
        )}


      {/* ===================================================
          EMPTY
      =================================================== */}

      {!loading &&
        !error &&
        rankings.length === 0 && (

          <motion.div
            className="ranking-empty"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >

            <div className="empty-icon">

              <i className="bi bi-bar-chart"></i>

            </div>

            <h3>
              No rankings available
            </h3>

            <p>
              No ranking data was returned
              for this selection.
            </p>

          </motion.div>
        )}


      {/* ===================================================
          RANKING CONTENT
      =================================================== */}

      {!loading &&
        !error &&
        rankings.length > 0 && (

          <AnimatePresence
            mode="wait"
          >

            <motion.div
              key={`${gender}-${format}-${rankingType}`}
              className="ranking-content"

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
                y: -8,
              }}

              transition={{
                duration: 0.35,
              }}
            >

              {/* =========================================
                  TOP 5
              ========================================= */}

              <section className="top-ranking-section">

                <div className="section-title-row">

                  <div>

                    <span className="section-kicker">
                      TOP 5
                    </span>

                    <h2>
                      {isTeamRanking
                        ? "Leading Teams"
                        : "Top Ranked Players"}
                    </h2>

                  </div>

                  <div className="ranking-format-pill">
                    {selectedFormat}
                  </div>

                </div>


                <div className="top-ranking-grid">

                  {topFive.map(
                    (item, index) => {

                      const changeType =
                        getChangeType(
                          item.change
                        );

                      return (

                        <motion.div
                          key={`${item.playerId || item.teamId || item.name}-${index}`}

                          className={`top-rank-card rank-${index + 1}`}

                          initial={{
                            opacity: 0,
                            y: 25,
                          }}

                          animate={{
                            opacity: 1,
                            y: 0,
                          }}

                          transition={{
                            delay:
                              index * 0.07,

                            duration:
                              0.42,

                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          }}

                          whileHover={{
                            y: -5,
                          }}
                        >

                          {/* RANK */}

                          <div className="top-card-number">

                            <span>
                              #{item.rank}
                            </span>

                          </div>


                          {/* =================================
                              PLAYER IMAGE

                              Only top 5
                          ================================= */}

                          {(() => {
                            const imageUrl =
                              getRankingImageUrl(
                                item,
                                isTeamRanking
                              );

                            return (
                              imageUrl && (
                                <div
                                  className={
                                    isTeamRanking
                                      ? "top-ranking-image top-team-image"
                                      : "top-ranking-image top-player-image"
                                  }
                                >
                                  <img
                                    src={imageUrl}
                                    alt={item.name}
                                    loading={
                                      index === 0
                                        ? "eager"
                                        : "lazy"
                                    }
                                    onError={
                                      handleImageError
                                    }
                                  />
                                </div>
                              )
                            );
                          })()}


                          {/* BODY */}

                          <div className="top-card-body">

                            <div className="top-card-type">

                              {isTeamRanking
                                ? "TEAM"
                                : "PLAYER"}

                            </div>

                            <h3>
                              {item.name}
                            </h3>

                            <div className="top-country">

                              <span className="country-dot"></span>

                              {item.countryName ||
                                item.country ||
                                item.teamName ||
                                "International"}

                            </div>

                          </div>


                          {/* FOOTER */}

                          <div className="top-card-footer">

                            <div>

                              <span>
                                RATING
                              </span>

                              <strong>
                                {item.points}
                              </strong>

                            </div>


                            <div
                              className={`rank-change ${changeType}`}
                            >

                              <i
                                className={`bi ${getChangeIcon(
                                  item.change
                                )}`}
                              ></i>

                              {item.change ||
                                "="}

                            </div>

                          </div>


                          {/* #1 */}

                          {index === 0 && (

                            <div className="number-one-badge">

                              <i className="bi bi-trophy-fill"></i>

                              #1

                            </div>
                          )}

                        </motion.div>
                      );
                    }
                  )}

                </div>

              </section>


              {/* =========================================
                  COMPLETE RANKING
              ========================================= */}

              {remaining.length > 0 && (

                <section className="ranking-table-section">

                  <div className="section-title-row">

                    <div>

                      <span className="section-kicker">
                        COMPLETE RANKING
                      </span>

                      <h2>
                        {isTeamRanking
                          ? "Team Rankings"
                          : `${selectedType} Rankings`}
                      </h2>

                    </div>

                    <div className="table-info">

                      <i className="bi bi-info-circle"></i>

                      Top 5 highlighted above

                    </div>

                  </div>


                  <div className="ranking-table-card">

                    {/* TABLE HEADER */}

                    <div className="ranking-table-head">

                      <span>
                        RANK
                      </span>

                      <span>
                        CHANGE
                      </span>

                      <span>
                        {isTeamRanking
                          ? "TEAM"
                          : "PLAYER"}
                      </span>

                      <span>
                        COUNTRY
                      </span>

                      <span>
                        RATING
                      </span>

                      <span>
                        CAREER BEST RATING
                      </span>

                    </div>


                    {/* TABLE BODY */}

                    <div className="ranking-table-body">

                      {remaining.map(
                        (item, index) => {

                          const changeType =
                            getChangeType(
                              item.change
                            );

                          return (

                            <motion.div

                              className="ranking-table-row"

                              key={`row-${item.playerId || item.teamId || item.name}-${index}`}

                              initial={{
                                opacity: 0,
                                x: -12,
                              }}

                              animate={{
                                opacity: 1,
                                x: 0,
                              }}

                              transition={{
                                delay:
                                  index *
                                  0.025,

                                duration:
                                  0.28,
                              }}
                            >

                              {/* RANK */}

                              <div className="rank-cell">

                                <span>
                                  {item.rank}
                                </span>

                              </div>


                              {/* CHANGE */}

                              <div
                                className={`change-cell ${changeType}`}
                              >

                                <i
                                  className={`bi ${getChangeIcon(
                                    item.change
                                  )}`}
                                ></i>

                                {item.change ||
                                  "="}

                              </div>


                              {/* NAME */}

                              <div className="name-cell">

                                <div className="name-avatar">

                                  {isTeamRanking ? (

                                    <i className="bi bi-people-fill"></i>

                                  ) : (

                                    <i className="bi bi-person-fill"></i>

                                  )}

                                </div>


                                <div>

                                  <strong>
                                    {item.name}
                                  </strong>

                                </div>

                              </div>


                              {/* COUNTRY */}

                              <div className="country-cell">

                                <span className="country-mini-dot"></span>

                                {item.countryName ||
                                  item.country ||
                                  item.teamName ||
                                  "-"}

                              </div>


                              {/* RATING */}

                              <div className="rating-cell">

                                {item.points}

                              </div>


                              {/* CAREER BEST RATING */}

                              <div className="career-best-cell">

                                {item.careerBest || "—"}

                              </div>

                            </motion.div>
                          );
                        }
                      )}

                    </div>

                  </div>

                </section>
              )}


              {/* =========================================
                  FOOTER
              ========================================= */}

              <div className="ranking-footer-meta">

                <div>

                  <i className="bi bi-clock-history"></i>

                  <span>

                    Last Updated:{" "}

                    <strong>
                      {rankingData?.lastUpdated ||
                        "Available from ICC feed"}
                    </strong>

                  </span>

                </div>


                <div>

                  <i className="bi bi-calendar3"></i>

                  <span>

                    Ranking Date:{" "}

                    <strong>
                      {rankingData?.rankDate ||
                        "—"}
                    </strong>

                  </span>

                </div>


                <div className="ranking-source">

                  ICC Sportz Feed

                </div>

              </div>

            </motion.div>

          </AnimatePresence>
        )}

    </motion.div>
  );
};


/* =========================================================
   SKELETON
========================================================= */

const RankingSkeleton = () => {

  return (

    <div className="ranking-skeleton">

      <div className="skeleton-section-heading">

        <div className="skeleton-line small"></div>

        <div className="skeleton-line medium"></div>

      </div>


      <div className="skeleton-top-grid">

        {[1, 2, 3, 4, 5].map(
          (item) => (

            <div
              className="skeleton-card"
              key={item}
            >

              <div className="skeleton-circle"></div>

              <div className="skeleton-content">

                <div className="skeleton-line small"></div>

                <div className="skeleton-line large"></div>

                <div className="skeleton-line medium"></div>

              </div>

            </div>
          )
        )}

      </div>


      <div className="skeleton-table">

        {[1, 2, 3, 4, 5, 6].map(
          (item) => (

            <div
              className="skeleton-row"
              key={item}
            >

              <div className="skeleton-line tiny"></div>

              <div className="skeleton-line large"></div>

              <div className="skeleton-line medium"></div>

              <div className="skeleton-line small"></div>

            </div>
          )
        )}

      </div>

    </div>
  );
};


export default Ranking;