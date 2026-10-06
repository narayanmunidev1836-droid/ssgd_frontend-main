"use client";
import React, { useEffect, useState } from "react";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { useNavigate, useParams } from "../../../common/routerCompat.js";
import { fetchAboutusFooterDertails } from "../../../api/API";
import "../PrarthnaMandir/PrarthnaMandir.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ReadMoreText from "../../../common/ReadMoreText/ReadMoreText";
import "./Aboustype1.css";
import AOS from "aos";
import "aos/dist/aos.css";

const safeDecode = (value) => {
  try {
    return decodeURIComponent(value || "");
  } catch (error) {
    return value || "";
  }
};

const Aboustype1 = ({ aboutUsData }) => {
  const params = useParams();
  const { image, short_description, title } = aboutUsData.about_us_data;

  // Prefer the API title; the route parameter is URL-encoded (e.g. %20)
  const pageTitle = title || safeDecode(params.title);
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us" },
    <label color="text.primary" className="active-link-color">
      {pageTitle}
    </label>,
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  // Suggestion cards: other About Us places, excluding the one on screen
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetchAboutusFooterDertails({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "about us",
          id: params.id,
        });
        const list = response.data.responseBody.about_us_footer || [];
        setSuggestions(list.filter((item) => String(item.id) !== String(params.id)));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    fetchSuggestions();
  }, [params.id]);

  const handleSuggestionClick = (item) => {
    navigate(`/about-us/${item.details.title}/${item.id}`);
  };

  const handleImageLoad = (src) => {
    const imageElement = document.querySelector(
      `.lazy-load-image-background[data-src="${src}"]`
    );
    if (imageElement) {
      imageElement.classList.add("lazy-load-image-loaded");
    }
    AOS.refresh();
  };

  return (
    <>
      {/* Top block: hero card with breadcrumb on its edge, then the list cards */}
      <div className="temple-page-bg">
      <div className="at1-top">
        <div className="at1-hero-wrap">
          <section className="at1-hero" data-aos="fade-up">
            <div className="at1-hero-photo">
              <LazyLoadImage
                src={image}
                alt={title}
                className="at1-hero-img"
                effect="blur"
                wrapperClassName="lazy-load-image-background aboutustype"
                afterLoad={() => handleImageLoad(image)}
              />
            </div>
            <div className="at1-hero-body">
              <h1 className="at1-hero-title">{title}</h1>
              <p
                className="at1-hero-text"
                dangerouslySetInnerHTML={{ __html: short_description }}
              ></p>
            </div>
          </section>
          <div className="breadcrumbs-wrap">
            <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
          </div>
        </div>

        <div className="at1-lists">
          {aboutUsData.throns.map(
            (thorn, index) =>
              thorn[0] !== "" && (
                <div
                  key={index}
                  className="at1-list-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <h4 className="at1-list-title">{thorn[0]}</h4>
                  <ul className="at1-list">
                    {thorn.slice(1).map((element, i) => (
                      <li key={i}>{element.name}</li>
                    ))}
                  </ul>
                </div>
              )
          )}
        </div>
      </div>

      {/* Main column: each section as a card */}
        <div className="at1-page">
          <div className="at1-container">
            <div className="at1-main">
              {aboutUsData.about_desc.map((e, index) => (
                <section className="at1-section" key={index} data-aos="fade-up">
                  {e.title && <h3 className="at1-section-title">{e.title}</h3>}
                  {e.image && (
                    <div className="at1-photo">
                      <LazyLoadImage
                        src={e.image}
                        alt=""
                        className="at1-photo-img"
                        effect="blur"
                        wrapperClassName="lazy-load-image-background aboutustype"
                        afterLoad={() => handleImageLoad(e.image)}
                      />
                    </div>
                  )}
                  <ReadMoreText
                    html={e.content}
                    limit={450}
                    className="at1-text"
                  />
                </section>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions: other places to explore, at the end of the page */}
        {suggestions.length > 0 && (
          <div className="pm-page">
            <div className="pm-container">
              <h3 className="pm-heading">More to explore</h3>
              <div className="pm-grid">
                {suggestions.map((item, index) => (
                  <div
                    key={item.id ?? index}
                    className="pm-card"
                    data-aos="fade-up"
                    data-aos-delay={(index % 4) * 100}
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <div className="pm-card-photo">
                      <LazyLoadImage
                        src={item.details.image}
                        alt={item.details.title}
                        className="pm-card-img"
                        effect="blur"
                        wrapperClassName="lazy-load-image-background aboutustype"
                      />
                    </div>
                    <div className="pm-card-title">
                      <p>{item.details.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Aboustype1;
