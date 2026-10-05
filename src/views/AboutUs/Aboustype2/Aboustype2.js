"use client";
import React, { useState, useEffect } from "react";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { fetchSlider } from "../../../api/API";
import InnerpageLoader from "../../Home/InnerpageLoader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./Aboustype2.css";

const Aboustype2 = ({ aboutUsData }) => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us" },
    <label color="text.primary" className="active-link-color">
      BRAHMANAND TRADITION
    </label>,
  ];

  const images = aboutUsData?.images || [];
  const [banner, setBanner] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetchSlider({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "about us",
        });
        setBanner(response.data.responseBody);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBanner();
  }, []);

  return (
    <>
      <div className="contact-img-wrap">
        <div className="spinner-container-banner">
          {!imageLoaded && (
            <div className="shimmer-activity-wrapper">
              <div className="shimmer" />
            </div>
          )}
          <InnerpageLoader
            src={banner}
            className="about-img"
            onImageLoad={handleImageLoad}
          />
        </div>
        {imageLoaded && (
          <div className="breadcrumbs-wrap">
            <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
          </div>
        )}
      </div>

      <div className="at2-page">
        <div className="at2-container">
          <div className="at2-heading">
            <h2 className="at2-title">BRAHMANAND TRADITION</h2>
          </div>

          <div className="at2-grid">
            {images.map((imageUrl, index) => (
              <div className="at2-card" key={index}>
                <LazyLoadImage
                  src={imageUrl}
                  alt={`Tradition ${index + 1}`}
                  className="at2-image"
                  effect="blur"
                  wrapperClassName="at2-image-wrap"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Aboustype2;
