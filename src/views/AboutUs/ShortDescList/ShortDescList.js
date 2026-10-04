"use client";
import react, { useState, useEffect } from "react";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useParams } from "../../../common/routerCompat.js";
import { fetchSantDetails, fetchSlider } from "../../../api/API";
import InnerpageLoader from "../../Home/InnerpageLoader";
import "../Founder.css";
import FullpageLoader from "../../../common/HomeSliderLoader/FullpageLoader";

const ShortDescList = () => {
  const param = useParams();
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us" },
    <label color="text.primary" className="active-link-color">
      {param.name}
    </label>,
  ];

  const [aboutusDetails, setAboutusDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        url: "https://ssgd.srashtasoft.in/",
        sant_id: param.id,
      };
      try {
        const resp = await fetchSantDetails(params);
        if (resp.data.code == 200 || resp.data.code == 201) {
          setAboutusDetails(resp.data.responseBody);
        }
      } catch (error) {
              }
    };

    fetchData();
  }, [param.id]);

  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
      try {
        const response = await fetchSlider({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "about us",
        });
        setBanner(response.data.responseBody);
                setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <div className="contact-img-wrap">
        <div className="spinner-container-banner">
          {!imageLoaded && (
            <div className="shimmer-activity-wrapper">
              <div className="shimmer" />
            </div>
          )}
          <InnerpageLoader
            src={banner}
            className="about-img"
            onImageLoad={handleImageLoad}
          />
        </div>
        {imageLoaded && (
          <div className="breadcrumbs-wrap">
            <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
          </div>
        )}
      </div>

      <Container className="mt-5" style={{ marginTop: "50px" }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <div className="container about-container about-us-content">
              <div>
                <span className="span-bg-color">{aboutusDetails?.name}</span>
              </div>

              <Container>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} sm={12} md={4} lg={3}>
                    <img
                      src={aboutusDetails?.image}
                      alt=""
                      className="founder-img"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={8} lg={9}>
                    <p
                      className="mt-sm-0 mt-md-5 mt-lg-5"
                      dangerouslySetInnerHTML={{
                        __html: aboutusDetails?.description,
                      }}
                    ></p>
                  </Grid>
                </Grid>
              </Container>
              <br></br>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ShortDescList;
