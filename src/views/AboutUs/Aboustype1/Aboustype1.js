"use client";
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { useParams } from "../../../common/routerCompat.js";
import { fetchSlider } from "../../../api/API";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Aboustype1 = ({ aboutUsData }) => {
  const params = useParams();
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us" },
    <label color="text.primary" className="active-link-color">
      {params.title}
    </label>,
  ];

  const { image, short_description, title } = aboutUsData.about_us_data;
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const handleImageLoad = (src) => {
    const imageElement = document.querySelector(
      `.lazy-load-image-background[data-src="${src}"]`
    );
    if (imageElement) {
      imageElement.classList.add("lazy-load-image-loaded");
    }
    setImageLoaded(true);
    AOS.refresh();
  };

  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
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

  const leftData = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8"];
  const rightData = ["Item A", "Item B", "Item C", "Item D"];

  return (
    <>
      <div className="contact-img-wrap">
        <div className="spinner-container-banner" data-aos="fade-in">
          {!imageLoaded && (
            <div className="shimmer-activity-wrapper">
              <div className="shimmer" />
            </div>
          )}
          {banner.length > 0 && (
            <LazyLoadImage
              src={banner[0].image}
              alt="Banner"
              className="about-img"
              effect="blur"
              afterLoad={() => handleImageLoad(banner[0].image)}
            />
          )}
        </div>
        {imageLoaded && (
          <div className="breadcrumbs-wrap">
            <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
          </div>
        )}
      </div>
      <Container className="about-us-page">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={8}>
            {aboutUsData.about_desc.map((e, index) => (
              <div
                className={`container about-container about-us-content aboutusType1 ${
                  index > 0 ? "aboutus-type1" : ""
                }`}
                data-aos="fade-up"
              >
                <div>
                  <span className="span-bg-color">{e.title}</span>
                </div>
                <div className="pt-4">
                  <LazyLoadImage
                    src={e.image}
                    alt=""
                    className="about-us-innerpage"
                    effect="blur"
                    wrapperClassName="lazy-load-image-background aboutustype"
                    afterLoad={() => handleImageLoad(e.image)}
                  />
                  <p
                    className="mt-5"
                    dangerouslySetInnerHTML={{ __html: e.content }}
                  ></p>
                </div>
              </div>
            ))}
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <div className="about-us-grid">
              <div className="container about about-us-content about_us_content" data-aos="fade-up">
                <LazyLoadImage
                  src={image}
                  alt={image}
                  className="about-image"
                  effect="blur"
                  wrapperClassName="lazy-load-image-background aboutustype"
                  afterLoad={() => handleImageLoad(image)}
                />
                <div className="about-text">
                  <h1>{title}</h1>
                  <p dangerouslySetInnerHTML={{ __html: short_description }}></p>
                </div>
              </div>
              {aboutUsData.throns.map(
                (thorn, index) =>
                  thorn[0] !== "" && (
                    <div
                      key={index}
                      className="container about about-us-content"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <h1 className="about-text1">{thorn[0]}</h1>
                      <ul className="about-list">
                        {thorn.slice(1).map((element, i) => (
                          <li key={i}>{element.name}</li>
                        ))}
                      </ul>
                    </div>
                  )
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Aboustype1;
