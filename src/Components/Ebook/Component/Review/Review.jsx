import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Review.css";

const reviews = [
  {
    id: 1,
    name: "नीशा शर्मा",
    city: "दिल्ली",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 5,
    text:
      "बहुत ही सरल भाषा में गहरी बातें समझाई गई हैं। यह Ebook मेरे लिए सच में बहुत उपयोगी है। रोज थोड़ा पढ़ती हूँ और मन को शांति मिलती है।",
  },
  {
    id: 2,
    name: "राहुल वर्मा",
    city: "बेंगलुरु",
    avatar: "https://i.pravatar.cc/120?img=12",
    rating: 5,
    text:
      "आध्यात्मिक विषयों पर इतने अच्छे प्रश्न और उत्तर एक ही जगह मिलना बहुत खास है। जो बातें पहले समझ नहीं आती थीं, अब उन्हें समझने में आसानी होती है।",
  },
  {
    id: 3,
    name: "पूजा मिश्रा",
    city: "लखनऊ",
    avatar: "https://i.pravatar.cc/120?img=44",
    rating: 5,
    featured: true,
    text:
      "इस Ebook ने मेरे विचारों को एक नई दिशा दी है। हर उत्तर ऐसा लगता है जैसे सीधे दिल से लिखा गया हो। जब भी मन में कोई प्रश्न आता है, मैं इसे फिर से पढ़ती हूँ।",
  },
  {
    id: 4,
    name: "अमित गोयल",
    city: "जयपुर",
    avatar: "https://i.pravatar.cc/120?img=11",
    rating: 5,
    text:
      "काम, परिवार और जीवन की जिम्मेदारियों के बीच यह Ebook मेरे लिए बहुत सहायक है। छोटे-छोटे प्रश्न, लेकिन उत्तर इतने गहरे कि मन सोचने पर मजबूर हो जाता है।",
  },
  {
    id: 5,
    name: "स्नेहा अग्रवाल",
    city: "मुंबई",
    avatar: "https://i.pravatar.cc/120?img=32",
    rating: 5,
    text:
      "भक्ति, मन, कर्म और गुरु — हर विषय पर सुंदर उत्तर हैं। ऐसा लगता है जैसे किसी ने मेरे मन के प्रश्नों को समझकर उनके उत्तर लिखे हों।",
  },
];

const AUTO_SLIDE_TIME = 5000;

