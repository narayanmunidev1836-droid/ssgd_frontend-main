import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { fetchSantPhotos } from "../../api/API";
import Loader from "../../common/Loader/Loader";
import "./SantPhotos.css";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

function SantPhotos() {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchSantPhotos({
          url: process.env.REACT_APP_API_URL,
          page: "home",
        });
        if (response.data.status == true) {
          setApiData(response?.data?.responseBody);
                    setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(true);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleClick = (item) => {
        navigate(`/about-us/about/${item.details.title}/${item.id}`);
  };
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <>
      <div className="section-padding"></div>
      <div className="sant-bg-image">
        <Container className="container">
          
            <Grid container spacing={2}>
              {loading
                ? Array.from(new Array(3)).map((_, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4} lg={4} data-aos="fade-up">
                      <div className="sant-photo-content pt-sm-0" >
                        <div className="sant-img-placeholder"></div>
                        <h4 className="shimmer" style={{ width: "60%" }}></h4>
                        <p className="shimmer" style={{ width: "80%" }}></p>
                      </div>
                    </Grid>
                  ))
                : apiData.map((item, index) => (
                    <Grid
                      key={index}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      className={index !== 0 ? "pt-5-mobile" : ""}
                      data-aos="fade-up"
                    >
                      <div
                        className="sant-photo-content pt-sm-0"
                       
                        onClick={() => handleClick(item)}
                      >
                        <LazyLoadImage
                          src={item.details.image}
                          alt={item.details.title}
                          className="sant-img"
                          wrapperClassName="lazy-load-image-background"
                          afterLoad={() => {
                            const image = document.querySelector(
                              `.lazy-load-image-background[data-src="${item.details.image}"]`
                            );
                            if (image) {
                              image.classList.add("lazy-load-image-loaded");
                            }
                          }}
                        />
                        <h4>{item.details.title}</h4>
                        <p
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        ></p>
                      </div>
                    </Grid>
                  ))}
            </Grid>
          
        </Container>
      </div>
      <div className="section-padding"></div>
    </>
  );
}

export default SantPhotos;
