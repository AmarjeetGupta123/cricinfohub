import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./Records.css";

/* =========================================================
   API
   /{recordKey}/{matchType}/{year}/{team}/{opponent}
========================================================= */

const API_BASE = "/api/cricket-stats/stats-table";

const RECORD_GROUPS = [
  {
    key: "batting",
    label: "Batting",
    icon: "bi-person-arms-up",
    items: [
      { key: "mostRuns", label: "Most runs" },
      { key: "highestScore", label: "Highest scores" },
      { key: "highestAvg", label: "Best average" },
      { key: "bestStrikeRate", label: "Best strike rate" },
      { key: "mostHundreds", label: "Most hundreds" },
      { key: "mostFifties", label: "Most fifties" },
      { key: "mostFours", label: "Most fours" },
      { key: "mostSixes", label: "Most sixes" },
      { key: "mostNineties", label: "Most nineties" },
    ],
  },
  {
    key: "bowling",
    label: "Bowling",
    icon: "bi-bullseye",
    items: [
      { key: "mostWickets", label: "Most wickets" },
      { key: "bestBowlingAverage", label: "Best average" },
      { key: "bestBowling", label: "Best bowling" },
      { key: "mostFiveWickets", label: "Most five-wicket hauls" },
      { key: "bestEconomy", label: "Best economy" },
      { key: "bestBowlingStrikeRate", label: "Best strike rate" },
    ],
  },
];

/* The column that the selected record is actually ranked by. */
const HIGHLIGHT_HEADER_BY_RECORD = {
  mostRuns: "RUNS",
  highestScore: "H.S",
  highestAvg: "AVG",
  bestStrikeRate: "SR",
  mostHundreds: "100s",
  mostFifties: "50s",
  mostFours: "4s",
  mostSixes: "6s",
  mostNineties: "90s",
  mostWickets: "WKTS",
  bestBowlingAverage: "AVG",
  bestBowling: "WKTS",
  mostFiveWickets: "5-FERS",
  bestEconomy: "ECON",
  bestBowlingStrikeRate: "SR",
};

/* Player column (index 0) is always kept. */
const VISIBLE_COLUMNS_BY_RECORD = {
  mostRuns: ["MATCHES", "INNS", "RUNS", "AVG"],
  highestScore: ["MATCHES", "INNS", "RUNS", "H.S"],
  highestAvg: ["MATCHES", "INNS", "RUNS", "AVG"],
  bestStrikeRate: ["MATCHES", "INNS", "RUNS", "SR"],
  mostHundreds: ["MATCHES", "INNS", "RUNS", "100s", "50s"],
  mostFifties: ["MATCHES", "INNS", "RUNS", "50s"],
  mostFours: ["MATCHES", "INNS", "RUNS", "4s"],
  mostSixes: ["MATCHES", "INNS", "RUNS", "6s"],
  mostNineties: ["MATCHES", "INNS", "RUNS", "90s"],

  mostWickets: ["MATCHES", "OVERS", "RUNS", "WKTS"],
  bestBowlingAverage: ["MATCHES", "OVERS", "WKTS", "AVG"],
  bestBowling: ["MATCHES", "OVERS", "RUNS", "WKTS"],
  mostFiveWickets: ["MATCHES", "OVERS", "WKTS", "4-FERS", "5-FERS"],
  bestEconomy: ["MATCHES", "OVERS", "WKTS", "ECON"],
  bestBowlingStrikeRate: ["MATCHES", "OVERS", "WKTS", "SR"],
};

const DEFAULT_RECORD = "mostRuns";

const DEFAULT_FILTERS = {
  matchType: "1",
  year: "all",
  team: "all",
  opponent: "all",
};

const FALLBACK_MATCH_TYPES = [
  { value: "1", label: "Test" },
  { value: "2", label: "ODI" },
  { value: "3", label: "T20" },
];

const FALLBACK_TEAMS = [
  { value: "all", label: "All teams" },
  { value: "2", label: "IND" },
  { value: "27", label: "IRE" },
  { value: "3", label: "PAK" },
  { value: "4", label: "AUS" },
  { value: "5", label: "SL" },
  { value: "6", label: "BAN" },
  { value: "9", label: "ENG" },
  { value: "10", label: "WI" },
  { value: "11", label: "RSA" },
  { value: "12", label: "ZIM" },
  { value: "13", label: "NZ" },
  { value: "96", label: "AFG" },
];

const FALLBACK_YEARS = [
  { value: "all", label: "All years" },
  ...Array.from({ length: 2026 - 1937 + 1 }, (_, i) => {
    const year = String(2026 - i);
    return { value: year, label: year };
  }),
];

