import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import "./Publication.css";
import { fetchPublication } from "../../api/API";
import AOS from "aos";
import "aos/dist/aos.css";

const Publication = ({ setIsPublicationLoaded }) => {
  const navigate = useNavigate();

  const handleClick = (id, name) => {
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
        if (response.data.status === true) {
          setApiData(response.data.responseBody);
          setLoading(false);
          if (setIsPublicationLoaded) setIsPublicationLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <>
      <div className="section-padding"></div>
      <div className="publications-section p-4">
        <Container>
          {/* Section Header */}
          <div className="pub-section-header" data-aos="fade-up">
            <div className="pub-section-heading-wrap">
              <span className="pub-section-icon">🏛</span>
              <div>
                <h2 className="pub-section-title">Our Publications</h2>
                <p className="pub-section-subtitle">
                  Enrich your spiritual journey with inspiring content
                </p>
              </div>
            </div>
            <button
              className="pub-view-all-btn"
              onClick={() => navigate("/publication-detail/5/kirtan")}
            >
              View All &nbsp;&#8594;
            </button>
          </div>

          <div className="publication-box">
            {!apiData?.publication
              ? [...Array(5)].map((_, index) => (
                  <div
                    className="publication-shimmer-card-data"
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  ></div>
                ))
              : apiData.publication.map((item, index) => (
                  <div
                    className="pub-card"
                    key={index}
                    onClick={() => handleClick(item.id, item.name)}
                    data-aos="fade-up"
                    data-aos-delay={index * 80}
                  >
                    <div className="pub-card-icon-wrap">
                      <img src={item.icon} alt={item.name} className="pub-card-icon" />
                    </div>
                    <div className="pub-card-text">
                      <h6 className="pub-card-name">{item.name}</h6>
                      {item.gujarati_name && (
                        <p className="pub-card-gu">{item.gujarati_name}</p>
                      )}
                    </div>
                    <span className="pub-card-arrow">&#8250;</span>
                  </div>
                ))}
          </div>
        </Container>
      </div>
      <div className="section-padding"></div>
    </>
  );
};

export default Publication;
