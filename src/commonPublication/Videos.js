import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import VideoList from "./VideoList";
import AOS from "aos";
import "aos/dist/aos.css";

const Video = ({ publicatioAlbumnData, isAlbum }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
  const params = useParams();
  
  const navigate = useNavigate();

  const handleViewDetailsClick = (id) => {
    navigate(`/publication/${params.id}/video-list/${id}`);
      };

  // if (!publicatioAlbumnData || !publicatioAlbumnData.albums) {
  //   return null;
  // }

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <>
      {isAlbum ? (
        <Grid
          container
          spacing={3}
          justifyContent="center"
          className="katha-content-wrap"
        >
          {publicatioAlbumnData?.map((album) => (
            <Grid key={album.id} item xs={6} sm={6} md={3}>
              <div className="katha-img-wrap" data-aos="fade-up">
                <img
                  src={album.thumbnail_image}
                  alt={album.title}
                  className="katha-img"
                />
                <div className="katha-content">
                  <div>
                    <h4>{album.title}</h4>
                  </div>
                  <div>
                    <p>{album.publication}</p>
                  </div>
                  <div>
                    <button onClick={() => handleViewDetailsClick(album.id)}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <VideoList publicatioAlbumnData={publicatioAlbumnData} />
      )}
    </>
  );
};

export default Video;
