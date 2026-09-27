import React from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "./Pricing.css";

const API_BASE = "https://cricinfohub-api.onrender.com/api";

const Pricing = () => {
  const handleBuyNow = async () => {
    try {
      // =========================================================
      // STEP 1: CREATE RAZORPAY ORDER
      // =========================================================

      Swal.fire({
        title: "Please wait...",
        text: "Order create ho raha hai",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const orderResponse = await fetch(
        `${API_BASE}/Payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let orderData;

      try {
        orderData = await orderResponse.json();
      } catch {
        orderData = {
          success: false,
          message: "Server se invalid response mila.",
        };
      }

      if (!orderResponse.ok || !orderData.success) {
        Swal.fire({
          icon: "error",
          title: "Order create nahi hua",
          text:
            orderData?.message ||
            "Please thodi der baad try karein.",
          confirmButtonText: "OK",
        });

        return;
      }

      Swal.close();

      // =========================================================
      // STEP 2: CHECK RAZORPAY
      // =========================================================

      if (!window.Razorpay) {
        Swal.fire({
          icon: "error",
          title: "Payment system unavailable",
          text:
            "Razorpay Checkout load nahi hua. Page refresh karke dobara try karein.",
          confirmButtonText: "OK",
        });

        return;
      }

      // =========================================================
      // STEP 3: RAZORPAY OPTIONS
      // =========================================================

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,

        name: "भक्ति और जीवन",

        description:
          "भक्ति और जीवन - Digital eBook",

        order_id: orderData.orderId,

        // =======================================================
        // PAYMENT SUCCESS
        // =======================================================

        handler: async function (paymentResponse) {
          try {
            Swal.fire({
              title: "Payment verify ho raha hai...",
              text: "Please wait",
              allowOutsideClick: false,
              allowEscapeKey: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });

            // ===================================================
            // STEP 4: VERIFY PAYMENT
            // ===================================================

            const verifyResponse = await fetch(
              `${API_BASE}/Payment/verify-payment`,
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            );

            let verifyData;

            try {
              verifyData = await verifyResponse.json();
            } catch {
              verifyData = {
                success: false,
                message:
                  "Verification server se invalid response mila.",
              };
            }

            // ===================================================
            // PAYMENT VERIFIED
            // ===================================================

            if (
              verifyResponse.ok &&
              verifyData.success
            ) {
              Swal.fire({
                icon: "success",

                title: "Payment Successful! 🎉",

                html: `
                  <div style="font-size:15px; line-height:1.7;">
                    आपका payment successfully verify हो गया है।
                    <br />
                    <strong>
                      अब आपकी eBook तैयार है 📖
                    </strong>
                  </div>
                `,

                confirmButtonText:
                  "Download eBook 📥",

                confirmButtonColor:
                  "#198754",

                allowOutsideClick: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  // =================================================
                  // STEP 5: DOWNLOAD EBOOK
                  // =================================================

                  const downloadUrl =
                    `${API_BASE}/Ebook/download?token=${encodeURIComponent(
                      verifyData.downloadToken
                    )}`;

                  window.location.href =
                    downloadUrl;
                }
              });

              return;
            }

            // ===================================================
            // VERIFICATION FAILED
            // ===================================================

            Swal.fire({
              icon: "error",

              title:
                "Payment Verification Failed",

              text:
                verifyData?.message ||
                "Payment verify nahi ho paya.",

              confirmButtonText: "OK",
            });
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            Swal.fire({
              icon: "error",

              title:
                "Verification Error",

              text:
                "Payment ho gaya ho sakta hai, lekin verification complete nahi ho paya. Please support se contact karein.",

              confirmButtonText: "OK",
            });
          }
        },

        // =======================================================
        // PREFILL
        // =======================================================

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        // =======================================================
        // NOTES
        // =======================================================

        notes: {
          product:
            "Bhakti Aur Jeevan eBook",
        },

        // =======================================================
        // THEME
        // =======================================================

        theme: {
          color: "#9b2f1f",
        },
      };

      // =========================================================
      // STEP 6: CREATE RAZORPAY INSTANCE
      // =========================================================

      const razorpay =
        new window.Razorpay(options);

      // =========================================================
      // PAYMENT FAILED
      // =========================================================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response?.error
          );

          Swal.fire({
            icon: "error",

            title:
              "Payment Failed ❌",

            text:
              response?.error?.description ||
              "Payment complete nahi ho paya.",

            confirmButtonText:
              "Try Again",
          });
        }
      );

      // =========================================================
      // OPEN RAZORPAY CHECKOUT
      // =========================================================

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      Swal.close();

      Swal.fire({
        icon: "error",

        title:
          "Payment Start Nahi Hua",

        text:
          error?.message ||
          "Please internet connection check karke dobara try karein.",

        confirmButtonText: "OK",
      });
    }
  };

  return (
    <section
      id="pricing"
      className="ebook-pricing-section"
    >
      <div className="ebook-pricing-container">

        {/* =====================================================
            HEADING
        ====================================================== */}

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

            <span>
              आपकी आध्यात्मिक यात्रा के लिए
            </span>
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
            700+ आध्यात्मिक प्रश्नों और उनके सरल
            उत्तरों को एक ही Ebook में पढ़ें और
            अपने प्रश्नों को समझने की दिशा में
            आगे बढ़ें।
          </p>
        </motion.div>

        {/* =====================================================
            PRICING CARD
        ====================================================== */}

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

            <div className="pricing-card-glow" />

            {/* LEFT */}

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

              {/* PRICE */}

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

                onClick={handleBuyNow}

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

            {/* DIVIDER */}

            <div className="pricing-divider">
              <span />
            </div>

            {/* RIGHT */}

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
                      विभिन्न आध्यात्मिक विषयों पर
                      विस्तृत सामग्री
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
                      जटिल विषयों को आसान तरीके से
                      समझने का प्रयास
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
                      खरीदारी के बाद Ebook तक
                      डिजिटल पहुँच
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
                      भक्ति, कर्म, मन, गुरु, साधना
                      और गृहस्थ जीवन
                    </p>
                  </div>
                </div>

              </div>

              <div className="pricing-note">
                <span>✦</span>

                <p>
                  अपने प्रश्नों को समझने और
                  साधना की दिशा में आगे बढ़ने के लिए।
                </p>
              </div>

            </div>
          </div>

          {/* TRUST ROW */}

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

        {/* CLOSING TEXT */}

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

          एक प्रश्न से शुरुआत कीजिए — शायद कोई
          उत्तर आपकी सोच को एक नई दिशा दे।

          <span>🪷</span>
        </motion.p>

      </div>
    </section>
  );
};

export default Pricing;