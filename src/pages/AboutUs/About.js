import React, { useState, useEffect } from "react";
import image from "../../assets/images/subheader.webp";
import image1 from "../../assets/images/swaminarayan.webp";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import SectionTitle from "../../common/SectionTitle/SectionTitle";
import { useNavigate } from "react-router-dom";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Typography from "@mui/material/Typography";
import { MdSquare } from "react-icons/md";
import { useParams } from "react-router-dom";
import { fetchAboutusDetails } from "../../api/API";
import Aboustype1 from "./Aboustype1/Aboustype1";
import Aboustype2 from "./Aboustype2/Aboustype2";
import Aboustype3 from "./Aboustype3/Aboustype3";
import "./About.css";

const About = () => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us" },
    <label color="text.primary" className="active-link-color">
      {/* Lord Swaminarayan */}
    </label>,
  ];

  const [aboutUsData, setAboutUsData] = useState([]);
  const [aboutUsType, setAboutUsType] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchAboutusDetails({
          url: apiUrl,
          page: "about us",
          id: params.id,
        });
        setAboutUsData(response.data.responseBody);
        setAboutUsType(
          response.data.responseBody.about_us_data.select_type_about_us
        );
                                setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {loading ? (
        <>
          <div className="shimmer-activity-wrapper">
            <div className="shimmer" />
          </div>
          <Container className="about-us-page about_us_page">
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={12} md={8}>
                <div className="container about-container about-us-content">
                  <div>
                    <span className="span-bg-color">-</span>
                  </div>
                  <div className="container">
                    <div className="container">
                      <div>
                        <div className="mt-5">
                          <>
                            {" "}
                            <div
                              className="slider-item"
                              style={{ width: "100%" }}
                            >
                              <div
                                className="slider-item-shimmer"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </>
                        </div>

                        {[...Array(10)].map((_, index) => (
                          <div className="slider-item-shimmer-text-about mt-3" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <>
                  <div
                    style={{ cursor: "pointer" }}
                    className="about-us-content-wrap"
                  >
                    <div className="sant-photo-content pt-sm-0">
                      <div
                        className="sant-img-placeholder"
                        style={{ width: "150px", height: "150px" }}
                      ></div>
                      <h4 className="shimmer" style={{ width: "60%" }}></h4>
                    </div>
                    {[...Array(6)].map((_, index) => (
                      <div
                        className="slider-item-shimmer-text-about mt-3"
                        style={{ width: "100%" }}
                      />
                    ))}
                  </div>
                </>
              </Grid>
            </Grid>
          </Container>
        </>
      ) : aboutUsType === "1" ? (
        <Aboustype1 aboutUsData={aboutUsData} dataLoading={loading} />
      ) : aboutUsType === "2" ? (
        <Aboustype2 aboutUsData={aboutUsData} />
      ) : aboutUsType === "3" ? (
        <Aboustype3 aboutUsData={aboutUsData} />
      ) : (
        <p>No matching found for the provided aboutUsType</p>
      )}
    </>
  );
};
export default About;
