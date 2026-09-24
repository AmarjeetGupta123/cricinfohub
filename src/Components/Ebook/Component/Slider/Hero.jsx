import React, { useEffect, useState } from "react";
import "./Hero.css";

import heroBg1 from "../../../../../public/Ebook/slideback1.png";
import heroBg2 from "../../../../../public/Ebook/slideback2.png";
import heroBg3 from "../../../../../public/Ebook/slideback3.png";

import book1 from "../../../../../public/Ebook/slideleft1.png";
import book2 from "../../../../../public/Ebook/slideleft2.png";
import book3 from "../../../../../public/Ebook/slideleft3.png";

const SLIDE_DURATION = 6000;

const slides = [
  {
    id: 1,

    badge: "एक आध्यात्मिक प्रश्नोत्तरी संग्रह",

    title: (
      <>
        क्या आपके मन में भी
        <br />
        <span>भक्ति से जुड़े ऐसे प्रश्न हैं</span>
        <br />
        जिनका उत्तर आप खोज रहे हैं?
      </>
    ),

    description:
      "नाम-जप, गुरु, कर्म, प्रारब्ध, भक्ति और शरणागति जैसे विषयों को सरल प्रश्न–उत्तर के माध्यम से समझें और अपने जीवन को एक नई दृष्टि दें।",

    buttonText: "Ebook अभी देखें",

    bg: heroBg1,
    book: book1,

    features: [
      "Instant Digital Access",
      "हिंदी Ebook",
      "Mobile Friendly",
      "Secure Payment",
    ],

    bottomText: "700+ आध्यात्मिक प्रश्न",
  },

  {
    id: 2,

    badge: "700+ आध्यात्मिक प्रश्नों का विशेष संग्रह",

    title: (
      <>
        700+ आध्यात्मिक प्रश्नों के
        <br />
        <span>सरल और विस्तृत उत्तर</span>
      </>
    ),

    description:
      "जटिल आध्यात्मिक विषयों को आसान भाषा में समझने के लिए एक व्यवस्थित और जीवनोपयोगी प्रश्न–उत्तर संग्रह।",

    buttonText: "Ebook के अंदर देखें",

    bg: heroBg2,
    book: book2,

    features: [
      "700+ प्रश्न–उत्तर",
      "सरल हिंदी भाषा",
      "व्यावहारिक मार्गदर्शन",
      "साधना में उपयोगी",
    ],

    bottomText: "ज्ञान • भक्ति • शरणागति • जीवन-दृष्टि",
  },

  {
    id: 3,

    badge: "एक पुस्तक — जीवन की नई दृष्टि",

    title: (
      <>
        केवल पढ़िए नहीं...
        <br />
        <span>अपने जीवन को समझने की</span>
        <br />
        एक नई दृष्टि पाइए।
      </>
    ),

    description:
      "गृहस्थ जीवन, साधना, मन के विकार, गुरु-कृपा और भगवान की शरण से जुड़े महत्वपूर्ण प्रश्नों के उत्तर, जो भीतर से सोचने की दिशा दे सकते हैं।",

    buttonText: "अपनी यात्रा शुरू करें",

    bg: heroBg3,
    book: book3,

    features: [
      "गृहस्थ जीवन में भक्ति",
      "मन के विकारों से मुक्ति",
      "गुरु और शरणागति",
      "प्रेम-भक्ति की गहराई",
    ],

    bottomText: "सही प्रश्न • सही मार्ग • एक बेहतर जीवन",
  },
];

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = slides.length;

  /*
   * Automatic slider
   */
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveSlide((current) => {
        return (current + 1) % totalSlides;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  /*
   * Dot click
   */
  const handleSlideChange = (index) => {
    setActiveSlide(index);

    // Restart progress animation
    setIsPaused(true);

    requestAnimationFrame(() => {
      setIsPaused(false);
    });
  };

  const currentSlide = slides[activeSlide];

  return (
    <section
      id="home"
      className="ebook-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =========================================
          BACKGROUND SLIDES
      ========================================= */}

      <div className="hero-backgrounds">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-background ${
              activeSlide === index ? "hero-background-active" : ""
            }`}
            style={{
              backgroundImage: `url(${slide.bg})`,
            }}
          />
        ))}
      </div>

      {/* Background overlay */}
      <div className="hero-overlay" />

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="hero-inner">

        {/* LEFT CONTENT */}
        <div className="hero-content">

          {/* Badge */}
          <div
            key={`badge-${activeSlide}`}
            className="hero-badge hero-animate"
          >
            <span className="hero-badge-dot" />

            {currentSlide.badge}
          </div>

          {/* Heading */}
          <h1
            key={`title-${activeSlide}`}
            className="hero-title hero-animate"
          >
            {currentSlide.title}
          </h1>

          {/* Description */}
          <p
            key={`description-${activeSlide}`}
            className="hero-description hero-animate hero-delay-1"
          >
            {currentSlide.description}
          </p>

          {/* Features */}
          <div
            key={`features-${activeSlide}`}
            className="hero-features hero-animate hero-delay-2"
          >
            {currentSlide.features.map((feature, index) => (
              <div
                className="hero-feature"
                key={`${currentSlide.id}-${index}`}
              >
                <span className="hero-feature-icon">
                  {index === 0 && "↓"}
                  {index === 1 && "अ"}
                  {index === 2 && "▣"}
                  {index === 3 && "✓"}
                </span>

                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            key={`cta-${activeSlide}`}
            className="hero-cta-wrapper hero-animate hero-delay-3"
          >
            <a href="#pricing" className="hero-cta">
              <span className="hero-cta-book">▣</span>

              <span>{currentSlide.buttonText}</span>

              <span className="hero-cta-arrow">
                →
              </span>
            </a>
          </div>

        </div>


        {/* RIGHT BOOK */}
        <div
          key={`book-${activeSlide}`}
          className="hero-book-area hero-animate-book"
        >
          <div className="hero-book-glow" />

          <img
            src={currentSlide.book}
            alt="सत्संग प्रश्नोत्तरी Ebook"
            className="hero-book"
          />
        </div>

      </div>


      {/* =========================================
          BOTTOM AREA
      ========================================= */}

      <div className="hero-bottom">

        {/* Bottom text */}
        <div
          key={`bottom-${activeSlide}`}
          className="hero-bottom-text"
        >
          {currentSlide.bottomText}
        </div>


        {/* =====================================
            GLASS SLIDER
        ===================================== */}

        <div
          className="hero-slider"
          role="tablist"
          aria-label="Ebook slides"
        >
         {slides.map((slide, index) => (
  <button
    key={slide.id}
    type="button"
    role="tab"
    aria-selected={activeSlide === index}
    aria-label={`Slide ${index + 1}`}
    className={`hero-slider-dot ${
      activeSlide === index
        ? "hero-slider-dot-active"
        : ""
    }`}
    onClick={() => handleSlideChange(index)}
  >
    <span className="hero-slider-circle" />

    {activeSlide === index && (
      <span
        key={`progress-${activeSlide}`}
        className="hero-slider-progress"
        style={{
          animationDuration: `${SLIDE_DURATION}ms`,
          animationPlayState: isPaused
            ? "paused"
            : "running",
        }}
      />
    )}
  </button>
))}
        </div>

      </div>
    </section>
  );
};

export default Hero;