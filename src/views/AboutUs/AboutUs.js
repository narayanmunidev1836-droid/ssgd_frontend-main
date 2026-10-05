"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "../../common/routerCompat.js";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { fetchAboutusData, fetchSlider } from "../../api/API";
import ReadMoreText from "../../common/ReadMoreText/ReadMoreText";
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

  const breadcrumbsData = [
    { label: "Home", url: "/" },
    <label className="active-link-color">About Us</label>,
  ];

  const [aboutUsHistory, setAboutusHistory] = useState([]);
  const [aboutUsTopData, setAboutUsTopData] = useState([]);
  const [aboutUsBottomData, setABoutUsBottomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);
  const [historyImage, setHistoryImage] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
          url: process.env.NEXT_PUBLIC_API_URL,
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

  // Plain-text excerpt for the top cards, with a "Read more" cue when cut
  const READ_MORE_LIMIT = 160;
  const renderExcerpt = (html) => {
    const plain = String(html || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (plain.length <= READ_MORE_LIMIT) return plain;
    return (
      <>
        {plain.slice(0, READ_MORE_LIMIT).trimEnd()}&hellip;{" "}
        <span className="au-read-more">Read more</span>
      </>
    );
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
      // Show the wrapper of centred images once the banner is in place
      const timeout = setTimeout(() => {
        const elements = document.getElementsByClassName("Center-Images");
        if (elements.length > 0) {
          Array.from(elements).forEach((element) => {
            if (element.parentElement) {
              element.parentElement.style.display = "block";
            }
          });
        }
      }, 100);
      return () => clearTimeout(timeout);
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

      <div className="au-page">
        <div className="au-section-header" data-aos="fade-up">
          <h2 className="au-section-title">About Us</h2>
          <p className="au-section-subtitle">
            Our history, our traditions and the spiritual heritage we carry forward.
          </p>
        </div>

        <div className="au-container au-body">
          {/* History */}
          <section className="au-card au-history" data-aos="fade-up">
            <div className="au-card-body">
              <h3 className="au-subsection-title">History</h3>
              {loading ? (
                <>
                  <div className="slider-item-shimmer" style={{ width: "100%", height: "260px" }}></div>
                  {[...Array(6)].map((_, index) => (
                    <div className="slider-item-shimmer-text-about mt-3" key={index} />
                  ))}
                </>
              ) : (
                <>
                  <LazyLoadImage
                    src={historyImage}
                    alt="History"
                    className="au-history-image"
                    wrapperClassName="au-history-wrap"
                    effect="blur"
                  />
                  <ReadMoreText
                    html={aboutUsHistory}
                    limit={600}
                    className="au-history-text"
                  />
                </>
              )}
            </div>
          </section>

          {/* Top highlights */}
          <div className="au-top-grid">
            {loading
              ? [...Array(2)].map((_, index) => (
                  <div className="au-card au-skeleton" key={index}>
                    <div className="slider-item-shimmer" style={{ width: "100%", height: "220px" }}></div>
                    <div className="au-card-body">
                      <div className="slider-item-shimmer-text-about" />
                      <div className="slider-item-shimmer-text-about mt-3" />
                    </div>
                  </div>
                ))
              : aboutUsTopData?.map((item, index) => (
                  <article
                    key={index}
                    className="au-card au-top-card"
                    onClick={() => handleClick(item)}
                    data-aos="fade-up"
                  >
                    <LazyLoadImage
                      src={item.details.image}
                      alt={item.details.title}
                      className="au-top-image Center-Images"
                      effect="blur"
                    />
                    <div className="au-card-body">
                      <h6 className="au-top-title">{item.details.title}</h6>
                      {(() => {
                        try {
                          const shortDescription = JSON.parse(item.details.short_description);
                          if (Array.isArray(shortDescription)) {
                            return (
                              <div>
                                {shortDescription?.map((s, i) => (
                                  <p
                                    key={i}
                                    className="au-short-desc"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleShortDesc(s.id, s.name);
                                    }}
                                  >{`${i + 1}. ${s.name}`}</p>
                                ))}
                              </div>
                            );
                          }
                          return (
                            <p className="au-top-text">{renderExcerpt(shortDescription)}</p>
                          );
                        } catch (error) {
                          return (
                            <p className="au-top-text">{renderExcerpt(item.details.short_description)}</p>
                          );
                        }
                      })()}
                    </div>
                  </article>
                ))}
          </div>

          {/* Bottom links */}
          <div className="au-bottom-grid" data-aos="fade-up">
            {loading
              ? Array.from(new Array(5)).map((_, index) => (
                  <div className="au-bottom-card au-skeleton" key={index}>
                    <div className="slider-item-shimmer" style={{ width: "100%", height: "120px" }}></div>
                    <div className="au-bottom-label">
                      <div className="slider-item-shimmer-text-about" />
                    </div>
                  </div>
                ))
              : aboutUsBottomData?.map((item, index) => (
                  <div
                    key={index}
                    className="au-bottom-card"
                    onClick={() => handleClickMandir(item.id, item.details.title)}
                  >
                    <LazyLoadImage
                      src={item.details.image}
                      alt={item.details.title}
                      className="au-bottom-image"
                      effect="blur"
                    />
                    <div className="au-bottom-label">
                      <p>{item.details.title}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
