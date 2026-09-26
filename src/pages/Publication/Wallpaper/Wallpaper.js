import React, { useState, useEffect } from "react";
import image1 from "../../../assets/images/Satsang App Gopalanand Swamini Vato.jpg";
import image2 from "../../../assets/images/Satsang App Ghanshyam Lilamrut Sagar.jpg";
import image3 from "../../../assets/images/Vachanamrut Kavya.jpg";
import image4 from "../../../assets/images/Satsang App Harililamrut.jpg";
import image5 from "../../../assets/images/Satsang App Bhaktachintamani.jpg";
import image6 from "../../../assets/images/Satsang App Suprabhatam.jpg";
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
import { useNavigate } from "react-router-dom";
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
          url: process.env.REACT_APP_API_URL,
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