const Reviews = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isPaused, setIsPaused] = useState(false);

  const totalReviews = reviews.length;

  const nextReview = () => {
    setActiveIndex((prev) =>
      prev === totalReviews - 1 ? 0 : prev + 1
    );
  };

  const previousReview = () => {
    setActiveIndex((prev) =>
      prev === 0 ? totalReviews - 1 : prev - 1
    );
  };

  const goToReview = (index) => {
    setActiveIndex(index);
  };

  /* =========================================
     AUTO SLIDE
  ========================================== */

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextReview();
    }, AUTO_SLIDE_TIME);

    return () => clearInterval(interval);
  }, [isPaused]);

  /* =========================================
     CARD POSITION
  ========================================== */

  const getRelativeIndex = (index) => {
    let diff = index - activeIndex;

    if (diff > 2) {
      diff -= totalReviews;
    }

    if (diff < -2) {
      diff += totalReviews;
    }

    return diff;
  };

  return (
    <section
      id="reviews"
      className="ebook-reviews-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="ebook-reviews-container">

        {/* =========================================
            HEADING
        ========================================== */}

        <motion.div
          className="reviews-heading"
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="reviews-badge">
            <span>🪷</span>
            <span>पाठकों की सच्ची प्रतिक्रियाएँ</span>
          </div>

          <h2>
            जिन्होंने पढ़ा,
            <span>उन्होंने महसूस किया</span>
          </h2>

          <div className="reviews-decoration">
            <span />
            <b>❧</b>
            <span />
          </div>

          <p>
            एक Ebook केवल पढ़ने के लिए नहीं होती —
            कभी-कभी उसके शब्द हमारे अपने प्रश्नों को आवाज़ दे देते हैं।
          </p>
        </motion.div>


        {/* =========================================
            REVIEW SLIDER
        ========================================== */}

        <div className="reviews-slider-wrapper">

          {/* LEFT ARROW */}

          <motion.button
            type="button"
            className="review-nav review-nav-left"
            onClick={previousReview}
            aria-label="Previous review"
            whileHover={{
              scale: 1.08,
            }}
            whileTap={{
              scale: 0.94,
            }}
          >
            ←
          </motion.button>


          {/* CARDS */}

          <div className="reviews-slider">

            {reviews.map((review, index) => {
              const position = getRelativeIndex(index);

              const isActive = position === 0;

              return (
                <motion.article
                  key={review.id}
                  className={`review-card ${
                    isActive
                      ? "review-card-active"
                      : ""
                  } ${
                    review.featured && isActive
                      ? "review-card-featured"
                      : ""
                  }`}
                  animate={{
                    x: position * 255,
                    scale: isActive ? 1 : 0.88,
                    opacity:
                      Math.abs(position) > 2
                        ? 0
                        : isActive
                        ? 1
                        : 0.72,
                    zIndex: isActive ? 5 : 2,
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() =>
                    !isActive &&
                    goToReview(index)
                  }
                >

                  {/* Quote mark */}

                  <div className="review-quote">
                    “
                  </div>


                  {/* Avatar */}

                  <div className="review-avatar-wrapper">

                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="review-avatar"
                    />

                  </div>


                  {/* Stars */}

                  <div className="review-stars">
                    {Array.from({
                      length: review.rating,
                    }).map((_, starIndex) => (
                      <span key={starIndex}>
                        ★
                      </span>
                    ))}
                  </div>


                  {/* Review */}

                  <p className="review-text">
                    “{review.text}”
                  </p>


                  {/* Divider */}

                  <div className="review-card-line" />


                  {/* Name */}

                  <div className="review-user">

                    <strong>
                      {review.name}
                    </strong>

                    <span>
                      {review.city}
                    </span>

                  </div>


                  {/* Featured label */}

                  {isActive && (
                    <motion.div
                      className="review-featured-label"
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                    >
                      <span>♛</span>
                      सबसे उपयोगी समीक्षा
                    </motion.div>
                  )}

                </motion.article>
              );
            })}

          </div>


          {/* RIGHT ARROW */}

          <motion.button
            type="button"
            className="review-nav review-nav-right"
            onClick={nextReview}
            aria-label="Next review"
            whileHover={{
              scale: 1.08,
            }}
            whileTap={{
              scale: 0.94,
            }}
          >
            →
          </motion.button>

        </div>


        {/* =========================================
            DOTS
        ========================================== */}

        <div className="reviews-dots">

          {reviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              aria-label={`Review ${index + 1}`}
              className={`reviews-dot ${
                activeIndex === index
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                goToReview(index)
              }
            >
              <span />
            </button>
          ))}

        </div>


        {/* =========================================
            TRUST STATS
        ========================================== */}

        <motion.div
          className="reviews-stats"
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            delay: 0.1,
          }}
        >

          <div className="review-stat">

            <div className="review-stat-icon">
              📖
            </div>

            <div>
              <strong>700+</strong>
              <span>प्रश्न–उत्तर</span>
            </div>

          </div>


          <div className="review-stat-divider" />


          <div className="review-stat">

            <div className="review-stat-icon">
              ⭐
            </div>

            <div>
              <strong>5.0</strong>
              <span>पाठक रेटिंग</span>
            </div>

          </div>


          <div className="review-stat-divider" />


          <div className="review-stat">

            <div className="review-stat-icon">
              💬
            </div>

            <div>
              <strong>सार्थक</strong>
              <span>प्रश्नों पर चर्चा</span>
            </div>

          </div>


          <div className="review-stat-divider" />


          <div className="review-stat">

            <div className="review-stat-icon">
              ❤️
            </div>

            <div>
              <strong>भक्ति</strong>
              <span>और आत्मचिंतन</span>
            </div>

          </div>

        </motion.div>


        {/* =========================================
            BOTTOM CTA
        ========================================== */}

        <motion.div
          className="reviews-bottom"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.65,
          }}
        >

          <div className="reviews-bottom-quote">
            <span className="reviews-big-quote">
              “
            </span>

            <p>
              यह Ebook केवल पढ़ने के लिए नहीं,
              <br />
              जीवन को समझने और जीने की एक यात्रा है।
            </p>

            <span className="reviews-big-quote">
              ”
            </span>
          </div>


          <motion.button
            type="button"
            className="reviews-cta"
            whileHover={{
              y: -3,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            <span>अब आप भी पढ़ें</span>
            <span>→</span>
          </motion.button>

        </motion.div>

      </div>
    </section>
  );
};

export default Reviews;