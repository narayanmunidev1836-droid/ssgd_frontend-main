"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "../../common/routerCompat.js";
import "./Home.css";
import { fetchSlider } from "../../api/API";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const PrevArrow = ({ onClick }) => (
  <div className="custom-prev-arrow" onClick={onClick}>
    <MdChevronLeft className="custom-prev-icon" />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="custom-next-arrow" onClick={onClick}>
    <MdChevronRight className="custom-next-icon" />
  </div>
);

const HomeSlider = () => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderSettings = {
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3500,
    infinite: true,
    pauseOnHover: false,
    cssEase: "ease-in-out",
  };

  const fetchData = async () => {
    try {
      const response = await fetchSlider({
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "home",
      });
      if (response.data.code === 200 || response.data.code === 201) {
        setApiData(response.data.responseBody);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container-fluid slider-wrap">
      {loading ? (
        <div className="homeSlideerShimmer">
          {/* Keeps one H1 in the server-rendered HTML while slides load */}
          <h1 className="visually-hidden">
            Sanskardham Gurukul: Spirituality, Education and Service
          </h1>
          <div className="shimmer-wrapper" style={{ height: "100%" }}>
            <div className="shimmer" />
          </div>
        </div>
      ) : (
        <>
          <Slider {...sliderSettings} className="slider-buttons">
            {apiData.map((image, index) => (
              <div key={index}>
                <div className="lazy-load-container">
                  <img
                    src={image}
                    alt={`Sanskardham Gurukul (SSGD) highlight ${index + 1} of ${apiData.length}`}
                    style={{ width: "100%", height: "auto" }}
                    className="slider-img"
                  />
                </div>
              </div>
            ))}
          </Slider>

          {/* Hero text overlay */}
          <div className="slider-hero-overlay">
            <div className="container">
              <div className="slider-hero-content">
                <h1 className="slider-heading">
                  <span className="visually-hidden">Sanskardham Gurukul: </span>
                  Spirituality
                  <br />
                  Education <span className="slider-bullet">•</span> Service
                </h1>
                <p className="slider-gujarati">
                  સંસ્કાર દ્વારા ઉજ્વળ સમાજનું નિર્માણ
                </p>
                <p className="slider-desc">
                  Shree Swaminarayan Sanskardham Gurukul (SSGD)
                  Dhrangadhra is dedicated to nurturing values, education
                  and selfless service in the light of Bhagwan Shree
                  Swaminarayan's divine teachings.
                </p>
                <div className="slider-btns">
                  <Link className="slider-btn-primary" to="/about-us">
                    Explore SSGD &nbsp;&#8594;
                  </Link>
                  <Link className="slider-btn-secondary" to="/daily-darshan">
                    &#9654;&nbsp; Daily Darshan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeSlider;
