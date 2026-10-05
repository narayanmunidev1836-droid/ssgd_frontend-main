"use client";
import React, { useEffect, useState } from "react";
import InnerpageLoader from "../Home/InnerpageLoader";
import { customDetailPage, fetchSlider } from "../../api/API";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { useParams } from "../../common/routerCompat.js";
import "../CustomePage/CustomPage.css";
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
import AOS from "aos";
import "aos/dist/aos.css";
import _slider1 from "../../assets/images/slider_1.webp";
const slider1 = _slider1.src;

const CustomPage = () => {
  const [CustomPageData, setCustomPageData] = useState({});
  const [banner, setBanner] = useState(null);
  const param = useParams();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading,setLoading] = useState(true)

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const breadcrumbsData = [
    { label: "Home", url: "/" },
    <label className="active-link-color">{param.name}</label>,
  ];

  useEffect(() => {
    handleCustomPage();
  }, []);

  const handleCustomPage = async () => {
    const params = {
      url: process.env.NEXT_PUBLIC_API_URL,
      page: "custom",
      custom_id: param.id,
    };
    try {
      const resp = await customDetailPage(params);
      if (resp.data.code == 200 || resp.data.code == 201) {
        setCustomPageData(resp.data.responseBody);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
          }
  };
  useEffect(() => {
    fetchBanner();
  }, []);
  const fetchBanner = async () => {
    try {
      const response = await fetchSlider({
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "custom",
        custom_id: param.id,
      });
      setBanner(response.data.responseBody);
          } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <>
      {/* <div className="contact-img-wrap">
        <div className="spinner-container-banner">
          <>
            <img
              src={slider1}
              alt=""
              style={{ height: "252px", width: "100%" }}
            />
          </>
        </div>
        <div className="breadcrumbs-wrap">
          <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
        </div>
      </div> */}
      <div className="contact-img-wrap">
        <div className="spinner-container-banner">
        {/* {!imageLoaded && (
            <div className="shimmer-activity-wrapper">
              <div className="shimmer" />
            </div>
          )} */}
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
 
      <div className="cp-page">
      <div className="cp-container">
        <article className="cp-card" data-aos="fade-up">
          {loading ?  <>
            <div className="shimmer-title" style={{width:"37%"}}/>
            <div className="shimmer-text-line" />
            <div className="shimmer-text-line" />
            <div className="shimmer-text-line short" />
          </>
          :
          <>
          <h4>{CustomPageData ? CustomPageData.name : "-"}</h4>
          <img
            src={CustomPageData.image ? CustomPageData.image : ""}
            className="custom-image"
          />
          <p
            className="mt-sm-3 mt-md-3 mt-lg-3 custom-page-paragraph"
            dangerouslySetInnerHTML={{
              __html: CustomPageData.long_description,
            }}
          ></p>
          <p className="mt-4"></p>
          </>
}
        </article>
      </div>
      </div>
    </>
  );
};

export default CustomPage;
