import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { fetchPublicationList } from "../../../api/API";

const Video = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoList, setVideoList] = useState([]);
  
  const navigate = useNavigate();

  const handleViewDetailsClick = (id) => {
    navigate(`/video-list/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPublicationList({
          url: process.env.REACT_APP_API_URL,
          page: "publication",
          order_by: "all",
          publication_id: 3,
        });
        setVideoList(response?.data?.responseBody.albums);
              } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        className="katha-content-wrap"
      >
        {videoList.map((video, index) => (
          <Grid key={index} item xs={6} sm={6} md={3}>
            <div className="katha-img-wrap">
              <img src={video.image} alt="" className="katha-img" />
              <div className="katha-content">
                <div>
                  <h4>{video.title}</h4>
                </div>
                <div>
                  <p>{video.title}</p>
                </div>
                <div>
                  <button onClick={() => handleViewDetailsClick(video.id)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Video;
