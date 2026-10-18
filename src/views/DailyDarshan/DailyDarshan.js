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

// The API tells the darshans apart only by media.short_description
// ("Mangla Darshan", "Shringar Darshan", "Shayan Darshan"), and a date may
// carry only some of them, so tabs are built from whatever comes back.
const DARSHAN_ORDER = ["mangla", "shringar", "shayan"];

const darshanKey = (label) => {
  const s = String(label || "").toLowerCase();
  if (s.includes("mang")) return "mangla";
  if (s.includes("ring") || s.includes("rung") || s.includes("shang")) return "shringar";
  if (s.includes("shayan") || s.includes("shyan")) return "shayan";
  return s.trim() || "darshan";
};

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
  const [pickerOpen, setPickerOpen] = useState(false);
  const [banner, setBanner] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [rerender, setRerender] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeKey, setActiveKey] = useState(null);
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

  // One tab per darshan type present in the response; items of the same type
  // (a date can repeat one) are merged and their photos de-duplicated.
  const darshanTabs = (() => {
    const groups = {};
    apiData.forEach((item) => {
      const label = item.media?.short_description;
      const key = darshanKey(label);
      if (!groups[key]) groups[key] = { key, label: label || "Darshan", images: [] };
      (item.media?.media || []).forEach((url) => {
        if (!groups[key].images.includes(url)) groups[key].images.push(url);
      });
    });
    const rank = (key) => {
      const i = DARSHAN_ORDER.indexOf(key);
      return i === -1 ? DARSHAN_ORDER.length : i;
    };
    return Object.values(groups)
      .filter((g) => g.images.length > 0)
      .sort((a, b) => rank(a.key) - rank(b.key));
  })();
  const activeTab =
    darshanTabs.find((t) => t.key === activeKey) || darshanTabs[0];
  // Title is null on some items, so take the first one that has it
  const darshanTitle = apiData.map((item) => item.media?.title).find(Boolean);

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

  const handleDownload = async (imageUrl) => {
    try {
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
                    {selectedDate.format("dddd")}
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
                    open={pickerOpen}
                    onOpen={() => setPickerOpen(true)}
                    onClose={() => setPickerOpen(false)}
                    slotProps={{
                      // Clicking anywhere in the field opens the calendar, not just the icon
                      textField: {
                        size: "small",
                        fullWidth: true,
                        onClick: () => setPickerOpen(true),
                      },
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
              ? (
                <div className="dd-grid" style={{ width: "100%" }}>
                  {[...Array(4)].map((_, index) => (
                    <div className="dd-cell" key={index}>
                      <div className="slider-item mt-4">
                        <div className="slider-item-shimmer">
                          <div
                            className="slider-item-shimmer-text small"
                            style={{ height: "31px" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
              : activeTab && (
                <>
                  {darshanTitle && (
                    <div className="dk-item-head dd-item-head">
                      <h3 className="dk-item-title dd-item-title">{darshanTitle}</h3>
                    </div>
                  )}

                  <div className="dd-tabs" role="tablist">
                    {darshanTabs.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={tab.key === activeTab.key}
                        className={`dd-tab-btn ${tab.key === activeTab.key ? "active" : ""}`}
                        onClick={() => setActiveKey(tab.key)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="dd-grid">
                    {activeTab.images.map((imageUrl, i) => {
                      return (
                        <Fragment key={imageUrl}>
                          <div className="dd-cell">
                            <div
                              className="wallpaper-content"
                              style={{ width: "100%" }}
                              data-aos="fade-up"
                              data-aos-offset="0"
                            >
                              <div
                                onClick={() => {
                                  setPhotoIndex(i);
                                  setIsOpen(true);
                                }}
                              >
                                <LazyLoadImage
                                  src={imageUrl}
                                  alt=""
                                  className="wallpaper-img"
                                  wrapperClassName="lazy-load-image-background aboutustype"
                                  afterLoad={() => {
                                    const image = document.querySelector(
                                      `.lazy-load-image-background[data-src="${imageUrl}"]`
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
                                onClick={() => handleDownload(imageUrl)}
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
                        mainSrc={activeTab.images[photoIndex]}
                        nextSrc={
                          activeTab.images[
                          (photoIndex + 1) % activeTab.images.length
                          ]
                        }
                        prevSrc={
                          activeTab.images[
                          (photoIndex + activeTab.images.length - 1) %
                          activeTab.images.length
                          ]
                        }
                        onCloseRequest={() => setIsOpen(false)}
                        onMovePrevRequest={() =>
                          setPhotoIndex(
                            (photoIndex + activeTab.images.length - 1) %
                            activeTab.images.length
                          )
                        }
                        onMoveNextRequest={() =>
                          setPhotoIndex(
                            (photoIndex + 1) % activeTab.images.length
                          )
                        }
                      />
                    )}
                  </div>
                </>
              )}
          </div>
        </div>
      </div></div>
    </>
  );
};

export default DailyDarshan;
