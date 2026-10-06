"use client";
import React, { useState, useEffect } from "react";
import _image1 from "../../assets/images/email.webp";
const image1 = _image1.src;
import _image2 from "../../assets/images/call.webp";
const image2 = _image2.src;
import { HiArrowSmallRight } from "react-icons/hi2";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { fetchContactDetails, fetchNavbarData } from "../../api/API";
import { contactDetails, fetchSlider } from "../../api/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Contact.css";
import parsePhoneNumber from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import InnerpageLoader from "../Home/InnerpageLoader";
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
    fetchNavbarData({
      url: process.env.NEXT_PUBLIC_API_URL,
    }).then((response) => {
      if (response.data.status) {
        let countryName = response.data.responseBody.site.country;
        setCountry(countryName === "INDIA" ? "in" : countryName);
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
      } catch (error) {
        console.error("Error fetching data:", error);
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
        </div>

        {imageLoaded && (
          <div className="breadcrumbs-wrap">
            <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
          </div>
        )}
      </div>
      <div className="temple-page-bg">

      <ToastContainer />
      <div className="ct-page">
        <div className="ct-container">
          <div className="ct-heading" data-aos="fade-up">
            <h2 className="ct-title">CONTACT US</h2>
          </div>

          <div className="ct-layout">
            {/* Contact info cards */}
            <aside className="ct-info" data-aos="fade-up">
              <div className="ct-info-card">
                <div className="ct-info-head">
                  <span className="ct-info-badge">
                    <HiArrowSmallRight />
                  </span>
                  <h6>send email</h6>
                </div>
                <h5 className="ct-info-label">Email Address</h5>
                <p
                  className="ct-info-value"
                  onClick={handleEmailClick}
                  role="button"
                  tabIndex={0}
                >
                  {apiData.emails}
                </p>
                <img src={image1} alt="" className="ct-info-icon" />
              </div>

              <div className="ct-info-card">
                <div className="ct-info-head">
                  <span className="ct-info-badge">
                    <HiArrowSmallRight />
                  </span>
                  <h6>Call Us Now</h6>
                </div>
                <h5 className="ct-info-label">Phone Number</h5>
                <p
                  className="ct-info-value"
                  onClick={handleContactClick}
                  role="button"
                  tabIndex={0}
                >
                  {apiData.mobile_number}
                </p>
                <img src={image2} alt="" className="ct-info-icon" />
              </div>
            </aside>

            {/* Enquiry form */}
            <section className="ct-form-card" data-aos="fade-up">
              <div className="ct-field">
                <FaUser className="ct-field-icon" />
                <input
                  type="text"
                  className="ct-input"
                  placeholder="Name"
                  aria-label="Username"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="ct-field">
                <MdEmail className="ct-field-icon" />
                <input
                  type="text"
                  className="ct-input"
                  name="email"
                  placeholder="Email"
                  aria-label="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="ct-phone">
                <PhoneInput
                  country={country}
                  enableSearch={true}
                  value={formData.mo_no}
                  onChange={(phone) => setPhone(phone)}
                  className="phone-input"
                  countryCodeEditable={false}
                />
              </div>

              <textarea
                className="ct-textarea"
                placeholder="Message"
                aria-label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>

              <button
                type="button"
                className="ct-submit"
                onClick={handleSubmit}
                disabled={sendingMessage}
              >
                {sendingMessage ? <span className="ct-spinner"></span> : "Send Message"}
              </button>
            </section>
          </div>

          {/* Map */}
          <div className="ct-map" data-aos="fade-up">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2965.0824050173574!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sWebFilings%2C+University+Boulevard%2C+Ames%2C+IA!5e0!3m2!1sen!2sus!4v1390839289319`}
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map"
            ></iframe>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Contact;
