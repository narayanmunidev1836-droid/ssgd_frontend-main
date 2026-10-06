"use client";
import React, { useState, useEffect } from "react";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import _dkBg from "../../assets/images/dailyKathaBackground.png";
import { MdChevronLeft, MdChevronRight, MdCalendarMonth } from "react-icons/md";
const dkPageBg = _dkBg.src;
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { fetchDailykathaData, fetchSlider } from "../../api/API";
import InnerpageLoader from "../Home/InnerpageLoader";
import "./DailyKatha.css";
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
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchData = async (date) => {
    setLoading(true);
    try {
      var data = {
        url: process.env.NEXT_PUBLIC_API_URL,
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

  // Prev / next move through the dates the API says have a katha
  const dateList = Object.values(availableDates)
    .map((d) => dayjs(String(d).replace(/\\\//g, "/"), "MM/DD/YYYY"))
    .filter((d) => d.isValid())
    .sort((a, b) => a.valueOf() - b.valueOf());
  const currentIdx = selectedDate
    ? dateList.findIndex((d) => d.isSame(selectedDate, "day"))
    : -1;
  const canGoPrev = currentIdx > 0;
  const canGoNext = currentIdx >= 0 && currentIdx < dateList.length - 1;
  const goToDate = (d) => {
    setSelectedDate(d);
    onChangeSelected(d);
  };

  useEffect(() => {
    setLoading(true);
    const fetchBanner = async () => {
      try {
        const response = await fetchSlider({
          url: process.env.NEXT_PUBLIC_API_URL,
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

      <div className="dk-page" style={{ "--dk-page-bg": `url('${dkPageBg}')` }}>
        <div className="dk-container">
          <div className="dk-heading" data-aos="fade-up">
            <h2 className="dk-title">Daily Katha</h2>
          </div>

          {/* Date picker card */}
          <div className="dk-date-card" data-aos="fade-up">
            <button
              type="button"
              className="dk-date-nav"
              aria-label="Previous date"
              disabled={!canGoPrev}
              onClick={() => canGoPrev && goToDate(dateList[currentIdx - 1])}
            >
              <MdChevronLeft />
            </button>
            <div className="dk-date-info">
              <MdCalendarMonth className="dk-date-cal" aria-hidden="true" />
              <div>
                <h4 className="dk-date-value">
                  {selectedDate
                    ? selectedDate.format("MMMM DD, YYYY")
                    : "No date selected"}
                </h4>
                {selectedDate && (
                  <p className="dk-date-day">{selectedDate.format("dddd, DD MMMM YYYY")}</p>
                )}
              </div>
            </div>
            <div className="dk-date-picker">
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
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                      popper: { className: "dk-picker-popper" },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <button
              type="button"
              className="dk-date-nav"
              aria-label="Next date"
              disabled={!canGoNext}
              onClick={() => canGoNext && goToDate(dateList[currentIdx + 1])}
            >
              <MdChevronRight />
            </button>
          </div>

          <div className="spinner-container">
            {loading ? (
              <div className="dk-loading">
                <div className="dk-video shimmer"></div>
              </div>
            ) : (
              <>
                {apiData.map((dailyItem, dailyIndex) => {
                  const mediaList = dailyItem?.media?.media || [];
                  const firstMedia = mediaList[0];
                  const remainingMedia = mediaList.slice(1);

                  return (
                    <section key={dailyIndex} className="dk-item" data-aos="fade-up">
                      <div className="dk-item-head">
                        <h3 className="dk-item-title">{dailyItem?.media?.title}</h3>
                        <p className="dk-item-desc">{dailyItem?.media?.short_description}</p>
                      </div>

                      {/* Main video */}
                      {firstMedia && getYoutubeEmbedUrl(firstMedia) && (
                        <div className="dk-video">
                          <iframe
                            src={getYoutubeEmbedUrl(firstMedia)}
                            title={dailyItem?.media?.title || "YouTube video"}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}

                      {/* Additional videos */}
                      {remainingMedia.length > 0 && (
                        <div className="dk-grid">
                          {remainingMedia.map((mediaItem, mediaIndex) =>
                            getYoutubeEmbedUrl(mediaItem) ? (
                              <div className="dk-card" key={mediaIndex}>
                                <div className="dk-video">
                                  <iframe
                                    src={getYoutubeEmbedUrl(mediaItem)}
                                    title={`Additional Video ${mediaIndex + 1}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                              </div>
                            ) : null
                          )}
                        </div>
                      )}
                    </section>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DailyKatha;
