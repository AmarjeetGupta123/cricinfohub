import React from "react";
import { motion } from "framer-motion";
import "./Question.css";

const questions = [
  {
    icon: "🪷",
    title: "नाम-जप और साधना",
    line1: "नाम-जप का सही तरीका क्या है?",
    line2: "साधना में स्थिरता कैसे आए?",
  },
  {
    icon: "🙏",
    title: "गुरु और गुरु-कृपा",
    line1: "सच्चे गुरु की पहचान कैसे करें?",
    line2: "गुरु-कृपा प्राप्त कैसे होती है?",
  },
  {
    icon: "⚖️",
    title: "कर्म और प्रारब्ध",
    line1: "कर्मों का फल कैसे मिलता है?",
    line2: "क्या प्रारब्ध बदला जा सकता है?",
  },
  {
    icon: "🧘",
    title: "मन और विकार",
    line1: "मन को शांत कैसे करें?",
    line2: "वासना, क्रोध, लोभ जैसे विकारों से मुक्ति कैसे मिले?",
  },
  {
    icon: "❤️",
    title: "प्रेम-भक्ति",
    line1: "सच्ची भक्ति क्या है?",
    line2: "भगवान से प्रेम कैसे किया जाए?",
  },
  {
    icon: "🏡",
    title: "गृहस्थ जीवन में भक्ति",
    line1: "गृहस्थ जीवन में भी भक्ति कैसे करें?",
    line2: "परिवार, जिम्मेदारियों और साधना में संतुलन कैसे बने?",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Question = () => {
  return (
    <section
      id="questions"
      className="ebook-questions-section"
    >
      <div className="ebook-questions-container">

        {/* ================================
            SECTION HEADING
        ================================= */}

        <motion.div
          className="questions-heading"
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
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          {/* Badge */}
          <div className="questions-badge">
            <span className="questions-badge-icon">
              🪷
            </span>

            <span>
              क्या आप भी यही सोचते हैं?
            </span>
          </div>


          {/* Heading */}
          <h2 className="questions-title">
            क्या आपके मन में भी{" "}
            <span>ऐसे प्रश्न आते हैं?</span>
          </h2>


          {/* Decorative line */}
          <div className="questions-title-decoration">

            <span className="decoration-line" />

            <span className="decoration-leaf">
              ❧
            </span>

            <span className="decoration-line" />

          </div>


          {/* Description */}
          <p className="questions-description">
            भक्ति की राह में, जीवन के विभिन्न चरणों में,
            मन में अनेक प्रश्न उठते हैं।
            <br className="desktop-break" />
            यह Ebook उन्हीं महत्वपूर्ण प्रश्नों को सरल और
            स्पष्ट उत्तरों के रूप में समझने का एक प्रयास है।
          </p>

        </motion.div>


        {/* ================================
            QUESTION CARDS
        ================================= */}

        <motion.div
          className="questions-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
        >

          {questions.map((item, index) => (

            <motion.div
              className="question-card"
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.25,
                },
              }}
            >

              {/* Icon */}
              <div className="question-icon-wrapper">

                <div className="question-icon">
                  {item.icon}
                </div>

              </div>


              {/* Content */}
              <div className="question-card-content">

                <h3>
                  {item.title}
                </h3>

                <div className="question-card-line" />

                <p>
                  {item.line1}
                  <br />
                  {item.line2}
                </p>

              </div>


              {/* Arrow */}
              <motion.div
                className="question-card-arrow"
                whileHover={{
                  x: 4,
                }}
              >
                →
              </motion.div>

            </motion.div>

          ))}

        </motion.div>


        {/* ================================
            BOTTOM MESSAGE
        ================================= */}

        <motion.div
          className="questions-bottom"
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
            duration: 0.65,
            delay: 0.15,
          }}
        >

          <div className="questions-bottom-decoration">
            <span className="bottom-line" />

            <span className="bottom-leaf">
              ❧
            </span>

            <div className="questions-bottom-pill">
              <span>🍃</span>

              <strong>
                और भी बहुत से जीवनोपयोगी प्रश्नों के उत्तर...
              </strong>

              <span>🍃</span>
            </div>

            <span className="bottom-leaf">
              ❧
            </span>

            <span className="bottom-line" />
          </div>


          <p>
            यह केवल एक पुस्तक नहीं,
            बल्कि जीवन को समझने की एक नई दृष्टि है।
          </p>

        </motion.div>

      </div>
    </section>
  );
};

export default Question;