import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { SlLocationPin } from "react-icons/sl";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
// import NavbarLogo from "../../assets/images/logo.webp";
import image from "../../assets/images/logo (1).webp";
import image1 from "../../assets/images/note (1).webp";
import image2 from "../../assets/images/facebook (5).webp";
import image3 from "../../assets/images/whatsapp.webp";
import image4 from "../../assets/images/youtube.webp";
import image5 from "../../assets/images/instagram (3).webp";
import image6 from "../../assets/images/spotify (1).webp";
import image7 from "../../assets/images/telegram.webp";
import image8 from "../../assets/images/logos.webp";
import image9 from "../../assets/images/icons8-jiosaavn-20.webp";
import { fetchFooterData, fetchNavbarData } from "../../api/API";
import "./Footer.css";
import NavbarLoader from "../../common/NavbarLoader/NavbarLoader";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const [apiData, setApiData] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [donation, setdonation] = useState();
  const [publicationList, setPublicationList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchFooterData({
        url: process.env.REACT_APP_API_URL,
      });
      if (response.data.status == true) {
        setApiData(response.data.responseBody);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEmailClick = () => {
    if (apiData && apiData.email) {
      window.location.href = `mailto:${apiData.email}`;
    } else {
      console.error("No email found in apiData");
    }
  };

  const handleContactClick = () => {
    window.open(`tel:${apiData?.mobile_number}`);
  };

  useEffect(() => {
    const storedSiteName = localStorage.getItem("siteName");
    setSiteName(storedSiteName);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNavbarData({
          url: process.env.REACT_APP_API_URL,
        });
        setdonation(response.data?.responseBody?.site?.donation);
        setPublicationList(response.data?.responseBody?.nav_publication || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePageClick = async (id, name) => {
    window.location.href = `/custome-page/${name}/${id}`;
  };

  return (
    <>
      <div className="footer-bg">
        <Container>
          <Grid container spacing={4} className="footer-wrap">
            <Grid item lg={5} md={6} sm={6} xs={12} className="footer-info">
              <a href="/" className="logo d-flex align-items-center">
                <a className="navbar-brand" href="/">
                  {/* <img
                    src={apiData?.footer_logo}
                    alt="logo"
                    className="logo-footer"
                  /> */}
                  {loading ? (
                     <div className="footer-logo-shimmer" />
                  ) : (
                    <img
                      src={apiData.footer_logo}
                      alt="logo"
                      className="logo-footer"
                    />
                  )}
                </a>
              </a>
              <ul className="footer-link-wrap mt-4">
  <li className="footer-link-wrap1">
    <div>
      <SlLocationPin className="footer-icon" />
    </div>
    {loading ? (
      <div className="footer-shimmer-line" />
    ) : (
      <p>{apiData?.address}</p>
    )}
  </li>

  <li className="footer-link-wrap1">
    <div>
      <FiPhone className="footer-icon" />
    </div>
    {loading ? (
      <div className="footer-shimmer-line" />
    ) : (
      <p onClick={handleContactClick} className="footer-link">
        {apiData?.mobile_number}
      </p>
    )}
  </li>

  <li className="footer-link-wrap1">
    <div>
      <MdOutlineEmail className="footer-icon" />
    </div>
    {loading ? (
      <div className="footer-shimmer-line" />
    ) : (
      <p onClick={handleEmailClick} className="footer-link">
        {apiData?.email}
      </p>
    )}
  </li>
</ul>

            </Grid>

            <Grid
              item
              lg={4}
              md={6}
              sm={6}
              xs={12}
              className="footer-links pb-xl-5 pb-xs-0"
            >
              <h5 className="footer-link-title">Quick Links</h5>
              <div className="footer-grid">
                <div>
                  <ul className="footer-link-wrap mt-4">
                    <li>
                      <NavLink to="/daily-katha">Daily Katha</NavLink>
                    </li>
                    <li>
                      <NavLink to="/daily-darshan">Daily Darshan</NavLink>
                    </li>
                    <li>
                      <NavLink to="/activities">Activities</NavLink>
                    </li>
                    <li>
                      <NavLink
                        to={`/publication-detail/${publicationList[0]?.id}/${publicationList[0]?.name}`}
                      >
                        Publications
                      </NavLink>
                      {/* <NavLink to="/publication-detail/">Publications</NavLink> */}
                    </li>
                    <li>
                      <NavLink to="/branches">Branches</NavLink>
                    </li>
                    <li>
                      <NavLink to="/about-us">About Us</NavLink>
                    </li>
                    {/* <li>
                  <NavLink to="/contact-us">Contact Us</NavLink>
                </li>
                {donation === "1" ? (
                  <li>
                    <NavLink to="/donation">Donation</NavLink>
                  </li>
                ) : (
                  ""
                )} */}
                  </ul>
                </div>
                <div>
                  <h5 className="visibility-hidden">Quick Links</h5>
                  <ul className="footer-link-wrap">
                    <li className="">
                      <NavLink to="/contact-us">Contact Us</NavLink>
                    </li>
                    {donation === "1" ? (
                      <li>
                        <NavLink to="/donation">Donation</NavLink>
                      </li>
                    ) : (
                      ""
                    )}
                    {apiData.pages &&
                      Object.values(apiData.pages).map((page) => (
                        <li key={page.id}>
                          {page.website_page === "other_website" ? (
                            <NavLink
                            to={page.page_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {page.name}
                            </NavLink>
                          ) : (
                            <NavLink to={`/custome-page/${page.name}/${page.id}`}>
                              {page.name}
                            </NavLink>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </Grid>

            <Grid
              item
              lg={3}
              md={6}
              xs={12}
              className="footer-contact text-lg-start pb-md-4"
              style={{ paddingBottom: "0" }}
            >
              <h5>Social Media</h5>

              <ul className="social-media-link-wrap">
  {loading ? (
    [...Array(9)].map((_, index) => (
      <li key={index}>
        <div className="footer-icon-shimmer" />
      </li>
    ))
  ) : (
    <>
      {apiData?.fb_link && (
        <li>
          <a
            href={apiData.fb_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image2} className="footer-img" alt="Facebook" />
          </a>
        </li>
      )}
      {apiData?.whatsapp_link && (
        <li>
          <a
            href={apiData.whatsapp_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image3} className="footer-img" alt="WhatsApp" />
          </a>
        </li>
      )}
      {apiData?.youtube_link && (
        <li>
          <a
            href={apiData.youtube_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image4} className="footer-img" alt="YouTube" />
          </a>
        </li>
      )}
      {apiData?.instagram_link && (
        <li>
          <a
            href={apiData.instagram_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image5} className="footer-img" alt="Instagram" />
          </a>
        </li>
      )}
      {apiData?.apple_music_link && (
        <li>
          <a
            href={apiData.apple_music_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image1} className="footer-img" alt="Apple Music" />
          </a>
        </li>
      )}
      {apiData?.spotify_link && (
        <li>
          <a
            href={apiData.spotify_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image6} className="footer-img" alt="Spotify" />
          </a>
        </li>
      )}
      {apiData?.telegram_link && (
        <li>
          <a
            href={apiData.telegram_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image7} className="footer-img" alt="Telegram" />
          </a>
        </li>
      )}
      {apiData?.twitter_link && (
        <li>
          <a
            href={apiData.twitter_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image8} className="footer-img" alt="Twitter" />
          </a>
        </li>
      )}
      {apiData?.jio_sawan_link && (
        <li>
          <a
            href={apiData.jio_sawan_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image9} className="footer-img" alt="JioSaavn" />
          </a>
        </li>
      )}
    </>
  )}
</ul>

            </Grid>
          </Grid>
          <hr></hr>
          <div className="container footer-bottom pb-2">
            <div className="copyright pb-2">
              &copy; Copyright{" "}
              <strong>
                <span>{siteName}</span>
              </strong>
              &nbsp;All Rights Reserved
            </div>
            <div className="copyright pb-2">
              Developed by{" "}
              <a
                href="https://srashtasoft.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Srashtasoft
              </a>
            </div>
          </div>
          {/* ============================================================ */}
        </Container>
      </div>
    </>
  );
};

export default Footer;
