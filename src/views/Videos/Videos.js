"use client";
import React, { useEffect, useState } from "react";
import { fetchliveVideo } from "../../api/API";
import "./Videos.css";
import YouTubeLiveStatusChecker from "../../common/Youtube/YoutubeStreamer";
import AOS from "aos";
import "aos/dist/aos.css";

const TABS = ["Sagar katha", "Evening katha", "Festivals"];

const Videos = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const getYoutubeEmbedUrl = (url) => {
    if (url) {
      const youtubeRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s?]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    return null;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchliveVideo({
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "home",
      });
      if (response.data.status === true) {
        setApiData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const apiKey = "AIzaSyDEPqey9i1sZFnOGiiE1jqa4tLLH-VC4D8";
  const channelId = "UC1Zzxq60fquqYgOK9RugT1Q";
  const youtubeEmbedUrl = apiData
    ? getYoutubeEmbedUrl(apiData.responseBody.live_setting.youtube_link)
    : null;

  const liveTitle = apiData?.responseBody?.live_setting?.title || "";
  const liveDescription = apiData?.responseBody?.live_setting?.description || "";

  return (
    <>
      <div className="section-padding"></div>
      <div className="container-fluid">
        <div className="spinner-container">
          <div className="live-events-section-wrap">
          {loading ? (
            /* Shimmer */
            <div className="video-content-wrap shimmer-active" data-aos="fade-up">
              <div className="video-inner-content-wrap">
                <div className="shimmer-Data shimmer-card"></div>
              </div>
              <div className="video-inner-content-wrap">
                <div className="shimmer-Data shimmer-title"></div>
                <div className="shimmer-Data shimmer-tabs"></div>
                <div className="shimmer-Data shimmer-description"></div>
              </div>
            </div>
          ) : (
            <div className="video-content-wrap">
              {/* Left: Video Player */}
              <div
                className="video-inner-content-wrap"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <div className="live-video-card">
                  <YouTubeLiveStatusChecker
                    channelId={channelId}
                    apiKey={apiKey}
                    fallbackUrl={youtubeEmbedUrl}
                  />
                </div>
              </div>

              {/* Right: Live Events Info */}
              <div
                className="video-inner-content-wrap live-events-panel"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {/* Header */}
                <div className="live-events-header">
                  <span className="live-dot"></span>
                  <h3 className="live-events-title">LIVE EVENTS</h3>
                </div>

                {/* Tabs */}
                <div className="live-tabs">
                  {TABS.map((tab, i) => (
                    <button
                      key={i}
                      className={`live-tab-btn${activeTab === i ? " active" : ""}`}
                      onClick={() => setActiveTab(i)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="live-tab-content">
                  {activeTab === 0 ? (
                    <>
                      <p className="live-tab-desc">{liveDescription || liveTitle}</p>
                      <button
                        className="live-watch-btn"
                        onClick={() => {
                          const url = apiData?.responseBody?.live_setting?.youtube_link;
                          if (url) window.open(url, "_blank", "noopener noreferrer");
                        }}
                      >
                        Watch Live &nbsp;&#8594;
                      </button>
                    </>
                  ) : (
                    <p className="live-tab-desc live-tab-soon">
                      Stay tuned for upcoming {TABS[activeTab]} events.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Videos;
