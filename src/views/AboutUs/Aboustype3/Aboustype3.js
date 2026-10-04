"use client";
import React, { useState, useEffect } from "react";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { fetchSlider } from "../../../api/API";
import InnerpageLoader from "../../Home/InnerpageLoader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Aboustype3 = ({ aboutUsData }) => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us" },
    <label color="text.primary" className="active-link-color">Founder</label>,
  ];

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
          url: process.env.NEXT_PUBLIC_API_URL,
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
        <Grid container spacing={3} justifyContent="center" className="pt-0">
          <Grid item xs={12} sm={12} md={12} style={{ paddingTop: "0px" }}>
            <div className="container about-container about-us-content">
              <div>
                <span className="span-bg-color">
                  {aboutUsData.about_us_data.title}
                </span>
              </div>

              <Container>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} sm={12} md={4} lg={3}>
                    <LazyLoadImage
                      src={aboutUsData.about_us_data.image}
                      alt=""
                      className="founder-img"
                      effect="blur"
                      wrapperClassName="lazy-load-image-background"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={8} lg={9}>
                    <p className="mt-sm-0 mt-md-5 mt-lg-5">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {aboutUsData.about_us_data.short_description}
                    </p>
                  </Grid>
                </Grid>
              </Container>

              <Container>
                <p
                  className="mt-4"
                  dangerouslySetInnerHTML={{
                    __html: aboutUsData.about_us_data.description,
                  }}
                ></p>
              </Container>
              <br />
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Aboustype3;
