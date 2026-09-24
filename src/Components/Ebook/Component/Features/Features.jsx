import React from "react";
import { motion } from "framer-motion";
import "./Features.css";

const features = [
  {
    number: "01",
    icon: "🪷",
    title: "नाम-जप और साधना",
    text: "नाम-जप, साधना की स्थिरता और भक्ति के अभ्यास से जुड़े महत्वपूर्ण प्रश्नों को सरलता से समझें।",
  },
  {
    number: "02",
    icon: "🙏",
    title: "गुरु और गुरु-कृपा",
    text: "गुरु की भूमिका, गुरु-कृपा, शरणागति और सही मार्गदर्शन से जुड़े प्रश्नों पर गहराई से विचार।",
  },
  {
    number: "03",
    icon: "⚖️",
    title: "कर्म और प्रारब्ध",
    text: "संचित, प्रारब्ध और क्रियमाण कर्म को समझें और जानें कि कर्म जीवन को किस प्रकार प्रभावित करते हैं।",
  },
  {
    number: "04",
    icon: "🧘",
    title: "मन और उसके विकार",
    text: "मन की चंचलता, क्रोध, लोभ, वासना और अन्य विकारों को समझने की एक सरल दृष्टि।",
  },
  {
    number: "05",
    icon: "❤️",
    title: "प्रेम और भक्ति",
    text: "सच्ची भक्ति, भगवान के प्रति प्रेम और भक्ति के वास्तविक भाव को समझने वाले प्रश्न और उत्तर।",
  },
  {
    number: "06",
    icon: "🏡",
    title: "गृहस्थ जीवन में भक्ति",
    text: "परिवार और जिम्मेदारियों के बीच साधना, सेवा और भक्ति को जीवन का हिस्सा बनाने की समझ।",
  },
  {
    number: "07",
    icon: "🌿",
    title: "वैराग्य और शरणागति",
    text: "वैराग्य, आसक्ति, समर्पण और भगवान की शरण में जाने से जुड़े गहरे आध्यात्मिक प्रश्न।",
  },
  {
    number: "08",
    icon: "✨",
    title: "जीवन की नई दृष्टि",
    text: "आध्यात्मिक प्रश्नों को केवल पढ़ने के बजाय उन्हें अपने जीवन और अनुभवों से जोड़कर समझने का प्रयास।",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
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

const Features = () => {
  return (
    <section
      id="features"
      className="ebook-features-section"
    >
      <div className="ebook-features-container">

        {/* ================================
            HEADER
        ================================= */}

        <motion.div
          className="features-heading"
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
          <div className="features-badge">
            <span>✦</span>
            <span>EBOOK में क्या मिलेगा?</span>
          </div>

          <h2>
            एक Ebook,
            <span>कई पहलुओं की समझ</span>
          </h2>

          <div className="features-decoration">
            <span />
            <b>❧</b>
            <span />
          </div>

          <p>
            भक्ति और जीवन से जुड़े अलग-अलग विषयों पर
            700+ प्रश्नों और उनके सरल, विस्तृत उत्तरों का संग्रह।
          </p>
        </motion.div>


        {/* ================================
            FEATURE GRID
        ================================= */}

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
        >

          {features.map((feature) => (
            <motion.article
              key={feature.number}
              className="feature-card"
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.25,
                },
              }}
            >

              {/* Number */}

              <div className="feature-number">
                {feature.number}
              </div>


              {/* Icon */}

              <motion.div
                className="feature-icon"
                whileHover={{
                  rotate: 4,
                  scale: 1.05,
                }}
              >
                {feature.icon}
              </motion.div>


              {/* Content */}

              <div className="feature-content">

                <h3>
                  {feature.title}
                </h3>

                <div className="feature-line" />

                <p>
                  {feature.text}
                </p>

              </div>


              {/* Bottom arrow */}

              <div className="feature-arrow">
                ↗
              </div>

            </motion.article>
          ))}

        </motion.div>


        {/* ================================
            BOTTOM HIGHLIGHT
        ================================= */}

        <motion.div
          className="features-highlight"
          initial={{
            opacity: 0,
            scale: 0.97,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.65,
          }}
        >

          <div className="features-highlight-icon">
            🪷
          </div>

          <div className="features-highlight-content">
            <strong>
              केवल जानकारी नहीं — समझ और मनन
            </strong>

            <p>
              हर विषय को इस तरह प्रस्तुत किया गया है कि
              आप उसे अपने जीवन और साधना से जोड़कर समझ सकें।
            </p>
          </div>

          <div className="features-highlight-count">
            <strong>700+</strong>
            <span>प्रश्न–उत्तर</span>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default Features;