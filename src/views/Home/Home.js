"use client";
import React, { useState, useEffect } from "react";
import HomeSlider from "./HomeSlider";
import QuickNavCards from "./QuickNavCards";
import MissionSection from "./MissionSection";
import Videos from "../Videos/Videos";
import Publication from "../Publication/Publication";
import Activities from "../Activities/Activities";
import StatsSection from "./StatsSection";
import SantPhotos from "../SantPhotos/SantPhotos";
import { useLocation, useNavigate } from '../../common/routerCompat.js';
import { getPdf } from "../../api/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CTASection from "./CTASection";
import "./Home.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const [pdfCode, setPdfCode] = useState();

  const notify = (msg) => {
    toast.error(msg, { position: "top-right" });
  };

  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
          const response = await getPdf({ url: apiUrl, pdf_code: pdfCode });
          if (response.data.status === true) {
            const pdfUrl = response.data.responseBody.pdf[0];
            navigate(`/view_bill?pdfUrl=${pdfUrl}`);
          } else {
            notify("No PDF Found !!");
            if (location.search) {
              navigate(location.pathname, { replace: true });
            }
          }
        } catch (error) {}
      };
      getpdfView();
    }
  }, [pdfCode]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, offset: 0 });
  }, []);

  return (
    <>
      <ToastContainer />

      {/* Hero Slider */}
      <HomeSlider />

      <div className="temple-page-bg">
        {/* Quick Navigation Cards */}
        <QuickNavCards />

        {/* Mission Section */}
        <MissionSection />

        {/* Live Events */}
        <div className="live-events-bg-wrap">
          <Videos />
        </div>

        {/* Publications */}
        <Publication />

        {/* Activities */}
        <div className="activities-bg-wrap">
          <Activities />
        </div>

        {/* Stats Counter */}
        <StatsSection />

        {/* Sant Photos / Gallery */}
        <SantPhotos />

        {/* CTA Section */}
        <CTASection />
      </div>
    </>
  );
};

export default Home;
