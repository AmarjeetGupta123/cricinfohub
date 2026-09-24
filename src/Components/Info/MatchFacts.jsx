import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  CalendarDays,
  Clock3,
  MapPin,
  Coins,
  UserRound,
  Users,
  ShieldCheck,
  Radio,
  Tv,
  Building2,
  Flag,
  ChevronDown,
  ChevronUp,
  CircleDot,
  UserCog,
  Award,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import "./MatchFacts.css";
import BackApi from "../../Services/Back";

const MatchFacts = ({ matchId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openTeams, setOpenTeams] = useState({});

  useEffect(() => {
    if (!matchId) return;

    const fetchMatchFacts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await BackApi.get(`/match-facts/${matchId}`);

        if (response.data?.success) {
          setData(response.data);

          const initialOpen = {};

          response.data?.squads?.forEach((_, index) => {
            initialOpen[index] = true;
          });

          setOpenTeams(initialOpen);
        } else {
          setError("Match facts could not be loaded.");
        }
      } catch (err) {
        console.error("Match Facts Error:", err);
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Unable to load match facts."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMatchFacts();
  }, [matchId]);

  const toggleTeam = (index) => {
    setOpenTeams((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getInfoValue = (keys = []) => {
    if (!data?.info) return "-";

    for (const key of keys) {
      if (data.info[key]) {
        return data.info[key];
      }
    }

    return "-";
  };

  const formatKey = (key) => {
    if (!key) return "";

    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };


  const pageVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.07,
        duration: 0.45,
        ease: "easeOut",
      },
    }),
  };

  const playerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.96,
      y: 10,
    },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: index * 0.035,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  if (loading) {
    return (
      <div className="match-facts-page">
        <div className="mf-loading-wrapper">
          <motion.div
            className="mf-loading-card"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="mf-loading-icon"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <RefreshCw size={30} />
            </motion.div>

            <h4>Loading Match Facts</h4>
            <p>Please wait while we fetch the latest information.</p>

            <div className="mf-loading-bar">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="match-facts-page">
        <motion.div
          className="mf-error-card"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="mf-error-icon">
            <AlertCircle size={34} />
          </div>

          <h3>Match Facts Unavailable</h3>

          <p>{error}</p>

          <button
            className="mf-retry-btn"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!data) return null;

  const squads = data?.squads || [];

  const venueGuide = data?.venueGuide || {};

  const broadcastGuide = data?.broadcastGuide || {};

  return (
    <motion.div
      className="match-facts-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container-fluid px-3 px-md-4 px-xl-5">
        {/* =========================================
            HERO
        ========================================= */}

        <motion.div
          className="mf-hero"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mf-hero-glow mf-glow-one" />
          <div className="mf-hero-glow mf-glow-two" />

          <div className="mf-hero-content">
            <motion.div
              className="mf-trophy"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 180,
              }}
            >
              <Trophy size={28} />
            </motion.div>

            <div className="mf-hero-text">
              <span className="mf-small-label">MATCH FACTS</span>

              <h1>
                {getInfoValue(["Match"]) !== "-"
                  ? getInfoValue(["Match"])
                  : `Match #${matchId}`}
              </h1>

              
            </div>
            
          </div>
          <div className="mf-hero-meta">
                <span>
                  <CalendarDays size={16} />
                  {getInfoValue(["Date"])}
                </span>

                <span>
                  <Clock3 size={16} />
                  {getInfoValue(["Time"])}
                </span>
              </div>
        </motion.div>

        {/* =========================================
            QUICK INFO
        ========================================= */}

        <div className="row g-3 mt-2">
          <div className="col-12 col-md-6 col-xl-3">
            <motion.div
              className="mf-info-card"
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="mf-info-icon purple">
                <Trophy size={21} />
              </div>

              <div>
                <span>Series</span>
                <strong>{data?.series}</strong>
              </div>
            </motion.div>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <motion.div
              className="mf-info-card"
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="mf-info-icon blue">
                <Coins size={21} />
              </div>

              <div>
                <span>Toss</span>
                <strong>{getInfoValue(["Toss"])}</strong>
              </div>
            </motion.div>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <motion.div
              className="mf-info-card"
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="mf-info-icon green">
                <MapPin size={21} />
              </div>

              <div>
                <span>Venue</span>
                <strong>{data?.venue}</strong>
              </div>
            </motion.div>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <motion.div
              className="mf-info-card"
              custom={3}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="mf-info-icon orange">
                <Flag size={21} />
              </div>

              <div>
                <span>Match ID</span>
                <strong>{matchId}</strong>
              </div>
            </motion.div>
          </div>
        </div>

        {/* =========================================
            OFFICIALS
        ========================================= */}

        <motion.section
          className="mf-section"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mf-section-heading">
            <div className="mf-heading-icon">
              <Award size={21} />
            </div>

            <div>
              <span>OFFICIALS</span>
              <h2>Match Officials</h2>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="mf-official-card">
                <div className="mf-official-icon">
                  <UserRound size={22} />
                </div>

                <div>
                  <span>Umpires</span>
                  <strong>{getInfoValue(["Umpires"])}</strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="mf-official-card">
                <div className="mf-official-icon">
                  <CircleDot size={22} />
                </div>

                <div>
                  <span>3rd Umpire</span>
                  <strong>
                    {getInfoValue(["3rd Umpire", "Third Umpire"])}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="mf-official-card">
                <div className="mf-official-icon">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <span>Referee</span>
                  <strong>{getInfoValue(["Referee"])}</strong>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* =========================================
            SQUADS
        ========================================= */}

        <motion.section
          className="mf-section"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mf-section-heading">
            <div className="mf-heading-icon">
              <Users size={21} />
            </div>

            <div>
              <span>TEAM INFORMATION</span>
              <h2>Match Squads</h2>
            </div>
          </div>

          <div className="mf-squads-wrapper">
            {squads.length === 0 ? (
              <div className="mf-empty-card">
                <Users size={38} />
                <h4>Squad Information Unavailable</h4>
                <p>No squad information is available for this match.</p>
              </div>
            ) : (
              squads.map((team, teamIndex) => {
                const players = team?.players || [];

                const bench = team?.bench || [];

                const staff = team?.supportStaff || [];

                const isOpen = openTeams[teamIndex];

                return (
                  <motion.div
                    className="mf-team-card"
                    key={`${team?.teamName}-${teamIndex}`}
                    custom={teamIndex}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.08 }}
                  >
                    {/* Team Header */}

                    <button
                      className="mf-team-header"
                      onClick={() => toggleTeam(teamIndex)}
                    >
                      <div className="mf-team-title">
                        <div className="mf-team-logo">
                          <ShieldCheck size={25} />
                        </div>

                        <div>
                          <span>TEAM {teamIndex + 1}</span>
                          <h3>{team?.teamName || "Team"}</h3>
                        </div>
                      </div>

                      <div className="mf-team-counts">
                        <span>
                          <Users size={15} />
                          {team?.playerCount ?? players.length} Players
                        </span>

                        {bench.length > 0 && (
                          <span>
                            <UserRound size={15} />
                            {team?.benchCount ?? bench.length} Bench
                          </span>
                        )}

                        {staff.length > 0 && (
                          <span>
                            <UserCog size={15} />
                            {team?.staffCount ?? staff.length} Staff
                          </span>
                        )}

                        <div className="mf-collapse-btn">
                          {isOpen ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          className="mf-team-content"
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
                        >
                          {/* Players */}

                          {players.length > 0 && (
                            <div className="mf-sub-section">
                              <div className="mf-sub-heading">
                                <div className="mf-sub-icon batter">
                                  <UserRound size={17} />
                                </div>

                                <div>
                                  <h4>Players</h4>
                                  <span>
                                    {players.length} squad members
                                  </span>
                                </div>
                              </div>

                              <div className="row g-3">
                                {players.map((player, index) => (
                                  <div
                                    className="col-12 col-sm-6 col-lg-4 col-xl-3"
                                    key={`player-${player?.id}-${index}`}
                                  >
                                    <motion.div
                                      className="mf-person-card"
                                      custom={index}
                                      variants={playerVariants}
                                      initial="hidden"
                                      animate="visible"
                                      whileHover={{
                                        y: -5,
                                        transition: {
                                          duration: 0.2,
                                        },
                                      }}
                                    >
                                      <div className="mf-person-avatar">
                                        <img
  src={player?.imageUrl}
  alt={player?.name || "Player"}
  onError={(e) => {
    e.currentTarget.style.display = "none";
    e.currentTarget.nextSibling.style.display = "flex";
  }}
/>

                                        <div
                                          className="mf-avatar-fallback"
                                         
                                        >
                                          {getInitials(player?.name)}
                                        </div>
                                      </div>

                                      <div className="mf-person-info">
                                        <h5>{player?.name || "Unknown"}</h5>

                                        {player?.role && (
                                          <span>{player.role}</span>
                                        )}
                                      </div>
                                    </motion.div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Bench */}

                          {bench.length > 0 && (
                            <div className="mf-sub-section">
                              <div className="mf-sub-heading">
                                <div className="mf-sub-icon bench">
                                  <Users size={17} />
                                </div>

                                <div>
                                  <h4>Bench</h4>
                                  <span>
                                    {bench.length} bench members
                                  </span>
                                </div>
                              </div>

                              <div className="row g-3">
                                {bench.map((player, index) => (
                                  <div
                                    className="col-12 col-sm-6 col-lg-4 col-xl-3"
                                    key={`bench-${player?.id}-${index}`}
                                  >
                                    <motion.div
                                      className="mf-person-card bench-card"
                                      custom={index}
                                      variants={playerVariants}
                                      initial="hidden"
                                      whileInView="visible"
                                      viewport={{
                                        once: true,
                                        amount: 0.1,
                                      }}
                                      whileHover={{
                                        y: -5,
                                      }}
                                    >
                                      <div className="mf-person-avatar">
                                       <img
  src={player?.imageUrl}
  alt={player?.name || "Player"}
  onError={(e) => {
    e.currentTarget.style.display = "none";
    e.currentTarget.nextSibling.style.display = "flex";
  }}
/>

                                        <div
                                          className="mf-avatar-fallback"
                                          
                                        >
                                          {getInitials(player?.name)}
                                        </div>
                                      </div>

                                      <div className="mf-person-info">
                                        <h5>{player?.name || "Unknown"}</h5>

                                        {player?.role && (
                                          <span>{player.role}</span>
                                        )}
                                      </div>
                                    </motion.div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Support Staff */}

                          {staff.length > 0 && (
                            <div className="mf-sub-section">
                              <div className="mf-sub-heading">
                                <div className="mf-sub-icon staff">
                                  <UserCog size={17} />
                                </div>

                                <div>
                                  <h4>Support Staff</h4>
                                  <span>
                                    {staff.length} staff members
                                  </span>
                                </div>
                              </div>

                              <div className="row g-3">
                                {staff.map((member, index) => (
                                  <div
                                    className="col-12 col-sm-6 col-lg-4 col-xl-3"
                                    key={`staff-${member?.id}-${index}`}
                                  >
                                    <motion.div
                                      className="mf-person-card staff-card"
                                      custom={index}
                                      variants={playerVariants}
                                      initial="hidden"
                                      whileInView="visible"
                                      viewport={{
                                        once: true,
                                        amount: 0.1,
                                      }}
                                      whileHover={{
                                        y: -5,
                                      }}
                                    >
                                      <div className="mf-person-avatar staff-avatar">
                                        <img
  src={member?.imageUrl}
  alt={member?.name || "Player"}
  onError={(e) => {
    e.currentTarget.style.display = "none";
    e.currentTarget.nextSibling.style.display = "flex";
  }}
/>

                                        <div
                                          className="mf-avatar-fallback"
                                         
                                        >
                                          {getInitials(member?.name)}
                                        </div>
                                      </div>

                                      <div className="mf-person-info">
                                        <h5>{member?.name || "Unknown"}</h5>

                                        {member?.role && (
                                          <span>{member.role}</span>
                                        )}
                                      </div>
                                    </motion.div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {players.length === 0 &&
                            bench.length === 0 &&
                            staff.length === 0 && (
                              <div className="mf-no-team-data">
                                <Users size={30} />
                                <span>
                                  Team squad information is not available.
                                </span>
                              </div>
                            )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.section>

        {/* =========================================
            VENUE + BROADCAST
        ========================================= */}

        <div className="row g-4">
          {/* Venue Guide */}

          {Object.keys(venueGuide).length > 0 && (
            <div className="col-12 col-xl-6">
              <motion.section
                className="mf-guide-card"
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="mf-guide-heading">
                  <div className="mf-guide-icon venuee">
                    <Building2 size={22} />
                  </div>

                  <div>
                    <span>VENUE GUIDE</span>
                    <h3>Ground Information</h3>
                  </div>
                </div>

                <div className="mf-guide-list">
                  {Object.entries(venueGuide).map(([key, value], index) => (
                    <motion.div
                      className="mf-guide-row"
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.05,
                      }}
                    >
                      <span>{formatKey(key)}</span>
                      <strong>{value || "-"}</strong>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </div>
          )}

          {/* Broadcast Guide */}

          {Object.keys(broadcastGuide).length > 0 && (
            <div className="col-12 col-xl-6">
              <motion.section
                className="mf-guide-card"
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="mf-guide-heading">
                  <div className="mf-guide-icon broadcast">
                    <Radio size={22} />
                  </div>

                  <div>
                    <span>BROADCAST GUIDE</span>
                    <h3>Where To Watch</h3>
                  </div>
                </div>

                <div className="mf-guide-list">
                  {Object.entries(broadcastGuide).map(
                    ([key, value], index) => (
                      <motion.div
                        className="mf-guide-row"
                        key={key}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.05,
                        }}
                      >
                        <span>
                          <Tv size={16} />
                          {formatKey(key)}
                        </span>

                        <strong>{value || "-"}</strong>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.section>
            </div>
          )}
        </div>

        {/* =========================================
            FOOTER
        ========================================= */}

        <motion.div
          className="mf-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span>
            <CircleDot size={14} />
            Match ID: {matchId}
          </span>

          <span>Match Facts</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MatchFacts;