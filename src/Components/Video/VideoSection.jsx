import React, { useState } from "react";
import "./VideoSection.css";

function VideoSection() {
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <div className="video-section">
      <h2>भक्ति और जीवन</h2>

      <div className="video-container">

        {/* ==============================
            CUSTOM THUMBNAIL
        =============================== */}
        {!playVideo ? (
          <div
            className="video-thumbnail"
            onClick={() => setPlayVideo(true)}
          >
            <img
              src="/thumnail.png"
              alt="भक्ति और जीवन"
            />

            {/* Dark overlay */}
            <div className="thumbnail-overlay"></div>

            {/* Play Button */}
            <button className="custom-play-btn">
              ▶
            </button>
          </div>
        ) : (
          <>
            {/* ==============================
                YOUTUBE VIDEO
            =============================== */}

            <iframe
              src="https://www.youtube.com/embed/fDqIqDlq_6I?rel=0&modestbranding=1"
              title="भक्ति और जीवन"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>

            {/* ==============================
                TOP OVERLAY
            =============================== */}

            <div className="youtube-top-overlay"></div>

            {/* ==============================
                BOTTOM OVERLAY
            =============================== */}

            <div className="youtube-bottom-overlay"></div>
          </>
        )}

      </div>
    </div>
  );
}

export default VideoSection;