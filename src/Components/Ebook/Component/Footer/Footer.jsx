import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    console.log("Subscribed:", email);

    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const quickLinks = [
    "होम",
    "Ebook के बारे में",
    "मुख्य विषय",
    "पाठकों की प्रतिक्रियाएँ",
    "अक्सर पूछे जाने वाले प्रश्न",
    "संपर्क करें",
  ];

  const supportLinks = [
    "भुगतान जानकारी",
    "डिलीवरी प्रक्रिया",
    "रिफंड नीति",
    "गोपनीयता नीति",
    "नियम एवं शर्तें",
    "हमसे संपर्क करें",
  ];

  return (
    <footer className="ebook-footer">

      {/* =====================================================
          NEWSLETTER / TOP CTA
      ===================================================== */}

      <div className="footer-container">

        <motion.div
          className="footer-newsletter"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >

          {/* Lotus */}
          <div className="footer-newsletter-lotus">
            <div className="footer-lotus-icon">
              <span>✿</span>
            </div>
          </div>


          {/* Center */}
          <div className="footer-newsletter-content">

            <h2>
              ज्ञान की यह यात्रा यहीं नहीं रुकती...
            </h2>

            <p>
              आइए, जुड़े रहें और जीवन को सही दिशा देने वाले विचार
              <br className="footer-desktop-break" />
              निरंतर प्राप्त करते रहें।
            </p>

            <div className="footer-title-divider">
              <span />
              <b>✦</b>
              <span />
            </div>


            <form
              className="footer-subscribe-form"
              onSubmit={handleSubscribe}
            >
              <div className="footer-email-box">
                <span className="footer-email-icon">
                  <i className="bi bi-envelope-fill" />
                </span>

                <input
                  type="email"
                  placeholder="अपना ईमेल दर्ज करें"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit">
                जुड़े रहें
                <span>→</span>
              </button>
            </form>

            <small>
              हम आपको केवल सार्थक और प्रेरणादायी सामग्री ही भेजेंगे।
            </small>

          </div>


          {/* Quote */}
          <div className="footer-newsletter-quote">
            <span className="footer-quote-mark">“</span>

            <p>
              सत्साहित्य
              <br />
              सदा साथ देता है
            </p>

            <div className="footer-small-divider">
              <span />
              <b>✦</b>
              <span />
            </div>

            <span className="footer-quote-mark footer-quote-bottom">
              ”
            </span>
          </div>

        </motion.div>


        {/* =====================================================
            MAIN FOOTER
        ===================================================== */}

        <div className="footer-main">

          {/* =================================================
              BRAND
          ================================================= */}

          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >

            <div className="footer-brand-title">

              <div className="footer-brand-lotus">
                ✿
              </div>

              <div>
                <h3>भक्ति और जीवन</h3>

                <span>
                  प्रश्नों से समाधान की ओर
                </span>
              </div>

            </div>


            <p className="footer-brand-description">
              हमारा प्रयास है कि आध्यात्मिक ज्ञान, जीवन के
              व्यावहारिक प्रश्नों और सनातन विचारों को सरल भाषा
              में आपके तक पहुँचाया जाए, ताकि हर खोजी मन को
              सही दिशा मिल सके।
            </p>


            {/* Social */}
            <div className="footer-socials">

              <a href="#" aria-label="Facebook">
                <i className="bi bi-facebook" />
              </a>

              <a href="#" aria-label="YouTube">
                <i className="bi bi-youtube" />
              </a>

              <a href="#" aria-label="Instagram">
                <i className="bi bi-instagram" />
              </a>

              <a href="#" aria-label="X">
                <i className="bi bi-twitter-x" />
              </a>

            </div>


            <div className="footer-brand-tags">
              <span>ज्ञान</span>
              <b>|</b>
              <span>भक्ति</span>
              <b>|</b>
              <span>साधना</span>
              <b>|</b>
              <span>सुन्दर जीवन</span>
            </div>


            <div className="footer-column-divider footer-brand-divider">
              <span />
              <b>✦</b>
              <span />
            </div>

          </motion.div>


          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <motion.div
            className="footer-column"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >

            <h4>
              <span>❖</span>
              त्वरित लिंक
            </h4>

            <div className="footer-heading-line" />

            <ul>
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <a href="#">
                    <span className="footer-link-arrow">›</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>

          </motion.div>


          {/* =================================================
              SUPPORT
          ================================================= */}

          <motion.div
            className="footer-column"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
          >

            <h4>
              <span>❖</span>
              सहायता
            </h4>

            <div className="footer-heading-line" />

            <ul>
              {supportLinks.map((item, index) => (
                <li key={index}>
                  <a href="#">
                    <span className="footer-link-arrow">›</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>

          </motion.div>


          {/* =================================================
              CONTACT
          ================================================= */}

          <motion.div
            className="footer-contact-column"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.24 }}
          >

            <h4>
              <span>❖</span>
              संपर्क जानकारी
            </h4>

            <div className="footer-heading-line" />


            <div className="footer-contact-item">

              <span className="footer-contact-icon">
                <i className="bi bi-envelope-fill" />
              </span>

              <a href="mailto:support@bhaktiaurjeevan.in">
                support@bhaktiaurjeevan.in
              </a>

            </div>


            <div className="footer-contact-item">

              <span className="footer-contact-icon">
                <i className="bi bi-telephone-fill" />
              </span>

              <a href="tel:+919876543210">
                +91 98765 43210
              </a>

            </div>


            <div className="footer-contact-item">

              <span className="footer-contact-icon">
                <i className="bi bi-geo-alt-fill" />
              </span>

              <span>
                भारत
              </span>

            </div>


            <div className="footer-contact-item">

              <span className="footer-contact-icon">
                <i className="bi bi-clock-fill" />
              </span>

              <span>
                सोम - शनि : 9 AM - 6 PM
                <small>
                  (भारतीय समयानुसार)
                </small>
              </span>

            </div>

          </motion.div>


          {/* =================================================
              RIGHT QUOTE
          ================================================= */}

          <motion.div
            className="footer-side-quote"
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >

            <span className="footer-side-quote-mark">
              “
            </span>

            <p>
              सही प्रश्न,
              <br />
              सही सोच और सही संग
              <br />
              जीवन बदल सकते हैं।
            </p>

            <div className="footer-side-divider">
              <span />
              <b>✿</b>
              <span />
            </div>

            <div className="footer-side-bottom">
              एक बेहतर, शांत और सार्थक
              <br />
              जीवन की ओर...
            </div>

          </motion.div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM COPYRIGHT
      ===================================================== */}

      <div className="footer-bottom">

        <div className="footer-bottom-inner">

          <div className="footer-copyright">

            <span className="footer-bottom-lotus">
              ✿
            </span>

            <span>
              © 2025 भक्ति और जीवन. सर्वाधिकार सुरक्षित।
            </span>

          </div>


          <div className="footer-bottom-message">

            <span />
            <b>✦</b>

            <strong>
              ज्ञान बाँटिए, प्रकाश बढ़ाइए ।
            </strong>

            <b>✦</b>
            <span />

          </div>


          <div className="footer-made-with">
            Made with
            <span>♥</span>
            for seekers of truth
          </div>


          <button
            type="button"
            className="footer-top-button"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            ↑
          </button>

        </div>

      </div>

    </footer>
  );
};

export default Footer;