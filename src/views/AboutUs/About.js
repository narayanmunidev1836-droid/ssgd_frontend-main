"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "../../common/routerCompat.js";
import { fetchAboutusDetails } from "../../api/API";
import Aboustype1 from "./Aboustype1/Aboustype1";
import Aboustype2 from "./Aboustype2/Aboustype2";
import Aboustype3 from "./Aboustype3/Aboustype3";
import "./About.css";

// Skeleton that mirrors the Aboustype1 layout, so the page doesn't change shape when data arrives
const AboutSkeleton = () => (
  <>
    <div className="contact-img-wrap">
      <div className="spinner-container-banner">
        <div className="shimmer-activity-wrapper">
          <div className="shimmer" />
        </div>
      </div>
    </div>
    <div className="at1-page">
      <div className="at1-container">
        <div className="at1-layout">
          <div className="at1-main">
            <section className="at1-section">
              <div className="at1-skel shimmer at1-skel-title" />
              <div className="at1-skel shimmer at1-skel-photo" />
              {[...Array(6)].map((_, index) => (
                <div key={index} className="at1-skel shimmer at1-skel-line" />
              ))}
            </section>
          </div>
          <aside className="at1-side">
            <div className="at1-highlight">
              <div className="at1-skel shimmer at1-skel-photo" />
              <div className="at1-highlight-body">
                <div className="at1-skel shimmer at1-skel-title" />
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="at1-skel shimmer at1-skel-line" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </>
);

const About = () => {

  const [aboutUsData, setAboutUsData] = useState([]);
  const [aboutUsType, setAboutUsType] = useState([]);
  // Start in the loading state so the "no match" message never flashes before the data arrives
  const [loading, setLoading] = useState(true);

  const params = useParams();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const response = await fetchAboutusDetails({
          url: apiUrl,
          page: "about us",
          id: params.id,
        });
        setAboutUsData(response.data.responseBody);
        setAboutUsType(
          response.data.responseBody.about_us_data.select_type_about_us
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [reloadKey]);

  return (
    <>
      {loading ? (
        <AboutSkeleton />
      ) : loadError ? (
        <div className="at-load-error">
          <p>Could not load this page. Please check your connection and try again.</p>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)}>
            Try again
          </button>
        </div>
      ) : aboutUsType === "1" ? (
        <Aboustype1 aboutUsData={aboutUsData} dataLoading={loading} />
      ) : aboutUsType === "2" ? (
        <Aboustype2 aboutUsData={aboutUsData} />
      ) : aboutUsType === "3" ? (
        <Aboustype3 aboutUsData={aboutUsData} />
      ) : (
        <p>No matching found for the provided aboutUsType</p>
      )}
    </>
  );
};
export default About;
