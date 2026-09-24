import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { motion, AnimatePresence } from "framer-motion";

import "./UpcomingMatches.css";
import api from "../../Services/Api";


// ==================================================
// CATEGORY CONFIG
// ==================================================

const CATEGORY_CONFIG = {
  international: {
    label: "International",
    apiType: "international",
    initialCursor: "1789916400000",
  },

  domestic: {
    label: "Domestic",
    apiType: "domestic",
    initialCursor: "1789961400000",
  },

  league: {
    label: "T20 Leagues",
    apiType: "league",
    initialCursor: "1789945200000",
  },

  women: {
    label: "Women",
    apiType: "women",
    initialCursor: "1789893000000",
  },
};


// ==================================================
// CATEGORY BUTTONS
// ==================================================

const BUTTONS = [
  {
    key: "international",
    label: "International",
    icon: "🌍",
  },

  {
    key: "domestic",
    label: "Domestic",
    icon: "🏏",
  },

  {
    key: "league",
    label: "T20 Leagues",
    icon: "🔥",
  },

  {
    key: "women",
    label: "Women",
    icon: "👩",
  },

  {
    key: "all",
    label: "All Matches",
    icon: "⚡",
  },
];


// ==================================================
// NORMALIZE MATCH
// ==================================================

const normalizeMatch = (match, series) => {
  return {
    ...match,

    // Series information
    seriesId:
      match.seriesId ??
      series.seriesId ??
      null,

    seriesName:
      series.seriesName ??
      "Unknown Series",

    seriesCategory:
      series.seriesCategory ??
      null,

    // Match information
    matchId:
      match.matchId ??
      null,

    // Useful sorting value
    startDate:
      Number(match.startDate || 0),
  };
};


// ==================================================
// PARSE API RESPONSE
// ==================================================

const parseResponse = (data) => {
  const result = [];

  if (!Array.isArray(data)) {
    return {
      matches: [],
      nextCursor: null,
    };
  }

  data.forEach((wrapper) => {
    const schedule =
      wrapper?.scheduleAdWrapper;

    if (!schedule) return;

    const seriesList =
      schedule.matchScheduleList || [];

    seriesList.forEach((series) => {
      const matches =
        series.matchInfo || [];

      matches.forEach((match) => {
        result.push(
          normalizeMatch(
            match,
            series
          )
        );
      });
    });
  });

  // Last schedule wrapper's longDate
  // becomes next cursor
  const lastWrapper =
    data[data.length - 1]
      ?.scheduleAdWrapper;

  const nextCursor =
    lastWrapper?.longDate
      ? String(lastWrapper.longDate)
      : null;

  return {
    matches: result,
    nextCursor,
  };
};


// ==================================================
// DATE FORMAT
// ==================================================

