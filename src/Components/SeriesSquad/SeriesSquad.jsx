import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./SeriesSquad.css";

export default function SeriesSquad() {
  const navigate = useNavigate();

  return (
    <div className="squad-maintenance">

      {/* BACKGROUND GLOW */}
      <div className="maintenance-glow glow-one" />
      <div className="maintenance-glow glow-two" />

      {/* STADIUM LIGHTS */}
      <div className="stadium-light light-left">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="stadium-light light-right">
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* TOP BADGE */}
      <motion.div
        className="maintenance-badge"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="badge-dot" />
        SERIES SQUAD
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="maintenance-content">

        {/* ILLUSTRATION */}
        <motion.div
          className="squad-illustration"
          initial={{
            opacity: 0,
            scale: 0.75,
            y: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >

          {/* FLOATING PARTICLES */}
          <motion.span
            className="particle particle-one"
            animate={{
              y: [-8, 8, -8],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <motion.span
            className="particle particle-two"
            animate={{
              y: [8, -8, 8],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />

          {/* SQUAD CARD */}
          <motion.div
            className="squad-card"
            animate={{
              y: [0, -7, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="card-clip" />

            <div className="squad-card-header">
              <span className="card-icon">👥</span>

              <div>
                <small>SERIES</small>
                <strong>SQUAD</strong>
              </div>
            </div>

            <div className="squad-lines">
              {[1, 2, 3, 4].map((item) => (
                <motion.div
                  className="squad-line"
                  key={item}
                  initial={{
                    opacity: 0,
                    x: -15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.5 + item * 0.12,
                  }}
                >
                  <span className="player-avatar">
                    <span />
                  </span>

                  <span className="line-content">
                    <i />
                    <b />
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="card-footer-line">
              <span />
              <span />
            </div>
          </motion.div>

          {/* GEAR */}
          <motion.div
            className="maintenance-gear"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            ⚙
          </motion.div>

          {/* HELMET */}
          <motion.div
            className="cricket-helmet"
            animate={{
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="helmet-shell" />
            <div className="helmet-grill">
              <span />
              <span />
              <span />
            </div>
          </motion.div>

          {/* BAT */}
          <motion.div
            className="cricket-bat"
            animate={{
              rotate: [-4, 4, -4],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="bat-handle" />
            <div className="bat-body" />
          </motion.div>

        </motion.div>

        {/* TEXT */}
        <motion.div
          className="maintenance-text"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            delay: 0.2,
          }}
        >

          <motion.span
            className="maintenance-label"
            animate={{
              opacity: [0.55, 1, 0.55],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
          >
            ● WORK IN PROGRESS
          </motion.span>

          <h1>
            <span>UNDER</span>
            <strong>MAINTENANCE</strong>
          </h1>

          <p>
            We're working hard to bring you the
            <br className="desktop-break" />
            Series Squad very soon.
          </p>

          <p className="patience-text">
            Thank you for your patience!
          </p>

          {/* BUTTON */}
          <motion.button
            type="button"
            className="back-home-btn"
            onClick={() => navigate("/")}
            whileHover={{
              y: -3,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.96,
            }}
          >
            <span className="arrow">←</span>

            <span>
              Back to Home
            </span>

            <span className="button-glow" />
          </motion.button>

        </motion.div>

      </div>

      {/* BOTTOM DECORATION */}
      <motion.div
        className="bottom-cricket-line"
        initial={{
          scaleX: 0,
          opacity: 0,
        }}
        animate={{
          scaleX: 1,
          opacity: 1,
        }}
        transition={{
          duration: 1,
          delay: 0.7,
        }}
      />

      <div className="bottom-text">
        CRICKET NEVER STOPS
      </div>

    </div>
  );
}