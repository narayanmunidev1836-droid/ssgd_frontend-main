"use client";
import React, { useState, useEffect, Fragment } from "react";
import _image from "../../assets/images/subheader.webp";
const image = _image.src;
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/scss/lightgallery.scss";
import "lightgallery/scss/lg-zoom.scss";
import { FaSearchPlus } from "react-icons/fa";
import _dkBg from "../../assets/images/dailyKathaBackground.webp";
const dkPageBg = _dkBg.src;
import { MdChevronLeft, MdChevronRight, MdCalendarMonth } from "react-icons/md";
import _imageNotFound from "../../assets/images/NoImageFound.webp";
const imageNotFound = _imageNotFound.src;
import { fetchDailyDarshanData, fetchSlider } from "../../api/API";
import Loader from "../../common/Loader/Loader";
import InnerpageLoader from "../Home/InnerpageLoader";
import "./DailyDarshan.css";
import "../DailyKatha/DailyKatha.css";
import Lightbox from "react-image-lightbox";
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

const DailyDarshan = () => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    <label color="text.primary" className="active-link-color">
      Daily Darshan
    </label>,
  ];

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [banner, setBanner] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [rerender, setRerender] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [darshanIndex, setDarshanIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const onInit = () => {
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  const fetchData = async (date) => {
    setLoading(true);
    try {
      var data = {
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "daily",
        type: "darshan",
      };
      if (date) {
        const formattedDate = date.format("MM/DD/YYYY");
        data["date"] = formattedDate;
      }

      const response = await fetchDailyDarshanData(data);
      const dailyData = response.data?.responseBody?.daily;
      if (dailyData && dailyData.length > 0) {
        const firstDailyItem = dailyData[0];
        if (firstDailyItem.date) {
          setSelectedDate(dayjs(firstDailyItem.date, "MM/DD/YYYY"));
        }
        setApiData(dailyData);
        setThumbnailImage(firstDailyItem?.media.thumb_media);
        const dates = response.data.responseBody?.available_dates || [];
        setAvailableDates(dates);
      } else {
        setSelectedDate(null);
        setApiData([]);
        setThumbnailImage(null);
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

  const onChangeSelected = (newValue) => {
    fetchData(newValue);
  };

  // Prev / next move through the dates the API says have a darshan
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
    fetchData(d);
  };

  // useEffect(() => {
  //   console.log("apiData", apiData);
  // }, [apiData]);

  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
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

  const handleDownload = async (e, i) => {
    try {
      const imageUrl = e?.media?.media?.[i];
      if (!imageUrl) {
        console.error("Invalid image URL");
        return;
      }

      const cacheBustingUrl = `${imageUrl}?t=${new Date().getTime()}`;

      const response = await fetch(cacheBustingUrl, { mode: "cors" });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = imageUrl.split("/").pop();
      anchor.target = "_blank";

      document.body.appendChild(anchor);
      anchor.click();

      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading media:", error);
    }
  };

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

      <div className="dd-page dk-page" style={{ "--dk-page-bg": `url('${dkPageBg}')` }}><div className="dd-container">
        <div className="spinner-container">
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
                  <p className="dk-date-day">
                    {selectedDate.format("dddd, DD MMMM YYYY")}
                  </p>
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
                      fetchData(newValue);
                    }}
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

          <div className="d-flex " style={{ flexWrap: "wrap" }}>
            {loading
              ? [...Array(4)].map((_, index) => (
                <div className="dd-cell" key={index}>
                  <div className="slider-item mt-4" key={index}>
                    <div className="slider-item-shimmer">
                      <div
                        className="slider-item-shimmer-text small"
                        style={{ height: "31px" }}
                      />
                    </div>
                  </div>
                </div>
              ))
              : apiData?.map((e, index) => {
                const darshanClass =
                  apiData.length > 1 ? "multiple-darshan" : "";
                return (
                  <Fragment key={index}>
                    <div className={`dk-item-head dd-item-head ${darshanClass}`}>
                      <h3 className="dk-item-title dd-item-title">{e.media.title}</h3>
                      <p className="dk-item-desc dd-item-desc">{e.media.short_description}</p>
                    </div>

                    <div className="dd-grid">
                      {e.media.media.map((mediaItem, i) => {
                        return (
                          <Fragment key={i}>
                            <div className="dd-cell">
                              <div
                                className="wallpaper-content"
                                style={{ width: "100%" }}
                                data-aos="fade-up"
                              >
                                <div
                                  onClick={() => {
                                    setDarshanIndex(index);
                                    setPhotoIndex(i);
                                    setIsOpen(true);
                                  }}
                                >
                                  <LazyLoadImage
                                    src={e.media.media[i]}
                                    alt=""
                                    className="wallpaper-img"
                                    wrapperClassName="lazy-load-image-background aboutustype"
                                    afterLoad={() => {
                                      const image = document.querySelector(
                                        `.lazy-load-image-background[data-src="${e.media.media[i]}"]`
                                      );
                                      if (image) {
                                        image.classList.add(
                                          "lazy-load-image-loaded"
                                        );
                                      }
                                    }}
                                  />
                                  <div className="search-icon">
                                    <FaSearchPlus />
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleDownload(e, i)}
                                  className="mt-2"
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          </Fragment>
                        );
                      })}

                      {isOpen && (
                        <Lightbox
                          mainSrc={
                            apiData[darshanIndex].media.media[photoIndex]
                          }
                          nextSrc={
                            apiData[darshanIndex].media.media[
                            (photoIndex + 1) %
                            apiData[darshanIndex].media.media.length
                            ]
                          }
                          prevSrc={
                            apiData[darshanIndex].media.media[
                            (photoIndex + apiData.length - 1) %
                            apiData[darshanIndex].media.media.length
                            ]
                          }
                          onCloseRequest={() => setIsOpen(false)}
                          onMovePrevRequest={() =>
                            setPhotoIndex(
                              (photoIndex + apiData.length - 1) %
                              apiData[darshanIndex].media.media.length
                            )
                          }
                          onMoveNextRequest={() =>
                            setPhotoIndex(
                              (photoIndex + 1) %
                              apiData[darshanIndex].media.media.length
                            )
                          }
                        />
                      )}
                    </div>
                  </Fragment>
                );
              })}
          </div>
        </div>
      </div></div>
    </>
  );
};

export default DailyDarshan;
