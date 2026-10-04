"use client";
import React, { useState, useEffect } from "react";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useNavigate } from "../../../common/routerCompat.js";
import { useParams } from "../../../common/routerCompat.js";
import { fetchAboutusFooterDertails, fetchSlider } from "../../../api/API";
import InnerpageLoader from "../../Home/InnerpageLoader";
import "../Founder.css";
import FullpageLoader from "../../../common/HomeSliderLoader/FullpageLoader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

const PrarthnaMandir = () => {
  const params = useParams();
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us" },
    <label color="text.primary" className="active-link-color">
      {params.title}
    </label>,
  ];

    const navigate = useNavigate();

  const handleClickYagnshala = () => {
    navigate("/about-us/yagnshala");
  };

  const handleClickGaushala = () => {
    navigate("/about-us/gaushala");
  };

  const handleClickVidhyalaya = () => {
    navigate("/about-us/brahmanand-vidhyalaya");
  };

  const handleClickHostel = () => {
    navigate("/about-us/hostel");
  };

  const handleClick = (id, title) => {
    navigate(`/about-us/${title}/${id}`);
      };
  const [aboutusDetails, setAboutusDetails] = useState([]);
  const [aboutusImage, setAboutusImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAboutusFooterDertails({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "about us",
          id: params.id,
        });
        setAboutusDetails(response.data.responseBody.about_us_footer_details);
        setAboutusImage(response.data.responseBody.about_us_footer);
                        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: false,     
    });
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

      <Container className="about-us-detail-page" data-aos="fade-up">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            {loading ? (
              <>
                <Container className="about-us-page about_us_page">
                  <Grid container spacing={3} justifyContent="center">
                    <Grid container>
                      <div className="container about-container about-us-content">
                        <div>
                          <span className="span-bg-color">-</span>
                        </div>
                        <div className="container">
                          <div className="container d-flex flex-wrap">
                            <Grid item xs={12} sm={12} md={3}>
                          
                              <div className="mt-5">
                                <>
                                  {" "}
                                  <div className="sant-img-placeholder"></div>
                                </>
                              </div>
                              </Grid>
                              <Grid item xs={12} sm={12} md={9} className="pt-5">
                              {[...Array(4)].map((_, index) => (
                                <div className="slider-item-shimmer-text-about mt-3" />
                              ))}
                           </Grid>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Container>
              </>
            ) : (
              <div className="container about-container about-us-content" data-aos="fade-up">
                <div>
                  <span className="span-bg-color">{aboutusDetails.title}</span>
                </div>

                <Container>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={12} md={4} lg={3}   data-aos="fade-up"
                data-aos-delay="100">
                      {/* <img
                      src={aboutusDetails.image}
                      alt=""
                      className="founder-img"
                    /> */}
                      <LazyLoadImage
                        src={aboutusDetails.image}
                        alt=""
                        className="founder-img"
                        wrapperClassName="lazy-load-image-background aboutustype"
                        afterLoad={() => {
                          const image = document.querySelector(
                            `.lazy-load-image-background[data-src="${aboutusDetails.image}"]`
                          );
                          if (image) {
                            image.classList.add("lazy-load-image-loaded");
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={9}  data-aos="fade-up"
                data-aos-delay="200">
                      <p
                        className="mt-sm-0 mt-md-5 mt-lg-5"
                        dangerouslySetInnerHTML={{
                          __html: aboutusDetails.description,
                        }}
                      ></p>
                    </Grid>
                  </Grid>
                </Container>
                <br></br>
              </div>
            )}
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          className="aboutUs-bottom-img-container"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {aboutusImage.map((item, index) => (
            <Grid xs={12} sm={12} md={4} lg={2} className="aboutUs-image-wrap"  data-aos="fade-up"
            data-aos-delay={index * 100}>
              <div
                key={index}
                className="aboutUs-image-inner-wrap"
                onClick={() => handleClick(item.id, item.details.title)}
              >
                <div>
                  {/* <img
                    src={item.details.image}
                    alt={item.details.title}
                    className="aboutus-botttom-images"
                  /> */}
                  <LazyLoadImage
                    src={item.details.image}
                    alt={item.details.title}
                    className="aboutus-botttom-images"
                    wrapperClassName="lazy-load-image-background aboutustype"
                    afterLoad={() => {
                      const image = document.querySelector(
                        `.lazy-load-image-background[data-src="${item.details.image}"]`
                      );
                      if (image) {
                        image.classList.add("lazy-load-image-loaded");
                      }
                    }}
                  />
                </div>
                <div>
                  <p>{item.details.title}</p>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default PrarthnaMandir;
