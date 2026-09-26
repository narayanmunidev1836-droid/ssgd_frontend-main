import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import image from "../assets/images/subheader.jpg";
import CommonBreadcrumbs from "../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Dialog from "../common/Dialog/Dialog";
import { useParams } from "react-router-dom";
import { fetchPublicationDetails } from "../api/API";
import AOS from "aos";
import "aos/dist/aos.css";

const VideoList = () => {
  const params = useParams();
    const breadcrumbsData = [
    { label: "Home", url: "/" },
    {
      label: "Video",
      url: `/publication-detail/${params.publicationid}/video`,
    },
    <label color="text.primary" className="active-link-color">
      Videos
    </label>,
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoDetailsList, setVideoDetailsList] = useState([]);
  
  const { id } = useParams();
  
  const handleViewDetailsClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPublicationDetails({
          url: process.env.REACT_APP_API_URL,
          page: "publication",
          album_id: id,
        });
        setVideoDetailsList(response.data.responseBody.list);
              } catch (error) {
        console.error("Error fetching data:", error);
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
      <div className="contact-img-wrap">
        <img src={image} alt="" className="about-img" />
        <div className="breadcrumbs-wrap">
          <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
        </div>
      </div>
      <div className="section-padding"></div>
      <Container>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          className="katha-content-wrap"
        >
          {videoDetailsList.map((item, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <div className="katha-img-wrap" data-aos="fade-up">
                <img src={item.image} alt="" className="katha-img" />
                <div className="katha-content">
                  <div>
                    <h4>{item.name}</h4>
                  </div>
                  <div>
                    <p>{item.short_description}</p>
                  </div>
                  <div>
                    <button onClick={() => handleViewDetailsClick(item.id)}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
      {isModalOpen && <Dialog onClose={handleCloseModal} />}
    </>
  );
};

export default VideoList;
