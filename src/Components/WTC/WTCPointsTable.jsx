import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../Services/Api";
import "./WTCPointsTable.css";

/*
  Cricbuzz points table: /points-table/{tableId}/{seasonId}

  The season ids are fixed by the endpoint, so they stay in a
  local map rather than being read out of seasonStandings.
*/

const TABLE_ID = 1;
const DEFAULT_SEASON_ID = 15;

const WTC_SEASONS = [
  { id: 15, name: "2025–2027", full: "World Test Championship 2025–2027" },
  { id: 5, name: "2023–2025", full: "World Test Championship 2023–2025" },
  { id: 4, name: "2021–2023", full: "World Test Championship 2021–2023" },
  { id: 3, name: "2019–2021", full: "World Test Championship 2019–2021" },
];

/* Top two sides play the final. */
const QUALIFYING_SPOTS = 2;

const COLUMNS = [
  { key: "seriesPlayed", label: "Series", short: "Series" },
  { key: "matchesPlayed", label: "Played", short: "P" },
  { key: "matchesWon", label: "Won", short: "W" },
  { key: "matchesLost", label: "Lost", short: "L" },
  { key: "matchesDrawn", label: "Drawn", short: "D" },
];

const getTeamImage = (imageId) =>
  imageId
    ? `https://static.cricbuzz.com/a/img/v1/100x100/i1/c${imageId}/team.jpg`
    : null;

const formatPct = (value) =>
  value == null || value === "" ? "—" : `${Number(value).toFixed(2)}%`;

const initialData = { teamStandings: [], subText: "" };

/* =========================================================
   TEAM LOGO — fallback handled in state, not by poking the DOM
========================================================= */

