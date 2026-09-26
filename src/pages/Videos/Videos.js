import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { IoCheckmarkSharp } from "react-icons/io5";
import SectionTitle from "../../common/SectionTitle/SectionTitle";
import Loader from "../../common/Loader/Loader";
import { fetchliveVideo } from "../../api/API";
import "./Videos.css";
import YouTubeLiveStatusChecker from "../../common/Youtube/YoutubeStreamer";
import AOS from "aos";
import "aos/dist/aos.css";

const Videos = ({ setIsVideoLoaded }) => {
  const [apiData, setApiData] = useState(null);
  const [liveVideoTitle, setLiveVideoTitle] = useState([]);
  const [liveVideoDescription, setLiveVideoDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Convert YouTube URL to embedded iframe
  const getYoutubeEmbedUrl = (url) => {
    if (url) {
      // Regular expression to match YouTube URL patterns
      const youtubeRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s?]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;

      const match = url.match(youtubeRegex);

      if (match && match[1]) {
        const videoId = match[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return null;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchliveVideo({
        url: process.env.REACT_APP_API_URL,
        page: "home",
      });
      if (response.data.status == true) {
        // setIsVideoLoaded(false);

        setApiData(response.data);
        setLiveVideoTitle(response.data.responseBody.live_setting.title);
        setLiveVideoDescription(
          response?.data?.responseBody?.live_setting?.description
        );
                // console.log(
        //   "responseVideoLive",
        //   apiData.responseBody.live_setting.points
        // );
                setLoading(false);
        // setIsVideoLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      // setIsVideoLoaded(false);
    }
  };

  useEffect(() => {
      }, [apiData]);

  // const youtubeVideoUrl = "https://www.youtube.com/embed/BefAlImecIQ";
  const apiKey = "AIzaSyDEPqey9i1sZFnOGiiE1jqa4tLLH-VC4D8";
  const channelId = "UC1Zzxq60fquqYgOK9RugT1Q";

  const youtubeEmbedUrl = apiData
    ? getYoutubeEmbedUrl(apiData.responseBody.live_setting.youtube_link)
    : null;

  
  return (
    <>
      <div className="section-padding"></div>
      <Container>
        <div className="spinner-container">
          {loading && (
            <div
              className="video-content-wrap shimmer-active"
              data-aos="fade-up"
            >
              <div className="video-inner-content-wrap">
                <div className="shimmer-Data shimmer-card"></div>
              </div>
              <div className="video-inner-content-wrap">
                <div className="shimmer-Data shimmer-title"></div>
                <div className="video-inner-content">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="shimmer-Data shimmer-point"></div>
                  ))}
                </div>
                <div className="shimmer-Data shimmer-description"></div>
              </div>
            </div>
          )}

          {!loading && (
            <div className="video-content-wrap">
              <div
                className="video-inner-content-wrap"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <Card className="live-video-content">
                  <YouTubeLiveStatusChecker
                    channelId={channelId}
                    apiKey={apiKey}
                    fallbackUrl={youtubeEmbedUrl}
                  />
                </Card>
              </div>

              <div
                className="video-inner-content-wrap"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <SectionTitle title={liveVideoTitle} />
                <div className="video-inner-content">
                  <div className="video-content">
                    {apiData?.responseBody?.live_setting?.points?.map(
                      (point, index) => (
                        <div
                          className="video-content-text"
                          key={index}
                          data-aos="fade-up"
                          data-aos-delay={300 + index * 100}
                        >
                          <div className="icon-wrap">
                            <IoCheckmarkSharp className="check-icon" />
                          </div>
                          <div>
                            <h5>{point}</h5>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div
                  style={{ textAlign: "justify" }}
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <p>{liveVideoDescription}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};
export default Videos;
