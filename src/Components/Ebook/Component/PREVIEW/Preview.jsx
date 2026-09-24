import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Preview.css";

const previewPages = [
  {
    id: 1,
    image: "../../../../../public/Ebook/previewbook1.png",
    label: "प्रश्न 01",
    title: "नाम-जप और साधना",
  },
  {
    id: 2,
    image: "../../../../../public/Ebook/previewbook2.png",
    label: "प्रश्न 02",
    title: "गुरु और गुरु-कृपा",
  },
  {
    id: 3,
    image: "../../../../../public/Ebook/previewbook4.png",
    label: "प्रश्न 03",
    title: "कर्म और प्रारब्ध",
  },
];

const Preview = () => {
  const [activePage, setActivePage] = useState(0);

  const currentPage = previewPages[activePage];

  const nextPage = () => {
    setActivePage((prev) =>
      prev === previewPages.length - 1 ? 0 : prev + 1
    );
  };

  const previousPage = () => {
    setActivePage((prev) =>
      prev === 0 ? previewPages.length - 1 : prev - 1
    );
  };

  return (
    <section
      id="preview"
      className="ebook-preview-section"
    >
      <div className="ebook-preview-container">

        {/* =========================================
            SECTION HEADER
        ========================================== */}

        <motion.div
          className="preview-section-heading"
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
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="preview-badge">
            <span>📖</span>
            <span>अंदर से एक झलक</span>
          </div>

          <h2>
            सिर्फ सुनिए नहीं...
            <span>एक नज़र अंदर भी देखिए</span>
          </h2>

          <p>
            इस Ebook के कुछ पन्नों की एक छोटी सी झलक।
            <br />
            सरल भाषा, गहरे प्रश्न और जीवन से जुड़ी स्पष्ट समझ।
          </p>
        </motion.div>


        {/* =========================================
            MAIN PREVIEW
        ========================================== */}

        <div className="preview-main">

          {/* =====================================
              LEFT — BOOK PREVIEW
          ====================================== */}

          <motion.div
            className="preview-book-area"
            initial={{
              opacity: 0,
              x: -45,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            {/* Decorative glow */}
            <div className="preview-glow" />

            {/* Book shadow */}
            <div className="preview-book-shadow" />


            {/* Back pages */}
            <div className="preview-book-back back-one" />
            <div className="preview-book-back back-two" />


            {/* Main book */}
            <div className="preview-book">

              <AnimatePresence mode="wait">

                <motion.img
                  key={currentPage.id}
                  src={currentPage.image}
                  alt={currentPage.title}
                  className="preview-book-image"
                  initial={{
                    opacity: 0,
                    rotateY: 8,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    rotateY: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotateY: -8,
                    scale: 0.97,
                  }}
                  transition={{
                    duration: 0.45,
                  }}
                />

              </AnimatePresence>

            </div>


            {/* Floating label */}
            <motion.div
              className="preview-floating-label"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="floating-label-icon">
                ✦
              </span>

              <div>
                <strong>700+</strong>
                <small>प्रश्न–उत्तर</small>
              </div>
            </motion.div>


            {/* Bottom book info */}
            <div className="preview-book-info">
              <span>{currentPage.label}</span>

              <strong>
                {currentPage.title}
              </strong>
            </div>

          </motion.div>


          {/* =====================================
              RIGHT — CONTENT
          ====================================== */}

          <motion.div
            className="preview-content"
            initial={{
              opacity: 0,
              x: 45,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            <span className="preview-small-label">
              EBOOK PREVIEW
            </span>

            <h3>
              हर प्रश्न के पीछे
              <br />
              <span>एक गहरी समझ।</span>
            </h3>

            <p className="preview-intro">
              Ebook को इस तरह तैयार किया गया है कि
              आध्यात्मिक विषय केवल पढ़ने तक सीमित न रहें,
              बल्कि उन्हें अपने जीवन और साधना से जोड़कर
              समझा जा सके।
            </p>


            {/* Feature list */}

            <div className="preview-points">

              <div className="preview-point">
                <div className="preview-point-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    सरल और सहज भाषा
                  </strong>

                  <p>
                    कठिन आध्यात्मिक विषयों को
                    आसान तरीके से समझाया गया है।
                  </p>
                </div>
              </div>


              <div className="preview-point">
                <div className="preview-point-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    प्रश्न से उत्तर तक
                  </strong>

                  <p>
                    वास्तविक जीवन में उठने वाले
                    महत्वपूर्ण प्रश्नों पर केंद्रित।
                  </p>
                </div>
              </div>


              <div className="preview-point">
                <div className="preview-point-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    पढ़ने के साथ मनन
                  </strong>

                  <p>
                    उत्तर केवल जानकारी नहीं,
                    बल्कि आत्मचिंतन की दिशा देते हैं।
                  </p>
                </div>
              </div>

            </div>


            {/* CTA */}

            <motion.button
              type="button"
              className="preview-cta"
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span>
                Ebook के अंदर देखें
              </span>

              <span className="preview-cta-arrow">
                →
              </span>
            </motion.button>

          </motion.div>

        </div>


        {/* =========================================
            PAGE SELECTOR
        ========================================== */}

        <motion.div
          className="preview-page-selector"
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
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
        >

          <button
            type="button"
            className="preview-nav-btn"
            onClick={previousPage}
            aria-label="Previous preview"
          >
            ←
          </button>


          <div className="preview-thumbnails">

            {previewPages.map((page, index) => (

              <button
                key={page.id}
                type="button"
                className={`preview-thumbnail ${
                  activePage === index
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActivePage(index)
                }
              >
                <img
                  src={page.image}
                  alt={page.title}
                />

                <span>
                  {index + 1}
                </span>
              </button>

            ))}

          </div>


          <button
            type="button"
            className="preview-nav-btn"
            onClick={nextPage}
            aria-label="Next preview"
          >
            →
          </button>

        </motion.div>


        {/* =========================================
            BOTTOM NOTE
        ========================================== */}

        <motion.div
          className="preview-bottom-note"
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <span>✦</span>

          <p>
            यह केवल कुछ पन्नों की झलक है —
            पूरी Ebook में ऐसे ही <strong>700+ प्रश्नों</strong>
            के उत्तर आपका इंतज़ार कर रहे हैं।
          </p>

          <span>✦</span>
        </motion.div>

      </div>
    </section>
  );
};

export default Preview;