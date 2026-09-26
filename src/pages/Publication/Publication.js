import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import "./Publication.css";
import SectionTitle from "../../common/SectionTitle/SectionTitle";
import Loader from "../../common/Loader/Loader";
import { fetchPublication } from "../../api/API";
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
import AOS from "aos";
import "aos/dist/aos.css";

const Publication = ({ setIsPublicationLoaded }) => {
  const navigate = useNavigate();

  const handleClick = (id, name) => {
    // navigate(`/publication-detail/${id}/${name}`);
    navigate(`/publication-detail/${id}/${name.toLowerCase()}`);
  };

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchPublication({
          url: process.env.REACT_APP_API_URL,
          page: "home",
        });
        if (response.data.status == true) {
                    setApiData(response.data.responseBody);
                    setLoading(false);
          setIsPublicationLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <>
      <div className="section-padding"></div>
      <div className="publications-bg">
        <Container>
          <div className="spinner-container">
            <SectionTitle
              title="Publications"
              className="white"
              data-aos="fade-up"
            />
            <div className="section-padding"></div>

            <div className="publication-box">
              {!apiData?.publication
                ? // Show shimmer with animation
                  [...Array(4)]?.map((_, index) => (
                    <div
                      className="publication-shimmer-card-data"
                      key={index}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    ></div>
                  ))
                : apiData.publication.map((item, index) => {
                    const colorIndex = (index % 6) + 1;
                    return (
                      <Card
                        className={`publication-card-${colorIndex}`}
                        key={index}
                        onClick={() => handleClick(item.id, item.name)}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="publication-card-content">
                          <div>
                            <img src={item.icon} alt="" />
                          </div>
                          <div>
                            <h6>{item.name}</h6>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Publication;