const formatDate = (timestamp) => {
  if (!timestamp) return "";

  const date =
    new Date(Number(timestamp));

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// ==================================================
// TIME FORMAT
// ==================================================

const formatTime = (timestamp) => {
  if (!timestamp) return "";

  const date =
    new Date(Number(timestamp));

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


// ==================================================
// TEAM NAME
// ==================================================

const getTeamName = (team) => {
  return (
    team?.teamName ||
    team?.teamSName ||
    "TBC"
  );
};


// ==================================================
// TEAM SHORT NAME
// ==================================================

const getTeamShort = (team) => {
  return (
    team?.teamSName ||
    team?.teamName ||
    "TBC"
  );
};


// ==================================================
// UPCOMING MATCHES
// ==================================================

export default function UpcomingMatches() {
  const [
    activeCategory,
    setActiveCategory,
  ] = useState("international");


  const [data, setData] = useState({
    international: {
      matches: [],
      cursor:
        CATEGORY_CONFIG
          .international
          .initialCursor,
      loading: false,
      hasMore: true,
      initialized: false,
    },

    domestic: {
      matches: [],
      cursor:
        CATEGORY_CONFIG
          .domestic
          .initialCursor,
      loading: false,
      hasMore: true,
      initialized: false,
    },

    league: {
      matches: [],
      cursor:
        CATEGORY_CONFIG
          .league
          .initialCursor,
      loading: false,
      hasMore: true,
      initialized: false,
    },

    women: {
      matches: [],
      cursor:
        CATEGORY_CONFIG
          .women
          .initialCursor,
      loading: false,
      hasMore: true,
      initialized: false,
    },
  });


  const observerRef =
    useRef(null);


  // Prevent duplicate requests
  const fetchingRef =
    useRef({
      international: false,
      domestic: false,
      league: false,
      women: false,
    });


  // ==================================================
  // FETCH CATEGORY
  // ==================================================

  const fetchCategory = useCallback(
    async (
      category,
      reset = false
    ) => {
      const config =
        CATEGORY_CONFIG[category];

      if (!config) return;

      if (
        fetchingRef.current[category]
      ) {
        return;
      }

      const current =
        data[category];

      if (!current) return;

      if (
        !reset &&
        !current.hasMore
      ) {
        return;
      }

      fetchingRef.current[category] =
        true;

      setData((prev) => ({
        ...prev,

        [category]: {
          ...prev[category],
          loading: true,
        },
      }));


      try {
        const cursor = reset
          ? config.initialCursor
          : current.cursor;


        /*
         * Services/Api.js:
         *
         * baseURL: "/api"
         *
         * Final URL:
         *
         * /api/cricket-schedule/
         * upcoming-series/{type}/{cursor}
         */

        const url =
          `/cricket-schedule/upcoming-series/` +
          `${config.apiType}/${cursor}`;


        console.log(
          `[UpcomingMatches] Fetching ${category}:`,
          url
        );


        const response =
          await api.get(url);


        const json =
          response.data;


        console.log(
          `[UpcomingMatches] ${category} response:`,
          json
        );


        const parsed =
          parseResponse(json);


        setData((prev) => {
          const previousCategory =
            prev[category];


          const oldMatches = reset
            ? []
            : previousCategory.matches;


          // Existing IDs
          const existingIds =
            new Set(
              oldMatches
                .filter(
                  (item) =>
                    item?.matchId
                )
                .map(
                  (item) =>
                    String(
                      item.matchId
                    )
                )
            );


          // New matches
          const newMatches = [];


          parsed.matches.forEach(
            (item) => {
              if (!item?.matchId) {
                newMatches.push(item);
                return;
              }


              const id =
                String(item.matchId);


              if (
                existingIds.has(id)
              ) {
                return;
              }


              existingIds.add(id);

              newMatches.push(item);
            }
          );


          const combined = [
            ...oldMatches,
            ...newMatches,
          ];


          // Sort by date
          combined.sort(
            (a, b) =>
              Number(
                a.startDate || 0
              ) -
              Number(
                b.startDate || 0
              )
          );


          const oldCursor =
            previousCategory.cursor;


          const nextCursor =
            parsed.nextCursor &&
            parsed.nextCursor !==
              oldCursor
              ? parsed.nextCursor
              : null;


          const hasMore =
            newMatches.length > 0 &&
            Boolean(nextCursor);


          return {
            ...prev,

            [category]: {
              ...previousCategory,

              matches: combined,

              cursor:
                nextCursor ||
                oldCursor,

              hasMore,

              loading: false,

              initialized: true,
            },
          };
        });
      } catch (error) {
        console.error(
          `[UpcomingMatches] Failed to load ${category}:`,
          error
        );


        setData((prev) => ({
          ...prev,

          [category]: {
            ...prev[category],

            loading: false,

            initialized: true,
          },
        }));
      } finally {
        fetchingRef.current[category] =
          false;
      }
    },
    [data]
  );


  // ==================================================
  // INITIAL CATEGORY LOAD
  // ==================================================

  useEffect(() => {
    if (activeCategory === "all") {
      return;
    }


    const categoryData =
      data[activeCategory];


    if (
      categoryData &&
      !categoryData.initialized &&
      !fetchingRef.current[
        activeCategory
      ]
    ) {
      fetchCategory(
        activeCategory
      );
    }
  }, [
    activeCategory,
    data,
    fetchCategory,
  ]);


  // ==================================================
  // CATEGORY CHANGE
  // ==================================================

  const handleCategoryChange = (
    category
  ) => {
    setActiveCategory(category);


    /*
     * Main app ka scroll container
     * ab .cd-main hai.
     *
     * Isliye current scroll ko
     * manually reset kar rahe hain.
     */

    const main =
      document.querySelector(
        ".cd-main"
      );


    if (main) {
      main.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }


    if (category === "all") {
      Object.keys(
        CATEGORY_CONFIG
      ).forEach((item) => {
        const categoryData =
          data[item];


        if (
          !categoryData.initialized &&
          !fetchingRef.current[item]
        ) {
          fetchCategory(item);
        }
      });


      return;
    }


    const categoryData =
      data[category];


    if (
      categoryData &&
      !categoryData.initialized &&
      !fetchingRef.current[category]
    ) {
      fetchCategory(category);
    }
  };


  // ==================================================
  // ALL MATCHES
  // ==================================================

  const allMatches = [
    ...data.international.matches,
    ...data.domestic.matches,
    ...data.league.matches,
    ...data.women.matches,
  ];


  // Remove duplicate match IDs
  const uniqueAllMatches =
    Array.from(
      new Map(
        allMatches
          .filter(
            (match) =>
              match?.matchId
          )
          .map((match) => [
            String(
              match.matchId
            ),
            match,
          ])
      ).values()
    );


  uniqueAllMatches.sort(
    (a, b) =>
      Number(
        a.startDate || 0
      ) -
      Number(
        b.startDate || 0
      )
  );


  // ==================================================
  // VISIBLE MATCHES
  // ==================================================

  const visibleMatches =
    activeCategory === "all"
      ? uniqueAllMatches
      : data[activeCategory]
          ?.matches || [];


  // ==================================================
  // GROUP MATCHES BY SERIES
  // ==================================================

  const groupedSeries =
    Object.values(
      visibleMatches.reduce(
        (groups, match) => {
          /*
           * seriesId ko primary key
           * bana rahe hain.
           */

          const seriesId =
            match?.seriesId ||
            `unknown-${match?.seriesName || "series"}`;


          if (!groups[seriesId]) {
            groups[seriesId] = {
              seriesId,

              seriesName:
                match?.seriesName ||
                "Unknown Series",

              matches: [],
            };
          }


          groups[
            seriesId
          ].matches.push(match);


          return groups;
        },
        {}
      )
    );


  // ==================================================
  // ALL MATCHES LOAD MORE
  // ==================================================

  const loadAllNext =
    useCallback(async () => {
      const categories =
        Object.keys(
          CATEGORY_CONFIG
        );


      // Initialize unloaded categories
      const uninitialized =
        categories.filter(
          (category) => {
            const item =
              data[category];


            return (
              item &&
              !item.initialized &&
              !fetchingRef.current[
                category
              ]
            );
          }
        );


      if (
        uninitialized.length > 0
      ) {
        await Promise.all(
          uninitialized.map(
            (category) =>
              fetchCategory(
                category
              )
          )
        );


        return;
      }


      // Load next page
      const nextCategories =
        categories.filter(
          (category) => {
            const item =
              data[category];


            return (
              item &&
              item.initialized &&
              !item.loading &&
              item.hasMore &&
              !fetchingRef.current[
                category
              ]
            );
          }
        );


      if (
        nextCategories.length === 0
      ) {
        return;
      }


      await Promise.all(
        nextCategories.map(
          (category) =>
            fetchCategory(
              category
            )
        )
      );
    }, [
      data,
      fetchCategory,
    ]);


  // ==================================================
  // INFINITE SCROLL
  // ==================================================

  useEffect(() => {
    const sentinel =
      observerRef.current;


    if (!sentinel) return;


    const main =
      document.querySelector(
        ".cd-main"
      );


    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];


          if (
            !entry?.isIntersecting
          ) {
            return;
          }


          if (
            activeCategory ===
            "all"
          ) {
            loadAllNext();
          } else {
            fetchCategory(
              activeCategory
            );
          }
        },
        {
          /*
           * IMPORTANT
           *
           * Main page ab .cd-main
           * ke andar scroll ho raha hai.
           *
           * Isliye observer ka root
           * .cd-main rakhenge.
           */

          root: main || null,

          rootMargin: "500px",

          threshold: 0,
        }
      );


    observer.observe(sentinel);


    return () => {
      observer.disconnect();
    };
  }, [
    activeCategory,
    fetchCategory,
    loadAllNext,
  ]);


  // ==================================================
  // CURRENT LOADING STATE
  // ==================================================

  const isLoading =
    activeCategory === "all"
      ? Object.values(data).some(
          (item) => item.loading
        )
      : Boolean(
          data[activeCategory]
            ?.loading
        );


  // ==================================================
  // ALL MATCHES END STATE
  // ==================================================

  const allHasMore =
    Object.values(data).some(
      (item) => item.hasMore
    );


  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="upcoming-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <motion.div
        className="upcoming-header"

        initial={{
          opacity: 0,
          y: -20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div>

          <span className="page-kicker">
            CRICKET SCHEDULE
          </span>

          <h1>
            Upcoming Matches
          </h1>

          <p>
            Explore upcoming cricket
            matches across all categories.
          </p>

        </div>
      </motion.div>


      {/* ==================================================
          CATEGORY BUTTONS
      ================================================== */}

      <div className="category-wrapper">

        <div className="category-tabs">

          {BUTTONS.map((button) => {
            const active =
              activeCategory ===
              button.key;


            return (
              <motion.button
                key={button.key}

                type="button"

                className={`category-btn ${
                  active
                    ? "active"
                    : ""
                }`}

                onClick={() =>
                  handleCategoryChange(
                    button.key
                  )
                }

                whileHover={{
                  y: -2,
                }}

                whileTap={{
                  scale: 0.96,
                }}
              >

                <span className="category-icon">
                  {button.icon}
                </span>

                <span>
                  {button.label}
                </span>


                {active && (
                  <motion.span
                    className="active-line"

                    layoutId="activeCategory"

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
      </div>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <main className="matches-container">

        <AnimatePresence
          mode="wait"
        >

          <motion.div
            key={activeCategory}

            className="matches-section"

            initial={{
              opacity: 0,
              y: 15,
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

            {/* ==================================================
                CATEGORY TITLE
            ================================================== */}

            <div className="section-heading">

              <div>

                <span>
                  {activeCategory === "all"
                    ? "ALL CATEGORIES"
                    : CATEGORY_CONFIG[
                        activeCategory
                      ]?.label.toUpperCase()}
                </span>

                <h2>
                  {activeCategory === "all"
                    ? "All Upcoming Matches"
                    : `${
                        CATEGORY_CONFIG[
                          activeCategory
                        ]?.label
                      } Matches`}
                </h2>

              </div>


              <div className="match-count">
                {visibleMatches.length}{" "}
                {visibleMatches.length === 1
                  ? "Match"
                  : "Matches"}
              </div>

            </div>


            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!isLoading &&
              visibleMatches.length ===
                0 && (
                <motion.div
                  className="empty-state"

                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}

                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}

                  transition={{
                    duration: 0.3,
                  }}
                >

                  <div className="empty-icon">
                    🏏
                  </div>

                  <h3>
                    No matches found
                  </h3>

                  <p>
                    No upcoming matches
                    are available for
                    this category.
                  </p>

                </motion.div>
              )}


            {/* ==================================================
                SERIES GROUPS
            ================================================== */}

            <div className="series-list">

              {groupedSeries.map(
                (
                  series,
                  seriesIndex
                ) => (

                  <motion.section
                    key={
                      series.seriesId
                    }

                    className="series-group"

                    initial={{
                      opacity: 0,
                      y: 18,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      duration: 0.4,

                      delay:
                        seriesIndex *
                        0.07,

                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  >

                    {/* ==================================================
                        SERIES HEADER
                    ================================================== */}

                    <div className="series-group-header">

                     <div className="series-heading-left">
  <span className="series-kicker">
    SERIES
  </span>

  <a
    href={`/all-matches/${series.seriesId}`}
    className="series-heading-link"
  >
    <h3>{series.seriesName}</h3>

    <i className="bi bi-arrow-right series-heading-arrow"></i>
  </a>
</div>


                      <div className="series-match-count">

                        <span className="series-count-dot"></span>

                        {
                          series.matches
                            .length
                        }{" "}

                        {series.matches
                          .length === 1
                          ? "Match"
                          : "Matches"}

                      </div>

                    </div>


                    {/* ==================================================
                        SERIES MATCHES
                    ================================================== */}

                    <div className="matches-list">

                      {series.matches.map(
                        (
                          match,
                          matchIndex
                        ) => (

                          <MatchCard
                            key={`${
                              match.matchId ||
                              "match"
                            }-${matchIndex}`}

                            match={match}

                            animationIndex={
                              matchIndex
                            }
                          />

                        )
                      )}

                    </div>

                  </motion.section>

                )
              )}

            </div>


            {/* ==================================================
                LOADING
            ================================================== */}

            {isLoading && (
              <LoadingSkeleton />
            )}


            {/* ==================================================
                INFINITE SCROLL SENTINEL
            ================================================== */}

            <div
              ref={observerRef}
              className="scroll-sentinel"
            />


            {/* ==================================================
                END
            ================================================== */}

            {!isLoading &&
              visibleMatches.length >
                0 &&
              (
                activeCategory === "all"
                  ? !allHasMore
                  : !data[
                      activeCategory
                    ]?.hasMore
              ) && (

                <div className="end-message">

                  <span>✓</span>

                  You have reached
                  the end

                </div>

              )}

          </motion.div>

        </AnimatePresence>

      </main>

    </div>
  );
}


// ==================================================
// MATCH CARD
// ==================================================

function MatchCard({
  match,
  animationIndex = 0,
}) {
  const team1 =
    match.team1;

  const team2 =
    match.team2;


  const seriesUrl =
    match.seriesId
      ? `/all-matches/${match.seriesId}`
      : "#";


  const matchUrl =
    match.matchId
      ? `/match/${match.matchId}`
      : "#";


  return (
    <motion.article

      className="match-card"

      initial={{
        opacity: 0,
        y: 20,
        scale: 0.985,
      }}

      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}

      transition={{
        duration: 0.4,

        delay:
          animationIndex *
          0.06,

        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}

      whileHover={{
        y: -5,
        transition: {
          duration: 0.2,
        },
      }}

      whileTap={{
        scale: 0.995,
      }}
    >

      {/* ==================================================
          SERIES / FORMAT
      ================================================== */}

      <div className="card-top">

        {/* Series name intentionally removed
            because series heading is now outside */}

        <span className="series-spacer"></span>

        <span className="format-badge">
          {match.matchFormat ||
            "CRICKET"}
        </span>

      </div>


      {/* ==================================================
          MATCH
      ================================================== */}

      <a
        href={matchUrl}

        className="match-main"

        onClick={(e) => {
          if (!match.matchId) {
            e.preventDefault();
          }
        }}
      >

        <div className="match-info">

          <span className="match-desc">
            {match.matchDesc}
          </span>

          <span className="match-date">
            {formatDate(
              match.startDate
            )}

            {" • "}

            {formatTime(
              match.startDate
            )}
          </span>

        </div>


        {/* ==================================================
            TEAMS
        ================================================== */}

        <div className="teams">

          {/* TEAM 1 */}

          <div className="team">

            <div className="team-logo">

              {team1?.imageId ? (

                <img
                  src={`https://static.cricbuzz.com/a/img/v1/100x100/i1/c${team1.imageId}/team.jpg`}

                  alt={getTeamName(
                    team1
                  )}

                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              ) : (

                <span>
                  {getTeamShort(
                    team1
                  )}
                </span>

              )}

            </div>


            <div>

              <strong>
                {getTeamName(
                  team1
                )}
              </strong>

              <small>
                {getTeamShort(
                  team1
                )}
              </small>

            </div>

          </div>


          {/* VS */}

          <div className="vs">
            VS
          </div>


          {/* TEAM 2 */}

          <div className="team team-right">

            <div>

              <strong>
                {getTeamName(
                  team2
                )}
              </strong>

              <small>
                {getTeamShort(
                  team2
                )}
              </small>

            </div>


            <div className="team-logo">

              {team2?.imageId ? (

                <img
                  src={`https://static.cricbuzz.com/a/img/v1/100x100/i1/c${team2.imageId}/team.jpg`}

                  alt={getTeamName(
                    team2
                  )}

                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              ) : (

                <span>
                  {getTeamShort(
                    team2
                  )}
                </span>

              )}

            </div>

          </div>

        </div>

      </a>


      {/* ==================================================
          VENUE
      ================================================== */}

      <div className="venue">

        <span>📍</span>

        <span>

          {match.venueInfo
            ?.ground ||
            "Venue TBD"}

          {match.venueInfo
            ?.city
            ? `, ${match.venueInfo.city}`
            : ""}

        </span>

      </div>


      {/* ==================================================
          FOOTER
      ================================================== */}

     
    </motion.article>
  );
}


// ==================================================
// LOADING SKELETON
// ==================================================

function LoadingSkeleton() {
  return (
    <div className="loading-list">

      {[1, 2, 3].map(
        (item) => (

          <motion.div
            key={item}

            className="loading-card"

            animate={{
              opacity: [
                0.45,
                0.9,
                0.45,
              ],
            }}

            transition={{
              duration: 1.2,
              repeat: Infinity,
            }}
          >

            <div className="skeleton skeleton-small" />

            <div className="skeleton skeleton-title" />

            <div className="skeleton skeleton-team" />

            <div className="skeleton skeleton-team" />

          </motion.div>

        )
      )}

    </div>
  );
}