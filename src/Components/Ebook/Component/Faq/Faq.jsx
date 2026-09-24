import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FAQ.css";

const faqData = [
  {
    id: 1,
    question: "यह Ebook किसके लिए है?",
    answer:
      "यह Ebook उन सभी लोगों के लिए है जो जीवन, भक्ति, साधना, मन, कर्म, गुरु और गृहस्थ जीवन से जुड़े प्रश्नों को सरल और गहराई से समझना चाहते हैं। चाहे आप विद्यार्थी हों, गृहस्थ हों या आध्यात्मिक साधना के पथ पर हों — यह Ebook आपके लिए उपयोगी है।",
  },
  {
    id: 2,
    question: "यह Ebook मुझे किस रूप में मिलेगा? (PDF या Print?)",
    answer:
      "यह Ebook डिजिटल PDF के रूप में उपलब्ध होगी, जिसे आप अपने मोबाइल, टैबलेट या कंप्यूटर पर आसानी से पढ़ सकते हैं।",
  },
  {
    id: 3,
    question: "भुगतान के बाद Ebook कैसे मिलेगी?",
    answer:
      "भुगतान सफल होने के बाद Ebook प्राप्त करने के लिए आपको डिजिटल डाउनलोड या एक्सेस लिंक उपलब्ध कराया जाएगा।",
  },
  {
    id: 4,
    question: "क्या यह Ebook मोबाइल पर पढ़ सकते हैं?",
    answer:
      "हाँ। Ebook को मोबाइल, टैबलेट, लैपटॉप और कंप्यूटर जैसे उपकरणों पर पढ़ा जा सकता है।",
  },
  {
    id: 5,
    question: "क्या यह सामग्री कहीं और उपलब्ध है?",
    answer:
      "यह प्रश्नोत्तरी संग्रह विशेष रूप से Ebook के रूप में व्यवस्थित किया गया है ताकि सभी महत्वपूर्ण विषय एक ही स्थान पर सरल रूप में पढ़े जा सकें।",
  },
  {
    id: 6,
    question: "अगर मेरा कोई और प्रश्न है तो मैं किससे संपर्क कर सकता हूँ?",
    answer:
      "यदि आपके मन में कोई अन्य प्रश्न है, तो आप नीचे दिए गए संपर्क विकल्प के माध्यम से हमसे संपर्क कर सकते हैं।",
  },
];

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <section className="faq-section" id="faq">

      {/* Background decoration */}
      <div className="faq-decoration faq-decoration-left" />
      <div className="faq-decoration faq-decoration-right" />

      <div className="faq-container">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <motion.div
          className="faq-header"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="faq-badge">
            <span className="faq-badge-icon">✦</span>
            अक्सर पूछे जाने वाले प्रश्न
          </div>

          <h2>
            आपके मन के प्रश्न,
            <span> हमारे उत्तर</span>
          </h2>

          <div className="faq-title-line">
            <span />
            <b>✦</b>
            <span />
          </div>

          <p>
            यहाँ कुछ सामान्य प्रश्न दिए गए हैं जो हमारे पाठकों के मन में आते हैं।
            <br />
            यदि आपका प्रश्न यहाँ नहीं है, तो आप हमसे सीधे संपर्क कर सकते हैं।
          </p>
        </motion.div>


        {/* Quote */}
        <motion.div
          className="faq-top-quote"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span>“</span>
          <p>
            सही प्रश्न
            <br />
            सही दिशा दिखाते हैं
          </p>
          <span>”</span>
        </motion.div>


        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="faq-main-grid">

          {/* LEFT ACCORDION */}

          <motion.div
            className="faq-list"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
          >
            {faqData.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  className={`faq-item ${isOpen ? "faq-item-open" : ""}`}
                  key={faq.id}
                >

                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >

                    <span className="faq-number">
                      {String(faq.id).padStart(2, "0")}
                    </span>

                    <span className="faq-question-text">
                      {faq.question}
                    </span>

                    <span className="faq-toggle">
                      {isOpen ? "⌃" : "⌄"}
                    </span>

                  </button>


                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="faq-answer-wrapper"
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                      >
                        <div className="faq-answer">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </motion.div>


          {/* =====================================================
              RIGHT SIDE
          ===================================================== */}

          <motion.div
            className="faq-right-column"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >

            {/* IMAGE CARD */}

            <div className="faq-image-card">

              <div className="faq-image-overlay" />

              <div className="faq-image-quote">
                <span>“</span>

                <p>
                  प्रश्न करना जिज्ञासा है,
                  <br />
                  और उत्तर पाना कृपा है।
                </p>

                <span>”</span>

                <div className="faq-lotus-divider">
                  <span />
                  <b>✦</b>
                  <span />
                </div>
              </div>

            </div>


            {/* CONTACT CARD */}

            <div className="faq-contact-card">

              <div className="faq-contact-icon">
                <span>◉</span>
              </div>

              <h3>
                अब भी कोई प्रश्न है?
              </h3>

              <p>
                हम आपसे सुनना चाहते हैं
              </p>

              <button className="faq-contact-btn">
                <span className="faq-mail-icon">✉</span>
                हमसे संपर्क करें
                <span className="faq-arrow">→</span>
              </button>

              <small>
                हम आपके प्रश्न का यथासंभव शीघ्र उत्तर देने का प्रयास करेंगे।
              </small>

            </div>

          </motion.div>

        </div>


        {/* =====================================================
            BOTTOM CTA
        ===================================================== */}

        <motion.div
          className="faq-bottom-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >

          {/* BOOK IMAGE */}
          <div className="faq-books-image" />


          {/* CENTER CONTENT */}

          <div className="faq-cta-content">

            <h3>
              ज्ञान का यह संकलन
              <br />
              <span>आपके जीवन की यात्रा में सहायक हो सकता है।</span>
            </h3>

            <button className="faq-cta-button">
              <span>▢</span>
              अब अपना Ebook प्राप्त करें
              <b>→</b>
            </button>

          </div>


          {/* TRUST ITEMS */}

          <div className="faq-trust-list">

            <div className="faq-trust-item">
              <span className="faq-trust-icon">✓</span>

              <div>
                <strong>सुरक्षित भुगतान</strong>
              </div>
            </div>


            <div className="faq-trust-item">
              <span className="faq-trust-icon">ϟ</span>

              <div>
                <strong>तुरंत डिजिटल डिलीवरी</strong>
              </div>
            </div>


            <div className="faq-trust-item">
              <span className="faq-trust-icon">♥</span>

              <div>
                <strong>सार्थक और जीवनोपयोगी सामग्री</strong>
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default FAQ;