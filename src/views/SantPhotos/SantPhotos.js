"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "../../common/routerCompat.js";
import "./SantPhotos.css";
import { Container } from "@mui/material";
import { fetchDailyDarshanData } from "../../api/API";

function SantPhotos() {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchDailyDarshanData({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "daily",
          type: "darshan",
        });
        const dailyData = response.data?.responseBody?.daily || [];
        const images = dailyData
          .flatMap((item) => item.media?.media || [])
          .slice(0, 4);
        setGalleryImages(images);
      } catch (error) {
        console.error("Error fetching data:", error);
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="gallery-section">
      <Container>
        <div className="container">
        <div className="gallery-section-header" data-aos="fade-up">
          <div className="gallery-heading-wrap">
            <div>
              <h2 className="gallery-section-title">Daily Darshan</h2>
              <p className="gallery-section-subtitle">
                Have the divine darshan of Thakorji every day
              </p>
            </div>
          </div>
          <button
            className="gallery-view-more-btn"
            onClick={() => navigate("/daily-darshan")}
          >
            View More &nbsp;&#8594;
          </button>
        </div>

        {(loading || galleryImages.length > 0) && (
          <div className="gallery-card-grid" data-aos="fade-up" data-aos-delay="100">
            {loading
              ? [...Array(4)].map((_, index) => (
                  <div key={index} className="gallery-card gallery-card-shimmer" />
                ))
              : galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="gallery-card"
                    onClick={() => navigate("/daily-darshan")}
                  >
                    <div className="gallery-card-photo">
                      <img src={img} alt={`Daily Darshan ${index + 1}`} className="gallery-card-img" />
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
      </Container>
    </section>
  );
}

export default SantPhotos;
