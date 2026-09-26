import React, { useState, useEffect } from "react";
import image1 from "../../../assets/images/Satsang App Gopalanand Swamini Vato.jpg";
import image2 from "../../../assets/images/Satsang App Ghanshyam Lilamrut Sagar.jpg";
import image3 from "../../../assets/images/Vachanamrut Kavya.jpg";
import image4 from "../../../assets/images/Satsang App Harililamrut.jpg";
import image5 from "../../../assets/images/Satsang App Bhaktachintamani.jpg";
import image6 from "../../../assets/images/Satsang App Suprabhatam.jpg";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
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
          url: process.env.REACT_APP_API_URL,
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
