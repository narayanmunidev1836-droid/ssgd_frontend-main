"use client";
import React, { useState, useEffect } from "react";
import _image1 from "../../../assets/images/Satsang App Gopalanand Swamini Vato.webp";
const image1 = _image1.src;
import _image2 from "../../../assets/images/Satsang App Ghanshyam Lilamrut Sagar.webp";
const image2 = _image2.src;
import _image3 from "../../../assets/images/Vachanamrut Kavya.webp";
const image3 = _image3.src;
import _image4 from "../../../assets/images/Satsang App Harililamrut.webp";
const image4 = _image4.src;
import _image5 from "../../../assets/images/Satsang App Bhaktachintamani.webp";
const image5 = _image5.src;
import _image6 from "../../../assets/images/Satsang App Suprabhatam.webp";
const image6 = _image6.src;
import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import "lightgallery/scss/lightgallery.scss";
import "lightgallery/scss/lg-zoom.scss";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgZoom from "lightgallery/plugins/zoom";
import { FaSearchPlus } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import Grid from "@mui/material/Grid";
import { useNavigate } from "../../../common/routerCompat.js";
import { fetchPublicationList } from "../../../api/API";
import "./Wallpaper.css";

const Wallpaper = (activeTab) => {
  const [wallpaperList, setwallpaperList] = useState([]);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/audio-list");
    // handleButtonClick('Audio', 2);
  };

  const onBeforeSlide = (detail) => {
    const { index, prevIndex } = detail;
      };

  const onInit = () => {
      };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPublicationList({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "publication",
          order_by: "all",
          publication_id: 6,
        });
        setwallpaperList(response?.data?.responseBody.albums);
        // setPublicationList(response?.data?.responseBody.list_publication);
              } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="pt-4">
        <LightGallery
          onInit={onInit}
          speed={500}
          plugins={[lgThumbnail, lgZoom]}
        >
          <a href={image1} className="wallpaper-content">
            <img alt="" src={image1} className="katha-img" />
            <div className="search-icon">
              <FaSearchPlus />
            </div>
           
          </a>

          <a href={image2} className="wallpaper-content">
            <img alt="" src={image2} className="katha-img" />
            <div className="search-icon">
              <FaSearchPlus />
            </div>
           
          </a>
          <a href={image3} className="wallpaper-content">
            <img alt="" src={image3} className="katha-img" />
            <div className="search-icon">
              <FaSearchPlus />
            </div>
            
          </a>
          <a href={image4} className="wallpaper-content">
            <img alt="" src={image4} className="katha-img" />
            <div className="search-icon">
              <FaSearchPlus />
            </div>
           
          </a>
        </LightGallery>
      </div>
    </>
  );
};

export default Wallpaper;
