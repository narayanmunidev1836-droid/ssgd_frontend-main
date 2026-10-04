"use client";
import React, { useState, useEffect } from "react";
import { SlLocationPin } from "react-icons/sl";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { Link } from "../../common/routerCompat.js";
import { fetchBranchespageData, fetchSlider } from "../../api/API";
import InnerpageLoader from "../Home/InnerpageLoader";
import "./Branches.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";
import _templeHeroBg from "../../assets/images/Serene Golden Temple Panorama.png";
const templeHeroBg = _templeHeroBg.src;

const getLocationBadge = (branch) => {
  if (branch.city) return branch.city;
  if (branch.location) {
    const text = branch.location
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const parts = text.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
    return parts[0] || "";
  }
  return "";
};

const Branches = () => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    <label color="text.primary" className="active-link-color">
      Branches
    </label>,
  ];
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchBranchespageData({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "branch",
        });
        if (response.data.status === true) {
          setApiData(response.data.responseBody);
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
      try {
        const response = await fetchSlider({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "branch",
        });
        setBanner(response.data.responseBody);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBanner();
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <>
      {/* Banner */}
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

      {/* Section Header with Temple Panorama Background */}
      <div
        className="branches-section-header"
        style={{ backgroundImage: `url('${templeHeroBg}')` }}
      >
        <div className="branches-header-overlay" data-aos="fade-up">
          <h2 className="branches-main-title">Our Branches</h2>
          <div className="branches-title-divider">
            <span className="divider-line"></span>
            <span className="lotus-divider">✿</span>
            <span className="divider-line"></span>
          </div>
          <p className="branches-subtitle">
            Serving devotees across locations with spiritual guidance, education
            <br />
            and community development.
          </p>
        </div>
      </div>

      {/* Branch Cards */}
      <div className="branches-cards-section">
        <div className="branches-container">
          <div className="branches-grid">
            {loading
              ? [...Array(2)].map((_, index) => (
                  <div key={index} className="branch-card-skeleton" data-aos="fade-up">
                    <div className="skeleton-img shimmer" />
                    <div className="skeleton-body">
                      <div className="skeleton-line shimmer" style={{ width: "40%", height: "24px" }} />
                      <div className="skeleton-line shimmer" style={{ width: "70%", height: "16px", marginTop: "8px" }} />
                      <div className="skeleton-line shimmer" style={{ width: "85%", marginTop: "20px" }} />
                      <div className="skeleton-line shimmer" style={{ width: "60%" }} />
                      <div className="skeleton-line shimmer" style={{ width: "65%" }} />
                    </div>
                  </div>
                ))
              : apiData &&
                apiData.branches &&
                apiData.branches.map((branch, index) => (
                  <div key={index} className="branch-card" data-aos="fade-up">
                    {/* Image */}
                    <div className="branch-card-img-wrap">
                      <LazyLoadImage
                        src={branch.image}
                        alt={branch.name}
                        className="branch-card-img"
                        wrapperClassName="branch-img-wrapper"
                      />
                      {getLocationBadge(branch) && (
                        <div className="branch-location-badge">
                          <SlLocationPin className="badge-pin-icon" />
                          <span>{getLocationBadge(branch)}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="branch-card-body">
                      <h3 className="branch-card-short-name">{branch.short_name || branch.name}</h3>
                      {branch.full_name && (
                        <p className="branch-card-full-name">{branch.full_name}</p>
                      )}

                      <div className="branch-card-divider" />

                      <div className="branch-card-info">
                        <div className="branch-info-row">
                          <SlLocationPin className="branch-info-icon" />
                          <p
                            className="branch-info-text"
                            dangerouslySetInnerHTML={{ __html: branch.location }}
                          />
                        </div>
                        {branch.mobile_number && (
                          <div className="branch-info-row">
                            <FiPhone className="branch-info-icon" />
                            <p className="branch-info-text">{branch.mobile_number}</p>
                          </div>
                        )}
                        {branch.email && (
                          <div className="branch-info-row">
                            <MdOutlineEmail className="branch-info-icon" />
                            <p className="branch-info-text">{branch.email}</p>
                          </div>
                        )}
                      </div>

                      <div className="branch-card-actions">
                        {branch.website_url ? (
                          <Link
                            to={"#"}
                            className="branch-view-btn"
                          >
                            View Branch <FaArrowRight className="btn-arrow" />
                          </Link>
                        ) : (
                          <span className="branch-view-btn branch-view-btn--disabled">
                            View Branch <FaArrowRight className="btn-arrow" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Branches;
