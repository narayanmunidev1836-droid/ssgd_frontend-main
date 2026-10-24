"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./Home.css";
import { fetchSlider } from "../../api/API";
import { QuickNavCard, cards } from "./QuickNavCards";

const HomeSlider = () => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderSettings = {
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
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
        // The API can list the same image twice, which would add extra slides and dots
        setApiData([...new Set(response.data.responseBody)]);
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
    <div className="container-fluid home-hero temple-page-bg">
      {/* Keeps one H1 in the server-rendered HTML */}
      <h1 className="visually-hidden">
        Sanskardham Gurukul: Spirituality, Education and Service
      </h1>
      <div className="hero-grid">
        {/* Desktop only: two quick-nav cards on each side of the slider */}
        <div className="hero-side">
          {cards.slice(0, 2).map((card) => (
            <QuickNavCard key={card.title} card={card} />
          ))}
        </div>

        <div className="hero-frame">
          {loading ? (
            <div className="homeSlideerShimmer">
              <div className="shimmer-wrapper" style={{ height: "100%" }}>
                <div className="shimmer" />
              </div>
            </div>
          ) : (
            <Slider {...sliderSettings} className="slider-buttons">
              {apiData.map((image, index) => (
                <div key={image}>
                  <div className="lazy-load-container">
                    <img
                      src={image}
                      alt={`Sanskardham Gurukul (SSGD) highlight ${index + 1} of ${apiData.length}`}
                      className="slider-img"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>

        <div className="hero-side">
          {cards.slice(2).map((card) => (
            <QuickNavCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSlider;
