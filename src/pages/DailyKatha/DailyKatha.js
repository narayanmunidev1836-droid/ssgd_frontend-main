import React, { useState, useEffect } from "react";
import image from "../../assets/images/subheader.jpg";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import image1 from "../../assets/images/date.png";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { fetchDailykathaData, fetchSlider } from "../../api/API";
import Loader from "../../common/Loader/Loader";
import InnerpageLoader from "../Home/InnerpageLoader";
import "./DailyKatha.css";
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
import AOS from "aos";
import "aos/dist/aos.css";

const DailyKatha = () => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    <label color="text.primary" className="active-link-color">
      Daily Katha
    </label>,
  ];

  const [apiData, setApiData] = useState([]);
  const [kathaTitle, setKathaTitle] = useState([]);
  const [kathaDesc, setKathaDesc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
      }, [availableDates]);
  const fetchData = async (date) => {
    setLoading(true);
    try {
      var data = {
        url: process.env.REACT_APP_API_URL,
        page: "daily",
        type: "katha",
      };
      if (date) {
        const formattedDate = date.format("MM/DD/YYYY");
        data["date"] = formattedDate;
      }

      const response = await fetchDailykathaData(data);
      const dailyData = response.data?.responseBody?.daily;
      if (dailyData && dailyData.length > 0) {
        const firstDailyItem = dailyData[0];
        if (firstDailyItem.date) {
          setSelectedDate(dayjs(firstDailyItem.date, "MM/DD/YYYY"));
        }
        setApiData(dailyData);

        const dates = response.data.responseBody?.available_dates || [];
        setAvailableDates(dates);
      } else {
        setSelectedDate(null);
        setApiData([]);

        setAvailableDates([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Convert YouTube URL to embedded iframe
  const getYoutubeEmbedUrl = (url) => {
    if (url) {
      // Regular expression to match YouTube URL patterns including live URLs
      const youtubeRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s?]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\?si=\S+)?$/;

      const match = url.match(youtubeRegex);

      if (match && match[1]) {
        const videoId = match[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Try to handle live URLs with different format
      const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
      if (liveMatch && liveMatch[1]) {
        return `https://www.youtube.com/embed/${liveMatch[1]}`;
      }
    }
    return null;
  };

  const onChangeSelected = (newValue) => {
    fetchData(newValue);
  };

  useEffect(() => {
    setLoading(true);
    const fetchBanner = async () => {
      try {
        const response = await fetchSlider({
          url: process.env.REACT_APP_API_URL,
          page: "daily",
        });
        setBanner(response.data.responseBody);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  //function to calculate the height of the iframe
  const calculateHeight = () => {
    // Assume a default aspect ratio of 16:9 for YouTube videos
    const aspectRatio = 9 / 16;
    const width = document.querySelector(".container").offsetWidth;
    const height = width * aspectRatio;
    return height;
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <>
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

      <Container className="daily-katha">
        <div className="date-picker">
          <div className="date-picker-inner-wrap">
            <div className="date-picker-wrap">
              <div>
                <img src={image1} className="date-picker-img" alt="" />
              </div>
              <div>
                <h4>
                  {selectedDate
                    ? selectedDate.format("MMMM DD, YYYY")
                    : "No date selected"}
                </h4>
              </div>
            </div>
          </div>
          <div className="date-picker-daily-darshan">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                    onChangeSelected(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  shouldDisableDate={(day) => {
                    const formattedDay = dayjs(day).format("MM/DD/YYYY");
                    const availableDatesArray = Object.values(
                      availableDates
                    ).map((date) => date.replace(/\\\//g, "/"));
                    return !availableDatesArray.includes(formattedDay);
                  }}
                  className="katha-date-picker"
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        {/* {loading ? (
          <>
            <div className="shimmer-text" style={{ width: "70%" }} />
            <div className="shimmer-text mt-2" style={{ width: "40%" }} />
          </>
        ) : (
          <div className="darshan-details" data-aos="fade-up">
            <h6>{apiData[0]?.media?.title}</h6>
            <p>{apiData[0]?.media?.short_description}</p>
          </div>
        )} */}

        <div className="spinner-container">
          {loading ? (
            <div className="video-content-wrap shimmer-active mt-4">
              <div className="video-inner-content-wrap">
                <div className="shimmer-Data shimmer-card"></div>
              </div>
            </div>
          ) : (
            <>
              {apiData.map((dailyItem, dailyIndex) => {
                const mediaList = dailyItem?.media?.media || [];
                const firstMedia = mediaList[0];
                const remainingMedia = mediaList.slice(1);

                return (
                  <div key={dailyIndex} data-aos="fade-up">
                    <div className="darshan-details">
                      <h6>{dailyItem?.media?.title}</h6>
                      <p>{dailyItem?.media?.short_description}</p>
                    </div>

                    <div className="daily-media-container">
                      {/* Main Video */}
                      {firstMedia && (
                        <iframe
                          width="100%"
                          height={calculateHeight()}
                          src={getYoutubeEmbedUrl(firstMedia)}
                          title={dailyItem?.media?.title || "YouTube video"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="katha-video"
                        ></iframe>
                      )}

                      {/* Additional Videos */}
                      <Container>
                        <Grid
                          container
                          spacing={3}
                          justifyContent="center"
                          className="daily-katha-video-wrap pt-5"
                        >
                          {remainingMedia.map((mediaItem, mediaIndex) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              key={mediaIndex}
                              style={{ padding: "0px 0px 30px" }}
                            >
                              <Card className="daily-katha-videos">
                                <iframe
                                  width="100%"
                                  height="315"
                                  src={getYoutubeEmbedUrl(mediaItem)}
                                  title={`Additional Video ${mediaIndex + 1}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Container>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default DailyKatha;
