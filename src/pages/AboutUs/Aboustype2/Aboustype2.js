import React, { useState, useEffect } from "react";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { fetchSlider } from "../../../api/API";
import InnerpageLoader from "../../Home/InnerpageLoader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Aboustype2 = ({ aboutUsData }) => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us" },
    <label color="text.primary" className="active-link-color">
      BRAHMANAND TRADITION
    </label>,
  ];

  const { images } = aboutUsData;
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetchSlider({
          url: process.env.REACT_APP_API_URL,
          page: "about us",
        });
        setBanner(response.data.responseBody);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
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
      <Container className="about-us-page">
        <Grid
          container
          spacing={3}
          justifyContent="center"
          className="sub-activities"
        >
          {images.map((imageUrl, index) => (
            <Grid key={index} item xs={12} sm={6} md={3}>
              <div className="tradition-image-wrap">
                <LazyLoadImage
                  src={imageUrl}
                  alt={`Tradition ${index + 1}`}
                  className="tradition-image"
                  effect="blur"
                  wrapperClassName="lazy-load-image-background"
                />
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Aboustype2;
