import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "./SantPhotos.css";
import g1 from "../../assets/images/brahamanad_tradition.jpg";
import g2 from "../../assets/images/education_activities.jpg";
import g3 from "../../assets/images/community_activities.jpg";
import g4 from "../../assets/images/medical_activities.jpg";
import g5 from "../../assets/images/child_development_activities.jpg";
import g6 from "../../assets/images/cultural_activities.jpg";

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
    </section>
  );
}

export default SantPhotos;