/* =========================================================
   HELPERS
========================================================= */

const cleanLabel = (value) =>
  value === null || value === undefined ? "" : String(value).trim();

const normalizeHeader = (value) =>
  String(value || "").trim().toUpperCase().replace(/\s+/g, "");

const titleCase = (value) => {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.length <= 3) return text.toUpperCase();
  return text[0].toUpperCase() + text.slice(1).toLowerCase();
};

const getVisibleHeaderIndexes = (headers, recordKey) => {
  const wanted = VISIBLE_COLUMNS_BY_RECORD[recordKey];
  if (!wanted?.length) return headers.map((_, index) => index);

  const wantedSet = new Set(wanted.map(normalizeHeader));

  return headers.reduce((indexes, header, index) => {
    if (index === 0 || wantedSet.has(normalizeHeader(header))) {
      indexes.push(index);
    }
    return indexes;
  }, []);
};

const findRecordItem = (recordKey) => {
  for (const group of RECORD_GROUPS) {
    const item = group.items.find((entry) => entry.key === recordKey);
    if (item) return { ...item, group: group.key, groupLabel: group.label };
  }
  return { key: recordKey, label: "Records", group: "batting", groupLabel: "Batting" };
};

const normalizeOptions = (list, type = "team") => {
  if (!Array.isArray(list)) return [];

  return list
    .map((item) => {
      if (typeof item === "string") {
        return {
          value: item,
          label: item.toLowerCase() === "all" ? "All years" : item,
        };
      }

      if (type === "match") {
        return {
          value: String(item?.matchTypeId ?? item?.id ?? item?.value ?? ""),
          label: titleCase(
            item?.matchTypeDesc ?? item?.label ?? item?.name ?? ""
          ),
        };
      }

      const value = String(item?.id ?? item?.teamId ?? item?.value ?? "");
      const raw = String(
        item?.teamShortName ?? item?.shortName ?? item?.label ?? item?.name ?? ""
      );

      return {
        value,
        label: raw.toLowerCase() === "all" ? "All teams" : raw.toUpperCase(),
      };
    })
    .filter((item) => item.value !== "");
};

const getApiUrl = (recordKey, { matchType, year, team, opponent }) =>
  `${API_BASE}/${recordKey}/${matchType}/${year}/${team}/${opponent}`;

/*
  Cricbuzz webValues carry a hidden player id at index 0:
  ["110", "Muthiah Muralidaran", "133", ...]
  webHeaders start at the name:
  ["Bowler", "MATCHES", ...]

  Strip the id so headers[i] maps straight onto row[i].
*/
const stripIdColumn = (values, headers) =>
  (Array.isArray(values) ? values : []).map((row) =>
    Array.isArray(row) && row.length === headers.length + 1 ? row.slice(1) : row
  );

const normalizeTable = (payload) => {
  const headers = Array.isArray(payload?.webHeaders) ? payload.webHeaders : [];
  const ids = (Array.isArray(payload?.webValues) ? payload.webValues : []).map(
    (row) => (Array.isArray(row) ? cleanLabel(row[0]) : "")
  );

  return {
    headers,
    rows: stripIdColumn(payload?.webValues, headers),
    ids,
  };
};

