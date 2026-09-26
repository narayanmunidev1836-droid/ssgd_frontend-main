import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { fetchAboutusData, fetchSlider } from "../../api/API";
import InnerpageLoader from "../Home/InnerpageLoader";
import "./AboutUs.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleClick = (items) => {
    navigate(`/about-us/about/${items.details.title}/${items.id}`);
  };

  const handleShortDesc = async (id, name) => {
    navigate(`/about-us/about/${name}/${id}`);
  };

  const handleClickMandir = (id, title) => {
    navigate(`/about-us/${title}/${id}`);
  };

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

  const handleClickFounder = () => {
    navigate("/about-us/founder");
  };

  const handleClickTradition = () => {
    navigate("/about-us/guru-tradition");
  };

  const breadcrumbsData = [
    { label: "Home", url: "/" },
    <label className="active-link-color">About us</label>,
  ];

  const [showShimmer, setShowShimmer] = useState(true);
  const [aboutUsHistory, setAboutusHistory] = useState([]);
  const [aboutUsTopData, setAboutUsTopData] = useState([]);
  const [aboutUsBottomData, setABoutUsBottomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);
  const [historyImage, setHistoryImage] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchAboutusData({
          url: apiUrl,
          page: "about us",
        });
        if (response.data.status === true) {
          setAboutusHistory(response.data.responseBody.about_us_history.history);
          setHistoryImage(response.data.responseBody.about_us_history.image);
          setAboutUsTopData(response.data.responseBody.about_us_top);
          setABoutUsBottomData(response.data.responseBody.about_us_bottom);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
      try {
        const response = await fetchSlider({
          url: process.env.REACT_APP_API_URL,
          page: "about us",
        });
        setBanner(response.data.responseBody);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching banner:", error);
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  const MAX_DESCRIPTION_LENGTH = 350;

  const TruncatedDescription = ({ description }) => {
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      const truncatedText = description.substring(0, MAX_DESCRIPTION_LENGTH);
      const readMoreText = " Read more...";
      return (
        <>
          <span>{truncatedText}</span>
          <span style={{ borderBottom: "1px solid #ccc" }}>{readMoreText}</span>
        </>
      );
    }
    return description;
  };

  function renderShortDescription(shortDescription) {
    if (typeof shortDescription === "string") {
      return shortDescription;
    } else if (Array.isArray(shortDescription)) {
      return shortDescription?.map((item) => item.name).join(", ");
    } else {
      return "";
    }
  }

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

useEffect(() => {
  if (imageLoaded) {
    // Delay the DOM access slightly to ensure elements are rendered
    const timeout = setTimeout(() => {
      const elements = document.getElementsByClassName("Center-Images");
      if (elements.length > 0) {
        Array.from(elements).forEach((element) => {
          if (element.parentElement) {
            element.parentElement.style.display = "block";
          }
        });
      } else {
        console.warn("No elements with class 'Center-Images' found");
      }
    }, 100); // or try 100ms if 0 doesn't work

    // Cleanup in case the component unmounts
    // return () => clearTimeout(timeout);
  }
}, [imageLoaded]);




  return (
    <>
      <div className="contact-img-wrap">
        <div className="spinner-container-banner">
          {!imageLoaded && (
            <div className="shimmer-activity-wrapper">
              <div className="shimmer" />
            </div>
          )}
          {banner && (
            <LazyLoadImage
              src={banner}
              alt="Banner"
              className="about-img"
              afterLoad={() => setImageLoaded(true)}
              effect="blur"
            />
          )}
        </div>
        {imageLoaded && (
          <div className="breadcrumbs-wrap">
            <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
          </div>
        )}
      </div>

      <Container className="about-us-page about_us_page">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={12} md={8}>
            <div className="container about-container about-us-content">
              <div>
                <span className="span-bg-color">History</span>
              </div>
              <div className="container">
                <div className="container">
                  <div>
                    <div className="mt-5" data-aos="fade-up">
                      {loading ? (
                        <div className="slider-item" style={{ width: "100%" }}>
                          <div className="slider-item-shimmer" style={{ width: "100%" }}></div>
                        </div>
                      ) : (
                        <LazyLoadImage
                          src={historyImage}
                          alt="History"
                          className="about-hisory-image"
                          effect="blur"
                        />
                      )}
                    </div>
                    {loading ? (
                      [...Array(10)].map((_, index) => (
                        <div className="slider-item-shimmer-text-about mt-3" key={index} />
                      ))
                    ) : (
                      <div data-aos="fade-up">
                        <p
                          dangerouslySetInnerHTML={{ __html: aboutUsHistory }}
                          className="mt-5"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            {loading ? (
              <div style={{ cursor: "pointer" }} className="about-us-content-wrap" data-aos="fade-up">
                <div className="sant-photo-content pt-sm-0">
                  <div className="sant-img-placeholder" style={{ width: "150px", height: "150px" }}></div>
                  <h4 className="shimmer" style={{ width: "60%" }}></h4>
                </div>
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="slider-item-shimmer-text-about mt-3"
                    style={{ width: "100%" }}
                  />
                ))}
              </div>
            ) : (
              aboutUsTopData?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleClick(item)}
                  style={{ cursor: "pointer" }}
                  data-aos="fade-up"
                  className={`about-us-content-wrap ${index > 0 ? "second-content" : ""}`}
                >
                  <LazyLoadImage
                    src={item.details.image}
                    alt={item.details.title}
                    className="about-us-img Center-Images"
                    effect="blur"
                  />
                  <div className="about-us-text" data-aos="fade-up">
                    <h6 className="mt-3">{item.details.title}</h6>
                    {(() => {
                      try {
                        const shortDescription = JSON.parse(item.details.short_description);
                        if (Array.isArray(shortDescription)) {
                          return (
                            <div>
                              {shortDescription?.map((s, i) => (
                                <p
                                  key={i}
                                  className="about-short-desc"
                                  onClick={() => handleShortDesc(s.id, s.name)}
                                >{`${i + 1}. ${s.name}`}</p>
                              ))}
                            </div>
                          );
                        } else {
                          return (
                            <p
                              className="mt-3"
                              dangerouslySetInnerHTML={{
                                __html: shortDescription,
                              }}
                            ></p>
                          );
                        }
                      } catch (error) {
                        return (
                          <p
                            className="mt-3"
                            dangerouslySetInnerHTML={{
                              __html: item.details.short_description,
                            }}
                          ></p>
                        );
                      }
                    })()}
                  </div>
                </div>
              ))
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
        >
          {loading
            ? Array.from(new Array(5)).map((_, index) => (
                <Grid key={index} item xs={12} sm={12} md={4} lg={2}>
                  <div className="sant-photo-content pt-sm-0 mt-5">
                    <div className="sant-img-placeholder" style={{ width: "150px", height: "150px" }}></div>
                    <h4 className="shimmer" style={{ width: "60%" }}></h4>
                    <p className="shimmer" style={{ width: "80%" }}></p>
                  </div>
                </Grid>
              ))
            : aboutUsBottomData?.map((item, index) => (
                <Grid key={index} item xs={12} sm={4} md={3} lg={2} className="aboutUs-image-wrap g-2" data-aos="fade-up">
                  <div
                    className="aboutUs-image-inner-wrap"
                    onClick={() => handleClickMandir(item.id, item.details.title)}
                  >
                    <LazyLoadImage
                      src={item.details.image}
                      alt={item.details.title}
                      className="aboutus-botttom-images"
                      effect="blur"
                    />
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

export default AboutUs;
