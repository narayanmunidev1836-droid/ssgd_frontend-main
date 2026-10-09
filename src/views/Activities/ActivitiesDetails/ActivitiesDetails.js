"use client";
import React, { useEffect, useRef, useState } from "react";
import _image7 from "../../../assets/images/date.webp";
const image7 = _image7.src;
import Container from "@mui/material/Container";
import Slider from "react-slick";
import Card from "@mui/material/Card";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { Link, useParams } from "../../../common/routerCompat.js";
import { fetchActivitiyDetails } from "../../../api/API";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { FaSearchPlus } from "react-icons/fa";
import _imageNotFound from "../../../assets/images/NoImageFound.webp";
const imageNotFound = _imageNotFound.src;
import dayjs from "dayjs";
import "./ActivitiesDetails.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Grid } from "@mui/material";

const ActivitiesDetails = () => {
  const [apiData, setApiData] = useState([]);
  const [activityDetails, setActivityDetails] = useState({
    title: "",
    date: "",
  });
  const { title, description } = useParams();
  const [photoGallery, setPhotoGallery] = useState([]);
  const [activityDate, setActivityDate] = useState(dayjs());
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [sliderLength, setSliderLength] = useState(0);
  const [eventImages, setEventImages] = useState({});
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [thumbPhotoGallery, setThumbPhotoGallery] = useState([]);
  const [activityData, setACtivityData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const latestRequestRef = useRef(null);
  const [activityName, setActivityName] = useState([]);

  const params = useParams();
  useEffect(() => {
    fetchData(params.id, params.activity_id);
  }, [params]);


  const CustomPrevArrow = (props) => (
    <div {...props} className="custom-prev-arrow_1">
      <GrPrevious size={20} />
    </div>
  );

  const CustomNextvArrow = (props) => (
    <div {...props} className="custom-next-arrow_1">
      <GrNext size={20} />
    </div>
  );

  const [sliderSettings, setSliderSettings] = useState({
    dots: true,
    infinite: sliderLength >= 4 ? true : false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextvArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 899,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  const breadcrumbsData = [
    { label: "Home", url: "/" },
    {
      label: "Activities",
      url: `/activities`,
    },
    {
      label: apiData?.activity?.name,
      url: `/activities/${apiData?.details?.activity_id}/${apiData?.activity?.name}`,
    },
    <label color="text.primary" className="active-link-color">
      {apiData?.details?.title}
    </label>,
  ];

  const fetchData = async (id, activity_id) => {
    const requestKey = `${id}_${activity_id}`;
    latestRequestRef.current = requestKey;
    setDataLoading(true);
    try {
      const response = await fetchActivitiyDetails({
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "activity",
        activity_details_id: id,
        activity_id: activity_id,
      });
      if (latestRequestRef.current !== requestKey) {
        // A newer request started after this one; ignore this stale response.
        return;
      }
      if (response.data.status == true) {
        setApiData(response.data.responseBody);
        // setActivityTitle(response.data.responseBody.details.title);
        setActivityDetails({
          title: response.data.responseBody.details.title,
          date: response.data.responseBody.details.activity_date,
        });
        const photosArray = JSON.parse(
          response.data.responseBody.details.photos_gallery
        );
        setPhotoGallery(photosArray);
        setThumbnailImage(response.data.responseBody.details.thumbnail_image);
        setThumbPhotoGallery(
          JSON.parse(response.data.responseBody.details.thumb_photos_gallery)
        );

        // setActivityDate(response.data.responseBody.details.activity_date);
        setActivityDate(
          dayjs(response.data.responseBody.details.activity_date)
        );
        const sameCategoryEvents = (
          response.data.responseBody.relevent_details || []
        ).filter(
          (event) => String(event.activity_id) === String(activity_id)
        );
        setRelatedEvents(sameCategoryEvents);
        setSliderLength(sameCategoryEvents.length);
        setDataLoading(false);
        setACtivityData(response.data.responseBody.details);
        setActivityName(response.data.responseBody.activity);
      }
    } catch (error) {
      if (latestRequestRef.current === requestKey) {
        setDataLoading(false);
      }
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);
  // const formattedDate = activityDate.format("MM/DD/YYYY");

  useEffect(() => {
  }, [apiData]);

  const getThumbnailImage = (index) => {
    if (thumbPhotoGallery) {
      if (Array.isArray(thumbPhotoGallery) && thumbPhotoGallery.length >= 0) {
        return thumbPhotoGallery[index];
      }
    }
    return imageNotFound;
  };

  const date = new Date(activityData.activity_date);
  const options = { day: "numeric", month: "short" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const day = date.getDate();
  const month = formattedDate.split(" ")[0];

  useEffect(() => {
    if (relatedEvents.length > 0) {
      setSliderSettings((prevState) => ({
        ...prevState,
        infinite: relatedEvents.length >= 4,
      }));
    }
  }, [relatedEvents]);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <div className="temple-page-bg">
      <div className="contact-img-wrap no-banner-head">
        <div className="breadcrumbs-wrap">
          <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
        </div>
      </div>

      {/* ===================================== */}

      <Container className="sub-title">
        <div>
          <div>
            {dataLoading ? (
              <>
                <div
                  className="activity-details-shimmer"
                  data-aos="fade-up"
                ></div>
              </>
            ) : Array.isArray(activityData) ? (
              activityData.map((activity, index) => {
                return (
                  <>
                    <div key={index}>
                      <div className="activitydetails-image" data-aos="fade-up">
                        <LazyLoadImage
                          src={activity.image}
                          alt={activity.title}
                          className="activity-details-image mt-5"
                          // effect="blur"
                          wrapperClassName="lazy-load-image-background"
                          afterLoad={() => {
                            const image = document.querySelector(
                              `.lazy-load-image-background[data-src="${activity.image}"]`
                            );
                            if (image) {
                              image.classList.add("lazy-load-image-loaded");
                            }
                          }}
                        />
                      </div>
                      {index === 0 ? (
                        <h1 className="activities-name">{activity.title}</h1>
                      ) : (
                        <h2 className="activities-name">{activity.title}</h2>
                      )}
                      <div className="activities-decs">
                        {activity.short_description}
                      </div>
                      <p>{day}</p>
                    </div>
                  </>
                );
              })
            ) : (
              <div className="activitydetails-image" data-aos="fade-up">
                <LazyLoadImage
                  src={activityData.image || activityData.image}
                  alt={activityData.title}
                  className="activity-details-image"
                  wrapperClassName="lazy-load-image-background"
                  afterLoad={() => {
                    const image = document.querySelector(
                      `.lazy-load-image-background[data-src="${activityData.image || activityData.image
                      }"]`
                    );
                    if (image) {
                      image.classList.add("lazy-load-image-loaded");
                    }
                  }}
                />
                <h1 className="activities-name">{activityData.title}</h1>
                <div className="activities-decs">
                  {activityData.description}
                </div>
                <div className="activities-date">
                  <div>
                    <h5>{day}</h5>
                  </div>
                  <div>
                    <p>{month}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <hr></hr>

        {/* ===================================== */}
        <div className="date-picker-wrap">
          <div>
            <img src={image7} alt="" aria-hidden="true" className="date-picker-img" />
          </div>
          <div>
            <h5>{activityDate.format("MMMM DD, YYYY")}</h5>
          </div>
        </div>
        <div className="gallery-title">{/* <h4>{title}</h4> */}</div>

        <Container style={{ margin: "0 auto", display: "contents" }}>
          {dataLoading ? (
            <div className="pt-0 section-padding">
              <div className="gallery-shimmer-wrapper">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="wallpaper-content-shimmer"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-0 section-padding" data-aos="fade-up">
              <LightGallery
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
                download={false}
              >
                {photoGallery.map((image, index) => (
                  <a
                    key={index}
                    href={image}
                    className="wallpaper-content"
                    style={{ width: "auto" }}
                  >
                    <img
                      alt="Images"
                      src={getThumbnailImage(index)}
                      className="activities-img-thumbnail"
                      onError={(e) => {
                        e.target.src = imageNotFound;
                      }}
                    />
                    <div className="search-icon">
                      <FaSearchPlus />
                    </div>
                  </a>
                ))}
              </LightGallery>
            </div>
          )}
        </Container>
      </Container>
      {/* ===================================== */}

      <Container className="sub-title">
        <h6>Related Event</h6>
        <Slider {...sliderSettings} className="slider-margin">
          {dataLoading ? (
            [...Array(4)].map((_, index) => (
              <div className="slider-item" key={index} data-aos="fade-up">
                <div className="slider-item-shimmer">
                  <div className="slider-item-shimmer-text" />
                  <div className="slider-item-shimmer-text small" />
                </div>
              </div>
            ))
          ) : relatedEvents ? (
            relatedEvents.map((event, index) => {
              const date = new Date(event.activity_date);
              const options = { day: "numeric", month: "short" };
              const formattedDate = date.toLocaleDateString("en-US", options);
              const day = date.getDate();
              const month = formattedDate.split(" ")[0];
              return event.activity_name ? (
                <Grid item xs={6} sm={6} md={4} key={index} className="slider-item">
                  <Link
                    to={`/activities-detail/${event.activity_id}/${event.id}`}
                    className="related-activity-link"
                  >
                    <Card
                      className="activities-inner-content-wrap h-100"
                      data-aos="fade-up"
                    >
                      <div className="detail-act-img-wrap">
                        <LazyLoadImage
                          src={
                            event
                              ? event.image !== ""
                                ? event.image
                                : imageNotFound
                              : imageNotFound
                          }
                          className="activities-img-slider"
                          wrapperClassName="lazy-load-image-background aboutustype"
                          afterLoad={() => {
                            const imageElement = document.querySelector(
                              `.lazy-load-image-background[data-src="${event ? event.thumbnail_image : imageNotFound
                              }"] img`
                            );
                            if (imageElement) {
                              imageElement.classList.add("lazy-load-image-loaded");
                            }
                          }}
                          onError={(e) => {
                            e.target.src = imageNotFound;
                          }}
                        />
                      </div>

                      <div className="activities-inner-content-slider">
                        <p className="sub-activites-name">
                          {event.activity_name}
                        </p>

                        <h4 className="sub-activities-title">{event.title}</h4>
                        <h6 className="sub-activities-desc">
                          {event.short_description ? event.short_description : <span style={{ opacity: 0 }}>...</span>}
                        </h6>
                      </div>
                      <div className="activities-date">
                        <div>
                          <h5>{day}</h5>
                        </div>
                        <div>
                          <p>{month}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </Grid>
              ) : (
                ""
              );
            })
          ) : (
            <div className="no-data">No data available</div>
          )}

          {/* =========================== */}
        </Slider>
      </Container>
    </div>
  );
};

export default ActivitiesDetails;
