import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import SectionTitle from "../../common/SectionTitle/SectionTitle";
import { GrFormNextLink } from "react-icons/gr";
import AOS from "aos";
import "aos/dist/aos.css";
import { fetchActivitiy } from "../../api/API";
import "./Activities.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Slider from "react-slick";

const Activities = ({ setIsActivityLoaded }) => {
  const navigate = useNavigate();

  // const handleClick = (activity_id) => {
  //   // navigate("/activities");
  //   navigate(`/activities/${activity_id}`);
  // };

  const handleClick = (activity_id, title) => {
    navigate(`/activities/${activity_id}/${title}`);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
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
        url: process.env.REACT_APP_API_URL,
        page: "home",
      });
      if (response.data.status == true) {
        // setIsActivityLoaded(true);
        setApiData(response.data.responseBody.activities);
                setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
      }, [apiData]);

  const sliderSettings = {
    dots: true,
    infinite: true,
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
  };

  return (
    <>
      <div className="section-padding"></div>
      <Container>
        <div className="spinner-container">
          <>
            <SectionTitle title="Activities" />
            <div className="section-padding"></div>
            <Slider {...sliderSettings} className="homeSlider">
              {!apiData || !Object.keys(apiData).length
                ? [...Array(4)].map((_, index) => (
                    <div className="slider-item" key={index} data-aos="fade-up">
                      <div className="slider-item-shimmer">
                        <div className="slider-item-shimmer-text" />
                        <div className="slider-item-shimmer-text small" />
                      </div>
                    </div>
                  ))
                : Object.values(apiData).map((activity) => {
                    const date = new Date(activity.activity_date);
                    const options = { day: "numeric", month: "short" };
                    const formattedDate = date.toLocaleDateString(
                      "en-US",
                      options
                    );
                    const day = date.getDate();
                    const month = formattedDate.split(" ")[0];

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
                            handleClick(activity.activity_id, activity.title)
                          }
                        >
                          <LazyLoadImage
                            src={activity.image}
                            style={{ width: "100%" }}
                            alt={activity.title}
                            className="activities-img-slider home homeActivityImg"
                            wrapperClassName="lazy-load-image-background homeActivityImg"
                            afterLoad={() => {
                              const image = document.querySelector(
                                `.lazy-load-image-background[data-src="${activity.image}"]`
                              );
                              if (image) {
                                image.classList.add("lazy-load-image-loaded");
                              }
                            }}
                          />
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
          </>
        </div>
      </Container>
      <div className="paddingBotomSection"></div>
    </>
  );
};

export default Activities;
