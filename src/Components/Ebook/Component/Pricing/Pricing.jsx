import React from "react";
import { motion } from "framer-motion";
import "./Pricing.css";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="ebook-pricing-section"
    >
      <div className="ebook-pricing-container">

        {/* =========================================
            HEADING
        ========================================== */}

        <motion.div
          className="pricing-heading"
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
          <div className="pricing-badge">
            <span>🪷</span>
            <span>आपकी आध्यात्मिक यात्रा के लिए</span>
          </div>

          <h2>
            ज्ञान को अपने जीवन का
            <span>हिस्सा बनाइए</span>
          </h2>

          <div className="pricing-decoration">
            <span />
            <b>❧</b>
            <span />
          </div>

          <p>
            700+ आध्यात्मिक प्रश्नों और उनके सरल उत्तरों को
            एक ही Ebook में पढ़ें और अपने प्रश्नों को समझने की दिशा में आगे बढ़ें।
          </p>
        </motion.div>


        {/* =========================================
            PRICING CARD
        ========================================== */}

        <motion.div
          className="pricing-card-wrapper"
          initial={{
            opacity: 0,
            y: 35,
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
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          <div className="pricing-card">

            {/* Decorative glow */}
            <div className="pricing-card-glow" />


            {/* =====================================
                LEFT SIDE
            ====================================== */}

            <div className="pricing-left">

              <div className="pricing-small-label">
                DIGITAL EBOOK
              </div>

              <h3>
                भक्ति और जीवन
              </h3>

              <p className="pricing-subtitle">
                700+ महत्वपूर्ण प्रश्नों के
                सरल और विस्तृत उत्तर
              </p>


              {/* Price */}

              <div className="price-area">

                <span className="price-old">
                  ₹499
                </span>

                <div className="price-main">
                  <span className="price-symbol">
                    ₹
                  </span>

                  <strong>
                    199
                  </strong>
                </div>

                <span className="price-note">
                  एक बार का भुगतान
                </span>

              </div>


              {/* CTA */}

              <motion.button
                type="button"
                className="pricing-button"
                whileHover={{
                  y: -3,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <span>
                  Ebook अभी प्राप्त करें
                </span>

                <span className="pricing-button-arrow">
                  →
                </span>
              </motion.button>


              <div className="pricing-secure">
                <span>🔒</span>
                सुरक्षित भुगतान • डिजिटल डिलीवरी
              </div>

            </div>


            {/* =====================================
                DIVIDER
            ====================================== */}

            <div className="pricing-divider">
              <span />
            </div>


            {/* =====================================
                RIGHT SIDE
            ====================================== */}

            <div className="pricing-right">

              <div className="included-title">
                Ebook में आपको मिलेगा
              </div>


              <div className="pricing-list">

                <div className="pricing-list-item">
                  <span className="pricing-check">
                    ✓
                  </span>

                  <div>
                    <strong>
                      700+ प्रश्न–उत्तर
                    </strong>

                    <p>
                      विभिन्न आध्यात्मिक विषयों पर विस्तृत सामग्री
                    </p>
                  </div>
                </div>


                <div className="pricing-list-item">
                  <span className="pricing-check">
                    ✓
                  </span>

                  <div>
                    <strong>
                      सरल हिंदी भाषा
                    </strong>

                    <p>
                      जटिल विषयों को आसान तरीके से समझने का प्रयास
                    </p>
                  </div>
                </div>


                <div className="pricing-list-item">
                  <span className="pricing-check">
                    ✓
                  </span>

                  <div>
                    <strong>
                      मोबाइल Friendly
                    </strong>

                    <p>
                      फोन, टैबलेट या कंप्यूटर पर पढ़ें
                    </p>
                  </div>
                </div>


                <div className="pricing-list-item">
                  <span className="pricing-check">
                    ✓
                  </span>

                  <div>
                    <strong>
                      तुरंत Digital Access
                    </strong>

                    <p>
                      खरीदारी के बाद Ebook तक डिजिटल पहुँच
                    </p>
                  </div>
                </div>


                <div className="pricing-list-item">
                  <span className="pricing-check">
                    ✓
                  </span>

                  <div>
                    <strong>
                      जीवनोपयोगी विषय
                    </strong>

                    <p>
                      भक्ति, कर्म, मन, गुरु, साधना और गृहस्थ जीवन
                    </p>
                  </div>
                </div>

              </div>


              {/* Mini note */}

              <div className="pricing-note">
                <span>✦</span>

                <p>
                  अपने प्रश्नों को समझने और
                  साधना की दिशा में आगे बढ़ने के लिए।
                </p>
              </div>

            </div>

          </div>


          {/* Bottom trust row */}

          <div className="pricing-trust-row">

            <div>
              <span>✓</span>
              डिजिटल Ebook
            </div>

            <div>
              <span>✓</span>
              हिंदी में
            </div>

            <div>
              <span>✓</span>
              मोबाइल पर पढ़ें
            </div>

            <div>
              <span>✓</span>
              Secure Payment
            </div>

          </div>

        </motion.div>


        {/* =========================================
            SMALL CLOSING TEXT
        ========================================== */}

        <motion.p
          className="pricing-bottom-text"
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
            delay: 0.15,
          }}
        >
          <span>🪷</span>
          एक प्रश्न से शुरुआत कीजिए — शायद कोई उत्तर
          आपकी सोच को एक नई दिशा दे।
          <span>🪷</span>
        </motion.p>

      </div>
    </section>
  );
};

export default Pricing;