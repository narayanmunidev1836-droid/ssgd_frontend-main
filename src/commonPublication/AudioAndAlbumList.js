import React, { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const AudioAndAlbumList = ({ publicatioAlbumnData }) => {
  const navigate = useNavigate();
    const handleClick = () => {
    navigate("/audio-list");
    // handleButtonClick('Audio', 2);
  };

  useEffect(() => {
      }, [publicatioAlbumnData]);

  // const handleClick1 = (mediaUrl) => {
  //   console.log("Clicked on audio with media URL:", mediaUrl);
  // };
      useEffect(() => {
          AOS.init({
            duration: 1000,
            once: false,
          });
        }, []);

  return (
    <>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        className="katha-content-wrap"
      >
        {publicatioAlbumnData &&
          publicatioAlbumnData.map((audio, index) => (
            <Grid key={index} item xs={6} sm={6} md={3}>
              <div className="katha-img-wrap" data-aos="fade-up">
                <img src={audio.image} alt="" className="katha-img" />
                <div className="katha-content">
                  <div>
                    <h4>{audio.name ? audio.name : audio.title}</h4>
                  </div>
                  <div>
                    <p>{audio.short_description}</p>
                  </div>
                  <div>
                    {/* <button onClick={() => handleClick1(audio.media[0])}>
                    View Details
                  </button> */}
                  </div>
                </div>
              </div>
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default AudioAndAlbumList;
