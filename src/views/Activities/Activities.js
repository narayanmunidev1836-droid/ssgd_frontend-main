"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "../../common/routerCompat.js";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import AOS from "aos";
import "aos/dist/aos.css";
import { fetchActivitiy } from "../../api/API";
import "./Activities.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Slider from "react-slick";
import _ElegantImage from "../../assets/images/Elegant Temple Background.webp";
const ElegantImage = _ElegantImage.src;

const Activities = ({ setIsActivityLoaded }) => {
  const navigate = useNavigate();

  const handleClick = (activity_id, title) => {
    navigate(`/activities/${activity_id}/${title}`);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 0,
    });
  }, []);

  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetchActivitiy({
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "home",
      });

      if (response.data.status === true) {
        setApiData(response.data.responseBody.activities);
        setLoading(false);

        if (setIsActivityLoaded) {
          setIsActivityLoaded(true);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    arrows: false,
    slidesToShow: 4,
    cssEase: "linear",
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
          slidesToScroll: 1,
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
  };

  const hasActivities =
    apiData && Object.keys(apiData).length > 0;

  return (
    <>

      <section
        className="activities-background-section"
        style={{
          backgroundImage: `url("${ElegantImage}")`,
        }}
      >
        <Container>
          <div className="activities-background-overlay">
            <div
              className="activities-section-header"
              data-aos="fade-up"
            >
              <div className="activities-heading-wrap">
                <div>
                  <h2 className="activities-section-title">
                    Our Activities
                  </h2>

                  <p className="activities-section-subtitle">
                    Serving society through diverse initiatives
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="activities-view-all-btn"
                onClick={() => navigate("/activities")}
              >
                View All&nbsp;&nbsp;→
              </button>
            </div>

            <div className="activities-slider-spacing"></div>

            <Slider {...sliderSettings} className="homeSlider">
              {!hasActivities
                ? [...Array(4)].map((_, index) => (
                  <div
                    className="slider-item"
                    key={index}
                  >
                    <div className="slider-item-shimmer">
                      <div className="slider-item-shimmer-text" />
                      <div className="slider-item-shimmer-text small" />
                    </div>
                  </div>
                ))
                : Object.values(apiData).map((activity) => {
                  const date = new Date(activity.activity_date);

                  const options = {
                    day: "numeric",
                    month: "short",
                  };

                  const formattedDate =
                    date.toLocaleDateString(
                      "en-US",
                      options
                    );

                  const day = date.getDate();
                  const month =
                    formattedDate.split(" ")[0];

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={activity.id}
                      className="px-3 slider-item"
                    >
                      <Card
                        className="activities-inner-content-wrap h-100"
                        data-aos="fade-up"
                        onClick={() =>
                          handleClick(
                            activity.activity_id,
                            activity.title
                          )
                        }
                      >
                        <div className="act-img-wrap">
                          <LazyLoadImage
                            src={activity.image}
                            style={{ width: "100%" }}
                            alt={activity.title}
                            className="activities-img-slider home homeActivityImg"
                            wrapperClassName="lazy-load-image-background homeActivityImg"
                          />
                        </div>

                        <div className="activities-inner-content-slider">
                          <p className="sub-activites-name">
                            {activity.name}
                          </p>

                          <h4 className="sub-activities-title">
                            {activity.title}
                          </h4>

                          <h6 className="sub-activities-desc">
                            {activity.short_description}
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
                    </Grid>
                  );
                })}
            </Slider>
          </div>
        </Container>
      </section>

    </>
  );
};

export default Activities;
