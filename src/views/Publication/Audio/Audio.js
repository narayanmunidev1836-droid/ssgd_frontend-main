"use client";
import React, { useState, useEffect } from "react";
import _image1 from "../../../assets/images/Satsang App Gopalanand Swamini Vato.webp";
const image1 = _image1.src;
import _image2 from "../../../assets/images/Satsang App Ghanshyam Lilamrut Sagar.webp";
const image2 = _image2.src;
import _image3 from "../../../assets/images/Vachanamrut Kavya.webp";
const image3 = _image3.src;
import _image4 from "../../../assets/images/Satsang App Harililamrut.webp";
const image4 = _image4.src;
import _image5 from "../../../assets/images/Satsang App Bhaktachintamani.webp";
const image5 = _image5.src;
import _image6 from "../../../assets/images/Satsang App Suprabhatam.webp";
const image6 = _image6.src;
import Grid from "@mui/material/Grid";
import { useNavigate } from "../../../common/routerCompat.js";
import { fetchPublicationList } from "../../../api/API";

const Audio = (activeTab) => {
  const navigate = useNavigate();
  const [audioList, setAudioList] = useState([]);

  const handleClick = () => {
    navigate("/audio-list");
    // handleButtonClick('Audio', 2);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPublicationList({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "publication",
          order_by: "all",
          publication_id: 2,
        });
        setAudioList(response?.data?.responseBody.albums);
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
        {audioList.map((item, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <div className="katha-img-wrap">
              <img src={item.image} alt="" className="katha-img" />
              <div className="katha-content">
                <div>
                  <h4>Audio</h4>
                </div>
                <div>
                  <p>{item.title}</p>
                </div>
                <div>
                  <button onClick={() => handleClick(item.id)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Grid>
        ))}
        {/* <Grid item xs={6} sm={6} md={3}>
          <div className="katha-img-wrap">
            <img src={image1} alt="" className="katha-img" />
            <div className="katha-content">
              <div>
                <h4>Audio</h4>
              </div>
              <div>
                <p>Suprabhatam</p>
              </div>
              <div>
                <button onClick={handleClick}>View Details</button>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <div className="katha-img-wrap">
            <img src={image2} alt="" className="katha-img" />
            <div className="katha-content">
              <div>
                <h4>Audio</h4>
              </div>
              <div>
                <p>Suprabhatam</p>
              </div>
              <div>
                <button>View Details</button>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <div className="katha-img-wrap">
            <img src={image3} alt="" className="katha-img" />
            <div className="katha-content">
              <div>
                <h4>Audio</h4>
              </div>
              <div>
                <p>Suprabhatam</p>
              </div>
              <div>
                <button>View Details</button>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <div className="katha-img-wrap">
            <img src={image4} alt="" className="katha-img" />
            <div className="katha-content">
              <div>
                <h4>Audio</h4>
              </div>
              <div>
                <p>Suprabhatam</p>
              </div>
              <div>
                <button>View Details</button>
              </div>
            </div>
          </div>
        </Grid> */}
      </Grid>
    </>
  );
};

export default Audio;