/* "9/51" sorts on wickets first, then on fewer runs. */
const toSortable = (value) => {
  const text = cleanLabel(value);
  if (!text || text === "-") return Number.NEGATIVE_INFINITY;

  if (text.includes("/")) {
    const [wickets, runs] = text.split("/").map((part) => parseFloat(part));
    if (Number.isFinite(wickets)) {
      return wickets * 1000 - (Number.isFinite(runs) ? runs : 0);
    }
  }

  const numeric = parseFloat(text.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(numeric) ? numeric : Number.NEGATIVE_INFINITY;
};

/* =========================================================
   SUB COMPONENTS
========================================================= */

function FilterSelect({ label, value, options, onChange, disabled }) {
  return (
    <label className="record-filter">
      <span className="record-filter-label">{label}</span>

      <span className="record-select-wrap">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={`${label}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <i className="bi bi-chevron-down" aria-hidden="true" />
      </span>
    </label>
  );
}

function BallSpinner({ compact = false }) {
  return (
    <span className={`seam-ball${compact ? " is-compact" : ""}`} aria-hidden="true">
      <span className="seam" />
      <span className="seam" />
    </span>
  );
}

function SkeletonRows({ columns }) {
  return (
    <div className="records-skeleton" aria-hidden="true">
      {Array.from({ length: 10 }, (_, index) => (
        <div className="records-skeleton-row" key={`skeleton-${index}`}>
          <span className="skeleton-rank" />
          <span className="skeleton-player" />
          {Array.from({ length: columns }, (_, cell) => (
            <span className="skeleton-cell" key={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function Records() {
  const [activeRecord, setActiveRecord] = useState(DEFAULT_RECORD);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null); // { column, direction }

  const [table, setTable] = useState({ headers: [], rows: [], ids: [] });
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [matchTypes, setMatchTypes] = useState(FALLBACK_MATCH_TYPES);
  const [teams, setTeams] = useState(FALLBACK_TEAMS);
  const [opponentTeams, setOpponentTeams] = useState(FALLBACK_TEAMS);
  const [years, setYears] = useState(FALLBACK_YEARS);

  const [menuOpen, setMenuOpen] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const requestRef = useRef(0);

  const record = useMemo(() => findRecordItem(activeRecord), [activeRecord]);

  /* -------------------------------------------------------
     FETCH — aborts in-flight requests so fast filter
     clicks can never land out of order.
  ------------------------------------------------------- */

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestRef.current;

    const isStale = () => requestId !== requestRef.current;

    setStatus("loading");
    setError("");

    axios
      .get(getApiUrl(activeRecord, filters), {
        timeout: 20000,
        signal: controller.signal,
      })
      .then((response) => {
        if (isStale()) return;

        const payload = response?.data || {};
        const normalized = normalizeTable(payload);

        setTable(normalized);

        const apiMatchTypes = normalizeOptions(payload?.matchTypes, "match");
        const apiTeams = normalizeOptions(payload?.teams);
        const apiOpponents = normalizeOptions(payload?.opponentTeams);

        if (apiMatchTypes.length) setMatchTypes(apiMatchTypes);
        if (apiTeams.length) setTeams(apiTeams);
        if (apiOpponents.length) setOpponentTeams(apiOpponents);

        if (Array.isArray(payload?.years) && payload.years.length) {
          setYears(normalizeOptions(payload.years));
        }

        setStatus("ready");
        setHasLoadedOnce(true);
      })
      .catch((err) => {
        if (axios.isCancel?.(err) || err?.name === "CanceledError") return;
        if (isStale()) return;

        setTable({ headers: [], rows: [], ids: [] });
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "The stats service did not respond. Check your connection and load it again."
        );
        setStatus("error");
        setHasLoadedOnce(true);
      });

    return () => controller.abort();
  }, [activeRecord, filters, reloadToken]);

  /* -------------------------------------------------------
     DERIVED TABLE
  ------------------------------------------------------- */

  const visibleIndexes = useMemo(
    () => getVisibleHeaderIndexes(table.headers, activeRecord),
    [table.headers, activeRecord]
  );

  const headers = useMemo(() => {
    const list = visibleIndexes.map((index) => table.headers[index]);
    if (list.length) {
      list[0] = record.group === "bowling" ? "Bowler" : "Batter";
    }
    return list;
  }, [table.headers, visibleIndexes, record.group]);

  const highlightColumn = useMemo(() => {
    const target = normalizeHeader(HIGHLIGHT_HEADER_BY_RECORD[activeRecord]);
    const index = headers.findIndex(
      (header, position) => position > 0 && normalizeHeader(header) === target
    );
    return index === -1 ? (headers.length > 1 ? headers.length - 1 : -1) : index;
  }, [headers, activeRecord]);

  const rows = useMemo(() => {
    const mapped = table.rows.map((row, rowIndex) => ({
      id: table.ids[rowIndex] || `row-${rowIndex}`,
      apiRank: rowIndex + 1,
      cells: visibleIndexes.map((index) => cleanLabel(row?.[index])),
    }));

    const query = search.trim().toLowerCase();
    const filtered = query
      ? mapped.filter((item) => item.cells[0]?.toLowerCase().includes(query))
      : mapped;

    if (!sort) return filtered;

    const direction = sort.direction === "asc" ? 1 : -1;

    return [...filtered].sort((a, b) => {
      if (sort.column === 0) {
        return a.cells[0].localeCompare(b.cells[0]) * direction;
      }
      const diff = toSortable(a.cells[sort.column]) - toSortable(b.cells[sort.column]);
      return diff === 0 ? a.apiRank - b.apiRank : diff * direction;
    });
  }, [table.rows, table.ids, visibleIndexes, search, sort]);

  const statColumnCount = Math.max(headers.length - 1, 4);

  const gridTemplate = useMemo(
    () =>
      `56px minmax(190px, 1.7fr) repeat(${statColumnCount}, minmax(86px, 0.7fr))`,
    [statColumnCount]
  );

  /* -------------------------------------------------------
     HANDLERS
  ------------------------------------------------------- */

  const updateFilter = useCallback((key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setSort(null);
  }, []);

  const selectRecord = useCallback((key) => {
    setActiveRecord(key);
    setSort(null);
    setSearch("");
    setMenuOpen(false);
  }, []);

  const toggleSort = useCallback((column) => {
    setSort((current) => {
      if (!current || current.column !== column) {
        return { column, direction: column === 0 ? "asc" : "desc" };
      }
      if (current.direction === "desc") return { column, direction: "asc" };
      return null; // third click restores the API's own ranking
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    setSort(null);
  }, []);

  const filtersChanged =
    search.trim() !== "" ||
    Object.keys(DEFAULT_FILTERS).some(
      (key) => filters[key] !== DEFAULT_FILTERS[key]
    );

  const formatLabel =
    matchTypes.find((item) => String(item.value) === String(filters.matchType))
      ?.label || "Test";

  const teamLabel =
    filters.team === "all"
      ? "All teams"
      : teams.find((item) => item.value === filters.team)?.label || filters.team;

  const opponentLabel =
    filters.opponent === "all"
      ? "All opponents"
      : opponentTeams.find((item) => item.value === filters.opponent)?.label ||
        filters.opponent;

  const showSkeleton = status === "loading";
  const showRefreshing = status === "loading" && hasLoadedOnce;

  return (
    <main className="records-page">
      <div className="records-shell">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="records-page-header">
          <div className="records-title-block">
            <h1>Records</h1>
            <p>
              Career leaderboards from Cricbuzz, filtered by format, season and
              opposition.
            </p>
          </div>

          <div className="records-header-meta">
            <span className="header-chip">
              <i className="bi bi-hourglass-split" aria-hidden="true" />
              {formatLabel}
            </span>
            <span className="header-chip">
              <i className="bi bi-flag" aria-hidden="true" />
              {teamLabel}
            </span>
          </div>
        </header>

        <div className="records-layout">
          {/* ===================================================
              RECORD NAVIGATION
          =================================================== */}

          <aside className="records-menu">
            <button
              type="button"
              className="records-menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
            >
              <span>
                <small>{record.groupLabel}</small>
                {record.label}
              </span>
              <i
                className={`bi bi-chevron-${menuOpen ? "up" : "down"}`}
                aria-hidden="true"
              />
            </button>

            <div className={`records-menu-body${menuOpen ? " is-open" : ""}`}>
              {RECORD_GROUPS.map((group) => (
                <section className="record-menu-group" key={group.key}>
                  <h2
                    className={`record-group-title${
                      record.group === group.key ? " is-active" : ""
                    }`}
                  >
                    <i className={`bi ${group.icon}`} aria-hidden="true" />
                    {group.label}
                    <small>{group.items.length}</small>
                  </h2>

                  <div className="record-menu-items" role="tablist">
                    {group.items.map((item) => {
                      const active = activeRecord === item.key;
                      return (
                        <button
                          type="button"
                          role="tab"
                          aria-selected={active}
                          key={item.key}
                          className={`record-menu-item${active ? " is-active" : ""}`}
                          onClick={() => selectRecord(item.key)}
                        >
                          <span>{item.label}</span>
                          <i className="bi bi-arrow-right-short" aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </aside>

          {/* ===================================================
              CONTENT
          =================================================== */}

          <section className="records-content">
            <div className="records-filter-card">
              <div className="records-filters">
                <FilterSelect
                  label="Format"
                  value={filters.matchType}
                  options={matchTypes}
                  onChange={(value) => updateFilter("matchType", value)}
                />
                <FilterSelect
                  label="Season"
                  value={filters.year}
                  options={years}
                  onChange={(value) => updateFilter("year", value)}
                />
                <FilterSelect
                  label="Team"
                  value={filters.team}
                  options={teams}
                  onChange={(value) => updateFilter("team", value)}
                />
                <FilterSelect
                  label="Opponent"
                  value={filters.opponent}
                  options={opponentTeams}
                  onChange={(value) => updateFilter("opponent", value)}
                />

                <label className="record-filter record-search">
                  <span className="record-filter-label">Find a player</span>
                  <span className="record-search-wrap">
                    <i className="bi bi-search" aria-hidden="true" />
                    <input
                      type="search"
                      value={search}
                      placeholder="Search by name"
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </span>
                </label>
              </div>

              {filtersChanged && (
                <button type="button" className="record-reset" onClick={resetFilters}>
                  <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
                  Reset filters
                </button>
              )}
            </div>

            <div className="active-record-bar">
              <div className="active-record-title">
                <h2>{record.label}</h2>
                <p>
                  {record.groupLabel} · {formatLabel} ·{" "}
                  {filters.year === "all" ? "all seasons" : filters.year} ·{" "}
                  {teamLabel} vs {opponentLabel}
                </p>
              </div>

              <div className="active-record-count">
                <AnimatePresence mode="wait" initial={false}>
                  {showRefreshing ? (
                    <motion.span
                      key="refreshing"
                      className="count-pill is-loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <BallSpinner compact />
                      Updating
                    </motion.span>
                  ) : (
                    <motion.span
                      key={`count-${rows.length}`}
                      className="count-pill"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                    >
                      <strong>{rows.length}</strong>
                      {rows.length === 1 ? "player" : "players"}
                    </motion.span>
                  )}
                </AnimatePresence>

                {sort && (
                  <button
                    type="button"
                    className="sort-reset"
                    onClick={() => setSort(null)}
                  >
                    Restore ranking
                  </button>
                )}
              </div>
            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="records-table-card">
              <div className="records-table-scroll">
                <div
  className="records-table"
  style={{
    "--record-columns": gridTemplate,
    "--stat-columns": statColumnCount,
  }}
>
                  <div className="records-table-head" role="row">
                    <span className="rank-head">#</span>

                    {headers.length ? (
                      headers.map((header, index) => (
                        <button
                          type="button"
                          key={`${header}-${index}`}
                          className={[
                            "records-head-cell",
                            index === 0 ? "player-head" : "",
                            index === highlightColumn ? "is-highlighted" : "",
                            sort?.column === index ? "is-sorted" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          onClick={() => toggleSort(index)}
                          title={`Sort by ${header}`}
                        >
                          {header}
                          <i
                            className={`bi bi-caret-${
                              sort?.column === index && sort.direction === "asc"
                                ? "up"
                                : "down"
                            }-fill`}
                            aria-hidden="true"
                          />
                        </button>
                      ))
                    ) : (
                      <span className="records-head-cell player-head">Player</span>
                    )}
                  </div>

                  {showSkeleton ? (
                    <SkeletonRows columns={statColumnCount} />
                  ) : status === "error" ? (
                    <div className="records-state">
                      <div className="state-icon is-error">
                        <i className="bi bi-wifi-off" aria-hidden="true" />
                      </div>
                      <h3>Records did not load</h3>
                      <p>{error}</p>
                      <button
                        type="button"
                        onClick={() => setReloadToken((token) => token + 1)}
                      >
                        <i className="bi bi-arrow-clockwise" aria-hidden="true" />
                        Load again
                      </button>
                    </div>
                  ) : rows.length ? (
                    <div className="records-table-body">
                      {rows.map((row, index) => (
                        <motion.div
                          className="records-table-row"
                          key={`${activeRecord}-${row.id}`}
                          role="row"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.22,
                            delay: Math.min(index * 0.012, 0.18),
                          }}
                        >
                          <div className="record-rank-cell">
                            <span
                              className={`rank-badge${
                                !sort && index < 3 ? " is-podium" : ""
                              }`}
                            >
                              {sort ? index + 1 : row.apiRank}
                            </span>
                          </div>

                          {headers.map((header, columnIndex) => {
                            const value = row.cells[columnIndex] || "—";

                            if (columnIndex === 0) {
                              return (
                                <div
                                  className="record-player-cell"
                                  key={`${row.id}-player`}
                                >
                                  <span className="record-player-name">
                                    {row.cells[0] || "Unknown player"}
                                  </span>
                                </div>
                              );
                            }

                            return (
                              <div
                                className={`record-value-cell${
                                  columnIndex === highlightColumn
                                    ? " is-primary"
                                    : ""
                                }`}
                                data-label={header}
                                key={`${row.id}-${columnIndex}`}
                              >
                                <span>{value}</span>
                              </div>
                            );
                          })}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="records-state">
                      <div className="state-icon">
                        <i className="bi bi-search" aria-hidden="true" />
                      </div>
                      <h3>
                        {search.trim()
                          ? "No player matches that name"
                          : "Nothing recorded for this combination"}
                      </h3>
                      <p>
                        {search.trim()
                          ? "Clear the search to see the full leaderboard."
                          : "Widen the season, team or opponent to see results."}
                      </p>
                      <button type="button" onClick={resetFilters}>
                        <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="records-footer">
              Tap a column heading to re-sort. Statistics from Cricbuzz.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}