"use client";
import React, { useState, useEffect } from "react";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { useNavigate, useParams } from "../../../common/routerCompat.js";
import { fetchAboutusFooterDertails } from "../../../api/API";
import "../Aboustype1/Aboustype1.css";
import "./PrarthnaMandir.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

// The route parameter is URL-encoded (e.g. %20 for a space)
const safeDecode = (value) => {
  try {
    return decodeURIComponent(value || "");
  } catch (error) {
    return value || "";
  }
};

const PrarthnaMandir = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [aboutusDetails, setAboutusDetails] = useState({});
  const [aboutusImage, setAboutusImage] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageTitle = aboutusDetails.title || safeDecode(params.title);
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us" },
    <label color="text.primary" className="active-link-color">
      {pageTitle}
    </label>,
  ];

  const handleClick = (id, title) => {
    navigate(`/about-us/${title}/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchAboutusFooterDertails({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "about us",
          id: params.id,
        });
        setAboutusDetails(response.data.responseBody.about_us_footer_details || {});
        setAboutusImage(response.data.responseBody.about_us_footer || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  if (loading) {
    return (
      <div className="at1-page">
        <div className="at1-container">
          <div className="at1-skel shimmer at1-skel-photo" />
          {[...Array(4)].map((_, index) => (
            <div key={index} className="at1-skel shimmer at1-skel-line" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top block: hero card with breadcrumb on its edge */}
      <div className="at1-top">
        <div className="at1-hero-wrap">
          <section className="at1-hero" data-aos="fade-up">
            <div className="at1-hero-photo">
              <LazyLoadImage
                src={aboutusDetails.image}
                alt={pageTitle}
                className="at1-hero-img"
                effect="blur"
                wrapperClassName="lazy-load-image-background aboutustype"
              />
            </div>
            <div className="at1-hero-body">
              <h1 className="at1-hero-title">{aboutusDetails.title}</h1>
              <div
                className="at1-hero-text"
                dangerouslySetInnerHTML={{ __html: aboutusDetails.description }}
              />
            </div>
          </section>
          <div className="breadcrumbs-wrap">
            <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
          </div>
        </div>
      </div>

      {/* Related places */}
      {aboutusImage.length > 0 && (
        <div className="pm-page">
          <div className="pm-container">
            <div className="pm-grid">
              {aboutusImage.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="pm-card"
                  data-aos="fade-up"
                  data-aos-delay={(index % 4) * 100}
                  onClick={() => handleClick(item.id, item.details.title)}
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
    </>
  );
};

export default PrarthnaMandir;
