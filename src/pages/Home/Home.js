import React, { useState, useEffect } from "react";
import HomeSlider from "./HomeSlider";
import Videos from "../Videos/Videos";
import Publication from "../Publication/Publication";
import Activities from "../Activities/Activities";
import SantPhotos from "../SantPhotos/SantPhotos";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
import { getPdf } from "../../api/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const [isSliderLoaded, setIsSliderLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPublicationLoaded, setIsPublicationLoaded] = useState(false);
  const [isActivityLoaded, setIsActivityLoaded] = useState(false);
  const [pdfCode, setPdfCode] = useState();


  const notify = (msg) => {
    toast.error(msg, {
      position: "top-right",
    });
  };

  const allLoaded = isSliderLoaded;
  const navigate = useNavigate();


  const location = useLocation();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const params = location.search;
    const paramValue = params.startsWith('?') ? params.substring(1) : params;
        if (paramValue) {
      setPdfCode(paramValue);
    }
  }, [location]);

  useEffect(() => {
    if (pdfCode && pdfCode !== "") {
      const getpdfView = async () => {
        try {
          const response = await getPdf({
            url: apiUrl, pdf_code: pdfCode,
          });
       
  
          let pdfUrl = "";
          if (response.data.status === true) {
          
            pdfUrl = response.data.responseBody.pdf[0]; // Get the first URL from the array
                        navigate(`/view_bill?pdfUrl=${pdfUrl}`);
          } else {
            notify("No PDF Found !!");
            if (location.search) {
              // Remove query parameters by navigating to the same path without them
              navigate(location.pathname, { replace: true });
            }
          }
        } catch (error) {
                  }
      };
      getpdfView();
    }
  }, [pdfCode]);
  
  useEffect(() => {
      AOS.init({
        duration: 1000,
        once: false,
      });
    }, []);
  return (
    <>
      <ToastContainer />
      <div className="container-fluid slider-wrap">
     
        <HomeSlider />
        <Videos />
        <Publication />
        <Activities />
        <SantPhotos />
      </div>
    </>

  );
};

export default Home;
