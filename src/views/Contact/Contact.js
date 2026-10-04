"use client";
import React, { useState, useEffect } from "react";
import _image from "../../assets/images/subheader.webp";
const image = _image.src;
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import _image1 from "../../assets/images/email.webp";
const image1 = _image1.src;
import _image2 from "../../assets/images/call.webp";
const image2 = _image2.src;
import _image3 from "../../assets/images/location.webp";
const image3 = _image3.src;
import { HiArrowSmallRight } from "react-icons/hi2";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { fetchContactDetails, fetchNavbarData } from "../../api/API";
// import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { isValidPhoneNumber } from "libphonenumber-js";
import { contactDetails, fetchSlider } from "../../api/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Contact.css";
import parsePhoneNumber from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Loader from "../../common/Loader/Loader";
import InnerpageLoader from "../Home/InnerpageLoader";
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
import AOS from "aos";
import "aos/dist/aos.css";

const Contact = (props) => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    <label className="active-link-color">CONTACT US</label>,
  ];

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mo_no: "",
    message: "",
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const [banner, setBanner] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const notify = (msg) => {
    toast.error(msg, {
      position: "top-right",
    });
  };

  const successNotify = (msg) => {
    toast.success(msg, {
      position: "top-right",
    });
  };

  const setPhone = (phone) => {
    // if (!phone.startsWith("+")) {
    //   phone = `+${phone}`;
    // }

    setFormData((prevData) => ({
      ...prevData,
      mo_no: phone,
    }));
  };

  const handleEmailClick = () => {
    if (apiData && apiData.emails) {
      window.location.href = `mailto:${apiData.emails}`;
    } else {
      console.error("No email found in apiData");
    }
  };

  const handleContactClick = () => {
    window.open(`tel:${apiData.mobile_number}`);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Update corresponding state based on input name
    if (name === "name") {
      setFormData((prevData) => ({
        ...prevData,
        name: value,
      }));
    } else if (name === "email") {
      setFormData((prevData) => ({
        ...prevData,
        email: value,
      }));
    } else if (name === "mo_no") {
      setFormData((prevData) => ({
        ...prevData,
        mo_no: value,
      }));
    } else if (name === "message") {
      setFormData((prevData) => ({
        ...prevData,
        message: value,
      }));
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (sendingMessage) {
      return;
    }

    // setSendingMessage(true);
    if (
      !formData.name ||
      !formData.email ||
      !formData.mo_no ||
      !formData.message
    ) {
            notify("Please fill all details");
      return;
    }

    if (!emailPattern.test(formData.email)) {
      notify("Please enter valid email address");
      return;
    }

        const obj = parsePhoneNumber("+" + formData.mo_no);

    if (!obj) {
      notify("Please enter valid mobile number");
      return;
    }

    if (!obj.isValid()) {
      notify("Please enter valid mobile number");
      return;
    }

    setSendingMessage(true);

    const data = {
      url: process.env.NEXT_PUBLIC_API_URL,
      page: "contact us",
      name: formData.name,
      email: formData.email,
      mo_no: "+" + formData.mo_no,
      message: formData.message,
    };

    try {
      const response = await contactDetails(data);
      setFormData({
        name: "",
        email: "",
        mo_no: "",
        message: "",
      });
            // successNotify("Email sent successfully ");
      if (response.data.code === 200) {
                successNotify(response.data.message);
      } else {
        successNotify("Email sent successfully");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    const fetchNavbar = fetchNavbarData({
      url: process.env.NEXT_PUBLIC_API_URL,
    }).then((response) => {
      if (response.data.status) {
        let countryName = response.data.responseBody.site.country;
        setCountry(countryName === "INDIA" ? "in" : countryName );
              }
    });

    const fetchData = async () => {
      try {
        const response = await fetchContactDetails({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "contact us",
        });
        setApiData(response.data.responseBody.contact);
        setLatitude(response.data.responseBody.contact.latitude);
        setLongitude(response.data.responseBody.contact.longitude);
                                // setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetchSlider({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "contact us",
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

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSanskardham%20Gurukul!5e0!3m2!1sen!2sin!4v1710993932770!5m2!1sen!2sin`;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

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

          {/* <img src={banner} alt="" className="about-img" /> */}
        </div>

        {/* <img src={image} alt="" className="about-img" /> */}

        {imageLoaded && (
          <div className="breadcrumbs-wrap">
            <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
          </div>
        )}
      </div>
   
      {/* <div className="section-padding"></div> */}
      <ToastContainer />
      <Container className="contact-us-form">
        <Grid container spacing={3} justifyContent="center">
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            order={{ xs: 2, sm: 2, md: 1 }}
            data-aos="fade-up"
          >
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <div className="contact-box-1">
                <div className="contact-box-content">
                  <h6>send email</h6>
                  <div>
                    <HiArrowSmallRight className="icon" />
                  </div>
                </div>
                <div className="abcd">
                  <h5 className="contact email">Email Address</h5>
                  <p onClick={handleEmailClick} style={{ cursor: "pointer" }}>
                    {apiData.emails}
                  </p>
                  <img src={image1} alt="" className="contact-icon" />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} className="pt-4">
              <div className="contact-box-1">
                <div className="contact-box-content">
                  <h6>Call Us Now</h6>
                  <div>
                    <HiArrowSmallRight className="icon" />
                  </div>
                </div>
                <div className="abcd">
                  <h5 className="contact email">Phone Number</h5>
                  <p onClick={handleContactClick} style={{ cursor: "pointer" }}>
                    {apiData.mobile_number}
                  </p>
                  <img src={image2} alt="" className="contact-icon" />
                </div>
              </div>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            lg={8}
            order={{ xs: 1, sm: 1, md: 2 }}
            className="contact-form"
             data-aos="fade-up"
          >
            <div className="contact-wrap">
              <div className="row">
                <div className="col-lg-12">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <FaUser className="donation-icon" />
                    </span>
                    <input
                      type="text"
                      className="form-control contact-input"
                      placeholder="Name"
                      aria-label="Username"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      aria-describedby="basic-addon1"
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <MdEmail className="donation-icon" />
                    </span>
                    {/* <input
                      type="text"
                      className="form-control contact-input"
                      placeholder="Email"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    /> */}
                    <input
                      type="text"
                      className="form-control contact-input"
                      name="email"
                      placeholder="Email"
                      aria-label="Email"
                      aria-describedby="basic-addon1"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  {/* <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <IoCall className="donation-icon" />
                    </span>
                    <input
                      type="text"
                      name="mo_no"
                      className="form-control contact-input"
                      placeholder="Mobile Number"
                      value={formData.mo_no}
                      
                      onChange={handleChange}
                      required
                      
                    />
                  </div> */}
                  <PhoneInput
                    country={country}
                    enableSearch={true}
                    value={formData.mo_no}
                    onChange={(phone) => setPhone(phone)}
                    className="phone-input"
                    // disableCountryCode={false}
                    // countryCallingCodeEditable={false}
                    // disableCountryCode={true}
                    countryCodeEditable={false}
                  />
                  {/* <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="in"
                    value={formData.mo_no}
                    onChange={(phone) => setPhone(phone)}
                    className="phone-input"
                    // countrySelectComponent={CountrySelectComponent}
                  /> */}
                </div>
                {/* <Contact1 /> */}
                <div className="col-lg-12">
                  <div className="form-floating mb-3">
                    <textarea
                      // className="form-control contact-textarea"
                      placeholder="Message"
                      // id="floatingTextarea"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="contact-text-area"
                    ></textarea>
                    {/* <label for="floatingTextarea">Message</label> */}
                  </div>
                </div>
                <div>
                  <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={sendingMessage}
                    // disabled={
                    //   sendingMessage ||
                    //   !formData.name ||
                    //   !formData.email ||
                    //   !formData.mo_no ||
                    //   !formData.message
                    // }
                  >
                    {/* Send Message */}
                    {sendingMessage ? (
                      <div className="loader1"></div>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <div className="col-lg-12 pt-4">
          {/* <iframe
            src={`https://maps.google.com/maps?q=${latitude},
        ${longitude}}&hl=es;z=14&amp;output=embed`}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            className="google-map"
          ></iframe> */}
          {/* =================== */}
          {/* <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.7984128843614!2d71.42143727394281!3d22.994439217380044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395962f4885de47b%3A0x2bdc23b049f93e2b!2sSanskardham%20Gurukul!5e0!3m2!1sen!2sin!4v1710993932770!5m2!1sen!2sin"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            className="google-map"
          ></iframe> */}
          {/* <iframe
            src={mapUrl}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            className="google-map"
          ></iframe> */}
          {/* =================== */}
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2965.0824050173574!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sWebFilings%2C+University+Boulevard%2C+Ames%2C+IA!5e0!3m2!1sen!2sus!4v1390839289319`}
            width="600"
            height="450"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="google-map"
          ></iframe>
        </div>
      </Container>
      <div className="section-padding"></div>
    </>
  );
};

export default Contact;
