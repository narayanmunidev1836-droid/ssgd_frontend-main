import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { GrPrevious, GrNext } from "react-icons/gr";
import "./Home.css";
import { fetchSlider } from "../../api/API";

const HomeSlider = () => {
  const CustomPrevArrow = (props) => (
    <div {...props} className="custom-prev-arrow">
      <GrPrevious className="custom-prev-icon" />
    </div>
  );

  const CustomNextArrow = (props) => (
    <div {...props} className="custom-next-arrow">
      <GrNext className="custom-next-icon" />
    </div>
  );

  const [sliderSettings, setSliderSettings] = useState({
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplaySpeed: 2000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  });

  const [apiData, setApiData] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [loading, setLoading] = useState(true);

  
  const fetchData = async () => {
    try {
      const response = await fetchSlider({
        url: process.env.REACT_APP_API_URL,
        page: "home",
      });
      if (response.data.code === 200 || response.data.code === 201) {
        setApiData(response.data.responseBody);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
      };

  return (
    <div className="container-fluid slider-wrap">
      {loading ? (
        <div className="homeSlideerShimmer">
          <div className="shimmer-wrapper " style={{height:"100%"}}>
            <div className="shimmer" />
          </div>
        </div>
      ) : (
        <Slider {...sliderSettings} className="slider-buttons">
          {apiData.map((image, index) => (
            <div key={index}>
              <div className="lazy-load-container" data-aos="zoom-in">
                <img
                  src={image}
                  alt="Slide"
                  style={{ width: "100%", height: "auto" }}
                  className="slider-img"
                  onLoad={handleImageLoad}
                />
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default HomeSlider;
