"use client";
import React from "react";
import { useNavigate } from "../../common/routerCompat.js";
import Slider from "react-slick";
import "./SantPhotos.css";
import _g1 from "../../assets/images/brahamanad_tradition.webp";
const g1 = _g1.src;
import _g2 from "../../assets/images/education_activities.webp";
const g2 = _g2.src;
import _g3 from "../../assets/images/community_activities.webp";
const g3 = _g3.src;
import _g4 from "../../assets/images/medical_activities.webp";
const g4 = _g4.src;
import _g5 from "../../assets/images/child_development_activities.webp";
const g5 = _g5.src;
import _g6 from "../../assets/images/cultural_activities.webp";
const g6 = _g6.src;
import { Container } from "@mui/material";

const galleryImages = [g1, g2, g3, g4, g5, g6];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 3 },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 1 },
    },
  ],
};

function SantPhotos() {
  const navigate = useNavigate();

  return (
    <section className="gallery-section">
      <Container>
        <div className="container">
        <div className="gallery-section-header" data-aos="fade-up">
          <div className="gallery-heading-wrap">
            <div>
              <h2 className="gallery-section-title">Gallery</h2>
              <p className="gallery-section-subtitle">
                Divine moments from Sanskardham Gurukul
              </p>
            </div>
          </div>
          <button
            className="gallery-view-more-btn"
            onClick={() => navigate("/about-us")}
          >
            View More &nbsp;&#8594;
          </button>
        </div>

        <div className="gallery-slider-wrap" data-aos="fade-up" data-aos-delay="100">
          <Slider {...sliderSettings}>
            {galleryImages.map((img, index) => (
              <div key={index} className="gallery-slide-item">
                <div className="gallery-tile">
                  <img src={img} alt={`Gallery ${index + 1}`} className="gallery-tile-img" />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      </Container>
    </section>
  );
}

export default SantPhotos;