function TeamLogo({ imageId, name }) {
  const [failed, setFailed] = useState(false);
  const src = getTeamImage(imageId);
  const initials = String(name || "T")
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    setFailed(false);
  }, [imageId]);

  return (
    <span className="team-logo">
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="team-logo-initials">{initials}</span>
      )}
    </span>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function WTCPointsTable() {
  const [seasonId, setSeasonId] = useState(DEFAULT_SEASON_ID);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const season = useMemo(
    () =>
      WTC_SEASONS.find((item) => Number(item.id) === Number(seasonId)) ||
      WTC_SEASONS[0],
    [seasonId]
  );

  const fetchPointsTable = useCallback(async (id, signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/points-table/${TABLE_ID}/${id}`, {
        signal,
      });
      const json = response?.data || {};

      setData({
        teamStandings: Array.isArray(json?.teamStandings)
          ? json.teamStandings
          : [],
        subText: json?.subText || "",
      });
    } catch (err) {
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;

      setData(initialData);
      setError(
        err?.response?.status
          ? `The standings service returned ${err.response.status}. Load it again in a moment.`
          : "The standings did not load. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchPointsTable(seasonId, controller.signal);
    return () => controller.abort();
  }, [fetchPointsTable, seasonId]);

  const standings = data.teamStandings;

  return (
    <div className="points-page">
      <div className="points-shell">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="points-header">
          <div className="points-title-block">
            <h1>Points table</h1>
            <p>
              Test championship standings, ranked by points percentage. The top{" "}
              {QUALIFYING_SPOTS} sides contest the final.
            </p>
          </div>

          <label className="season-picker">
            <span>Season</span>
            <span className="season-select">
              <select
                value={seasonId}
                onChange={(event) => setSeasonId(Number(event.target.value))}
                aria-label="Championship season"
              >
                {WTC_SEASONS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.full}
                  </option>
                ))}
              </select>
              <i className="bi bi-chevron-down" aria-hidden="true" />
            </span>
          </label>
        </header>

        {/* =================================================
            SUMMARY BAR
        ================================================= */}

        <div className="points-summary">
          <span className="summary-season">{season.full}</span>

          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.span
                key="loading"
                className="summary-count is-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="seam-ball" aria-hidden="true">
                  <span className="seam" />
                  <span className="seam" />
                </span>
                Loading standings
              </motion.span>
            ) : (
              <motion.span
                key={`count-${standings.length}`}
                className="summary-count"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <strong>{standings.length}</strong>
                {standings.length === 1 ? "team" : "teams"}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="points-error" role="alert">
            <i className="bi bi-exclamation-circle" aria-hidden="true" />
            <p>{error}</p>
            <button type="button" onClick={() => fetchPointsTable(seasonId)}>
              Load again
            </button>
          </div>
        )}

        {/* =================================================
            TABLE
        ================================================= */}

        <section className="points-card">
          <div className="points-table-scroll">
            <table className="points-table">
              <caption className="visually-hidden">
                {season.full} team standings
              </caption>

              <thead>
                <tr>
                  <th scope="col" className="col-rank">
                    #
                  </th>
                  <th scope="col" className="col-team">
                    Team
                  </th>
                  {COLUMNS.map((column) => (
                    <th scope="col" key={column.key} title={column.label}>
                      {column.short}
                    </th>
                  ))}
                  <th scope="col" className="col-points">
                    Pts
                  </th>
                  <th scope="col" className="col-pct">
                    PCT
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : standings.length ? (
                  standings.map((team, index) => {
                    const rank = team.teamRank || index + 1;
                    const qualifying = rank <= QUALIFYING_SPOTS;

                    return (
                      <motion.tr
                        key={team.teamId || index}
                        className={qualifying ? "is-qualifying" : ""}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.22,
                          delay: Math.min(index * 0.02, 0.16),
                        }}
                      >
                        <td className="col-rank" data-label="Position">
                          <span
                            className={`rank-badge${
                              qualifying ? " is-qualifying" : ""
                            }`}
                          >
                            {rank}
                          </span>
                        </td>

                        <td className="col-team" data-label="Team">
                          <span className="team-identity">
                            <TeamLogo
                              imageId={team.teamImageId}
                              name={team.teamName}
                            />
                            <span className="team-name-wrap">
                              <strong>{team.teamName}</strong>
                              {team.currentlyPlaying ? (
                                <small className="is-playing">In a Test now</small>
                              ) : qualifying ? (
                                <small>Final place</small>
                              ) : null}
                            </span>
                          </span>
                        </td>

                        {COLUMNS.map((column) => (
                          <td
                            key={column.key}
                            data-label={column.label}
                            className={column.key === "matchesWon" ? "is-won" : ""}
                          >
                            {team[column.key] ?? "—"}
                          </td>
                        ))}

                        <td className="col-points" data-label="Points">
                          {team.totalPoints ?? "—"}
                        </td>

                        <td className="col-pct" data-label="Points %">
                          <span>{formatPct(team.pctPercentage)}</span>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  !error && (
                    <tr className="points-empty-row">
                      <td colSpan={COLUMNS.length + 3}>
                        <div className="points-empty">
                          <i className="bi bi-table" aria-hidden="true" />
                          <strong>No standings for this season</strong>
                          <span>Pick another championship cycle above.</span>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {data.subText && !loading && (
            <footer className="points-note">
              <i className="bi bi-info-circle" aria-hidden="true" />
              <p>{data.subText}</p>
            </footer>
          )}
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 9 }, (_, index) => (
        <tr className="skeleton-row" key={`skeleton-${index}`}>
          <td className="col-rank">
            <span className="sk sk-rank" />
          </td>
          <td className="col-team">
            <span className="sk-team">
              <span className="sk sk-logo" />
              <span className="sk sk-name" />
            </span>
          </td>
          {COLUMNS.map((column) => (
            <td key={column.key}>
              <span className="sk sk-number" />
            </td>
          ))}
          <td>
            <span className="sk sk-number" />
          </td>
          <td>
            <span className="sk sk-pct" />
          </td>
        </tr>
      ))}
    </>
  );
}