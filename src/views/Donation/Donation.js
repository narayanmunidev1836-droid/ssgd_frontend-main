"use client";
import React, { useState, useEffect, useRef } from "react";
import _image from "../../assets/images/subheader.webp";
const image = _image.src;
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { isValidPhoneNumber } from "libphonenumber-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchDonationList,
  retrieveInfo,
  sendOtp,
  verifyOtp,
  countryData,
  paymentData,
  fetchSlider,
} from "../../api/API";
import "./Donation.css";
import parsePhoneNumber from "libphonenumber-js";
import { Sync } from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Loader from "../../common/Loader/Loader";
import InnerpageLoader from "../Home/InnerpageLoader";
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
import { useLocation } from "../../common/routerCompat.js";

const getFormattedPrice = (price) => `${price.toFixed(2)}`;

const breadcrumbsData = [
  { label: "Home", url: "/" },
  <Typography color="text.primary" className="active-link-color">
    Donation
  </Typography>,
];

export default function Donation() {
  const [donationList, setDonationList] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [total, setTotal] = useState(0);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherDonationValue, setOtherDonationValue] = useState(0);

  const [retrieveInformation, setRetrieveInformation] = useState("");
  const [response, setResponse] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  // const [showResendButton, setShowResendButton] = useState(false);
  // const [secondsLeft, setSecondsLeft] = useState(20);
  const modalRef = useRef(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountryISO, setSelectedCountryISO] = useState("in"); // State to store selected country ISO code
  const [selectedDonationId, setSelectedDonationId] = useState({});
  const [currencySymbol, setCurrencySymbol] = useState();
  const [otpError, setOtpError] = useState();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    email: "",
    mobileNumber: "",
    note: "",
    address: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;



  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
      }, [donationList]);

  const resetSelectedDonorId = () => {
    const updatedCheckedState = checkedState.map((item, index) => false);
        setCheckedState(updatedCheckedState);
  };

  //donation list - checkbox
  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
        setCheckedState(updatedCheckedState);

    // Create object with IDs of selected checkboxes
    const newSelectedIds = {};
    updatedCheckedState.forEach((isChecked, idx) => {
      if (isChecked) {
        newSelectedIds[donationList[idx].id] = parseInt(
          donationList[idx].amount
        );
      }
    });
    setSelectedDonationId(newSelectedIds);

    // Total amount
    const totalPrice = updatedCheckedState.reduce(
      (sum, currentState, index) => {
        if (currentState === true) {
          return sum + parseFloat(donationList[index].amount);
        }
        return sum;
      },
      0
    );
            if (otherDonationValue) {
      setTotal(parseFloat(totalPrice) + parseFloat(otherDonationValue));
    } else {
      setTotal(parseFloat(totalPrice));
    }
  };

  const handleKeyDown = (event) => {
    // Check if decrement key (arrow down) is pressed
    if (event.key === "ArrowDown" && otherDonationValue <= 0) {
      event.preventDefault(); // Prevent default action (decrementing)
    }
  };

  // Other - donation - input
  const handleOtherDonationChange = (e) => {
        const totalPrice = checkedState.reduce((sum, currentState, index) => {
      if (currentState === true) {
        return sum + parseFloat(donationList[index].amount);
      }
      return sum;
    }, 0);

    const inputValue = parseInt(e.target.value);

    // Prevent setting negative values
    if (!isNaN(inputValue) && inputValue >= 0) {
      setOtherDonationValue(inputValue);
      setTotal(totalPrice + inputValue);
    } else {
      // If negative, set amount to 0
      setOtherDonationValue(0);
      setTotal(totalPrice);
    }
  };

  //Other - donation - checkbox
  const handleOtherDonationCheckboxChange = (e) => {
    if (!e.target.checked) {
      // Subtract other donation value from total when checkbox is unchecked
      const otherDonation = parseFloat(otherDonationValue);
      if (!isNaN(otherDonation)) {
        setTotal(total - otherDonation);
      }
      setOtherDonationValue(""); // Reset other donation value
    }
    setShowOtherInput(e.target.checked);
  };

  //Donation - list - API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDonationList({
          url: apiUrl,
          page: "donation",
        });
        if (
          response.data.responseBody &&
          Array.isArray(response.data.responseBody.donations)
        ) {
          const initialCheckedState = new Array(
            response.data.responseBody.donations.length
          ).fill(false);
          setDonationList(response.data.responseBody.donations);
          setCheckedState(initialCheckedState);
          setCurrencySymbol(response.data.responseBody.currency);
                            } else {
          console.error("Invalid data format:", response.data.responseBody);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //Retrieve - Info
  const handleRetrieveInfo = async () => {
    try {
      if (!emailPattern.test(retrieveInformation)) {
        notify("Please Enter Valid Email Address");
        return;
      }

      const data = {
        url: apiUrl,
        page: "donation",
        email: retrieveInformation,
      };
      const response = await retrieveInfo(data);
      if (response.data.responseBody.donaterData.length === 0) {
        notify("No data found please fill up the form");
        return;
      }

      if (response.data.responseBody.verify_status === false) {
        setResponse(response);
        notify("Please verify email");
        return;
      }

      setIsVerified(response.data.responseBody.verify_status);

            setResponse(response);
    } catch (error) {
      console.error("Error sending email data", error);
    }
  };

  //Terms and condition page
  const handleClick = (event) => {
    event.preventDefault();
    // navigate("/terms-conditions");
    window.open("/terms-conditions", "_blank");
  };

  const handleRetrieveInformation = (event) => {
    setRetrieveInformation(event.target.value);
    if (response !== null) {
      clearForm();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  //Send - OTP
  const handleSendOtp = async () => {
        if (!isValidEmail) {
      notify("Please Enter A Valid Email Address");
      return;
    }
        if (!formData.email.trim()) {
      return;
    }
    
    if (seconds !== 20) {
      setSeconds(20);
    }
        try {
      const data = {
        url: apiUrl,
        page: "donation",
        email: formData.email,
      };

      const response = await sendOtp(data);
      setOtpError(null);
          } catch (error) {
      if (error.response?.data?.code === 422) {
        setOtpError(error?.response?.data?.message?.toString());
        notify(error?.response?.data?.message?.toString());
        return;
      }
      console.error("Error sending email data", error);
    }
  };

  const handleVerifyButton = () => {
    if (formData.email !== "") {
      handleSendOtp();
      setShowModal(true);
    }
  };

  const handleChangeOtp = (event) => {
    setOtp(event.target.value);
  };

  

  //Verify - OTP
  const handleVerifyOTP = async () => {
    try {
      if (!otp.trim()) {
        notify("Please Enter OTP");
        return;
      }
      const data = {
        url: apiUrl,
        page: "donation",
        email: formData.email,
        otp: otp,
      };
      const response = await verifyOtp(data);
      if (response.data.status === true) {
                setShowModal(false);
        successNotify("Email verified successfully");
        localStorage.setItem("verfiedEmail", response.data.requestBody.email);
        setIsVerified(true);
        setOtp("");
      } else {
        notify("Invalid OTP Please Enter a Valid OTP");
      }
    } catch (error) {
            notify(
        error?.response?.data?.message ?? "Invalid OTP Please Enter a Valid OTP"
      );
    }
  };

  const [seconds, setSeconds] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  const handleEmailChange = (event) => {
    const value = event.target.value;

    const verfiedEmail = localStorage.getItem("verfiedEmail");
    if (value === verfiedEmail) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }

    // setEmail(value);
    setIsValidEmail(emailPattern.test(value));
    setFormData({ ...formData, email: value });
      };

  // Set retrieve - info data
  useEffect(() => {
    if (
      response &&
      response.data &&
      response.data.responseBody.donaterData.length > 0
    ) {
      const data = response.data.responseBody.donaterData[0];
      setFormData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        country: data.country || "",
        email: data.email || "",
        mobileNumber: data.mobile_number || "",
        note: "",
        address: "",
      });
    }
  }, [response]);
  // console.log("country", formData.country);

  //Country - list
  const getCountryList = async () => {
    try {
      const response = await countryData();
      setCountryList(response.data.responseBody);
      // console.log("Response country", response.data.responseBody);
    } catch (error) {
      console.error("Error sending email data", error);
    }
  };

  useEffect(() => {
    getCountryList();
  }, []);

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  //Paymet  - API
  const handlePayment = async () => {
    try {
      if (isEmpty(selectedDonationId) && !otherDonationValue) {
        // alert("Please enter or select donation");
        notify("Please Enter Or Select Donation");
        return;
      }

                        
      // Validation
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.mobileNumber ||
        !formData.address
        // !formData.note
      ) {
        notify("Please Fill Personal Information");
        return;
      }
      
      const finalMobilenumber = formatMobileNumber(formData.mobileNumber);

      
      const obj = parsePhoneNumber(finalMobilenumber);

      
      if (obj?.isValid() === false) {
        notify("Please Enter Valid Mobile Number");
        return;
      }

      if (!isVerified) {
        notify("Please Verify Your Email");
        return;
      }

      if (showOtherInput === true) {
        setSelectedDonationId({
          ...selectedDonationId,
          others: otherDonationValue,
        });
      }

      const data = {
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "donation",
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        country: formData.country,
        mobile_number: finalMobilenumber,
        amount: total,
        note: formData.note,
        address: formData.address,
        donation_ids:
          showOtherInput && otherDonationValue
            ? {
                ...selectedDonationId,
                others: otherDonationValue,
              }
            : selectedDonationId,
      };

      const response = await paymentData(data);
                  if (response.data.status === true) {
        // window.open(response.data.responseBody.url);
        window.location.href = response.data.responseBody.url;
        clearAllField();
      }
    } catch (error) {
      console.error("Error", error);
      if (error.response?.data?.code === 422) {
        notify(error?.response?.data?.message[0]?.toString());
        return;
      }
      notify("Please Verify Your Email");
    }
  };

  function formatMobileNumber(number) {
    // Remove all '+' symbols
    let formattedNumber = number.replace(/\+/g, "");

    // Add one '+' symbol at the beginning if it's not there
    if (formattedNumber.charAt(0) !== "+") {
      formattedNumber = "+" + formattedNumber;
    }

    return formattedNumber;
  }

  const clearAllField = () => {
    setFormData({
      firstName: "",
      lastName: "",
      country: "",
      email: "",
      mobileNumber: "",
      note: "",
      address: "",
    });
    setIsValidEmail(false);
    setSelectedDonationId({});
    resetSelectedDonorId();
    setTotal(0);
    setRetrieveInformation("");
    setIsVerified(false);
    setResponse(null);
  };

  const clearForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      country: "",
      email: "",
      mobileNumber: "",
      note: "",
      address: "",
    });
    setIsValidEmail(false);
    setIsVerified(false);
    setResponse(null);
  };

  const handleChangeFirstName = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, firstName: value });
      };

  const handleChangeLastName = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, lastName: value });
      };

  // const handleChangeMobileNumber = (e) => {
  //   const value = e.target.value;
  //   setFormData({ ...formData, mobileNumber: value });
  //   console.log(formData);
  // };

  const setPhone = (phone) => {
    setFormData((prevData) => ({
      ...prevData,
      mobileNumber: phone,
    }));
  };

  const handleChangeNote = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, note: value });
      };

  const handleChangeAddress = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });
      };
  // const handleChangeInfo = (e) => {
  //   const inputId = e.target.id;
  //   const inputName = e.target.name;
  //   console.log("InputId", inputId);
  //   console.log("InputName", inputName);
  // };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetchSlider({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "donation",
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
  const textFieldRef = useRef(null);
  const buttonRef = useRef(null);

  const handleTextFieldKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault(); // Prevent default tab behavior
      buttonRef.current.focus(); // Focus on the button
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const foundCountry = countryList.find(
      (country) => country.name === selectedCountry
    );
    if (foundCountry) {
      setFormData({
        ...formData,
        country: selectedCountry, // Update the country name
      });
      setSelectedCountryISO(foundCountry.iso.toLowerCase()); // Update the selected ISO code
    }
  };

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
  
      {/* <div className="section-padding"></div> */}
      <ToastContainer />
      <Container className="donation-page">
        <div className="">
          <Accordion defaultExpanded className="donation-title">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className="donation-icons" />}
              aria-controls="panel1-content"
              id="panel1-header"
              className="donation-subtitle"
            >
              Donate to Gurukul Seva
            </AccordionSummary>
            <Accordion defaultExpanded className="donation-list">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="donation-icon" />}
                aria-controls="panel3-content"
                id="panel3-header"
                className="donation-text"
              >
                Donation
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={0} className="donation-list pb-2">
                  <div className="toppings-list">
                    {/* ========== Donation list start  ========== */}
                    {donationList.map(({ title, amount }, index) => {
                      return (
                        <div key={index} className="donationlist-wrap">
                          <div className="toppings-list-item">
                            <div className="left-section">
                              <input
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                name={title}
                                value={title}
                                checked={checkedState[index]}
                                onChange={() => handleOnChange(index)}
                                className="donation-check-box"
                              />
                              <label
                                htmlFor={`custom-checkbox-${index}`}
                                className="donation-list-name"
                              >
                                {title}
                              </label>
                              <div className="right-section">
                                {currencySymbol}
                                {getFormattedPrice(parseFloat(amount))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {/*  ========== Donation list end  ========== */}
                    {/* Other donation start */}
                    <div className="left-section">
                      <input
                        type="checkbox"
                        id="other-donation-checkbox"
                        name="other-donation"
                        value="other-donation"
                        checked={showOtherInput}
                        onChange={handleOtherDonationCheckboxChange}
                        className="donation-check-box"
                      />
                      <label
                        htmlFor="other-donation-checkbox"
                        className="donation-list-name"
                      >
                        Other Donation
                      </label>
                      {showOtherInput && (
                        <div>
                          <div className="toppings-list-item">
                            <div className="left-section">
                              <input
                                type="number"
                                value={otherDonationValue}
                                onChange={handleOtherDonationChange}
                                placeholder="Enter amount"
                                onKeyDown={handleKeyDown}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/*  ========== Other donation end  ========== */}
                  </div>
                </Grid>
                {/* ========== Selected donation list start ========== */}
                <div>
                  <div className="donation-summary-title">
                    <div className="">DONATION SUMMARY:</div>
                  </div>
                  <div className="right-section">
                    {donationList.map(({ title, amount }, index) => {
                      if (checkedState[index]) {
                        return (
                          <>
                            <div className="right-section-donation">
                              <div key={index}>
                                <p>{title}</p>
                              </div>
                              <div className="">
                                <p>
                                  {currencySymbol}
                                  {getFormattedPrice(parseFloat(amount))}
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      return null;
                    })}
                    {showOtherInput && (
                      <div className="donation-summary-item">
                        <div className="">
                          <p>Other Donation</p>
                        </div>
                        <div className="donation-amount">
                          <p>
                            {isNaN(parseFloat(otherDonationValue))
                              ? `${currencySymbol}0.00`
                              : `${currencySymbol}${getFormattedPrice(
                                  parseFloat(otherDonationValue)
                                )}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* ========== Selected donation list end ========== */}
                {/* Total amount start */}
                <div>
                  <div className="donation-total">
                    <div>Total:</div>
                    <div>
                      {currencySymbol}
                      {getFormattedPrice(total)}
                    </div>
                  </div>
                </div>
                {/* Total amount end */}
              </AccordionDetails>
            </Accordion>
          </Accordion>
        </div>
      </Container>

      {/*  ==========  Retrieve Information start  ==========  */}
      {/* <Container>
        <label className="retrieve-info-label">Enter your email address</label>
        <div className="input-group mb-3">
          <input
            inputRef={textFieldRef}
            type="email"
            className="form-control"
            placeholder="Enter your email address"
            aria-label="Enter your  email address"
            aria-describedby="basic-addon2"
            value={retrieveInformation}
            onChange={handleRetrieveInformation}
            onKeyDown={handleTextFieldKeyDown}
          />
          <div className="input-group-append">
            <button
              ref={buttonRef}
              className="input-group-text retrieve-info"
              id="basic-addon2"
              onClick={handleRetrieveInfo}
            >
              Retrieve Info{" "}
            </button>
          </div>
        </div>
      </Container> */}
      {/*  ==========  Retrieve Information end  ==========  */}
      <Container>
        <div className="OR">OR</div>
      </Container>
      {/*  ========== Personal Info start  ========== */}
      <Container className="donation-info">
        <Card className="donation-form-wrap">
          <h2>Personal Information</h2>
          <div>
            <div className="donation-form">
              <div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    <FaUser className="donation-icon" />
                  </span>

                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    // className="form-control donation-input"
                    className="form-control donation-input "
                    placeholder="First Name"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    value={formData.firstName}
                    onChange={handleChangeFirstName}
                    // onChange={(e) =>
                    //   setFormData({ ...formData, firstName: e.target.value })
                    // }
                  />
                </div>
              </div>

              <div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    <FaUser className="donation-icon" />
                  </span>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-control donation-input"
                    placeholder="Last Name"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    value={formData.lastName}
                    // onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    onChange={handleChangeLastName}
                  />
                </div>
              </div>
              <div>
                {/* ========== Country List start ========== */}
                <select
                  className="form-select donation-country mb-3"
                  aria-label="Default select example"
                  value={formData.country}
                  onChange={handleCountryChange}
                >
                  <>
                    <option value="">Select Country</option>
                    {countryList.map(
                      (country) =>
                        country.name && (
                          <option key={country.name} value={country.name}>
                            {country.name}
                          </option>
                        )
                    )}
                  </>
                </select>
                {/* ========== Country List end ========== */}
              </div>
            </div>
          </div>

          <div className="tt">
            <div className="ff">
              <div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    <MdEmail className="donation-icon" />
                  </span>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="form-control donation-input"
                    style={{ borderRadius: "0px 6px 6px 0px" }}
                    placeholder="Email"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    // value={email}
                    value={formData.email}
                    onChange={handleEmailChange}
                  />

                  {isVerified ? (
                    <MdVerified className="sendotp-btn verified" />
                  ) : (
                    <>
                      <button
                        onClick={handleVerifyButton}
                        className="sendotp-btn"
                      >
                        Verify
                      </button>
                    </>
                  )}

                  {/* ========== Verify OTp Modal start ========== */}
                  {showModal && (
                    <div className="modal-overlay">
                      <div className="modal" ref={modalRef}>
                        <div className="modal-content">
                          <span className="close" onClick={handleCloseModal}>
                            &times;
                          </span>
                          <div className="verify-otp-wrap">
                            <div>
                              <h2>Please Enter Valid OTP</h2>
                            </div>
                            <div>
                              <input
                                type="text"
                                className="form-control verify-input"
                                aria-label="Username"
                                name="otp"
                                aria-describedby="basic-addon1"
                                value={otp}
                                onChange={handleChangeOtp}
                              />
                            </div>
                          </div>
                          <div className="otp-verification-btn">
                            <div>
                              <button
                                onClick={handleCloseModal}
                                className="cancel-btn"
                              >
                                Cancel
                              </button>
                            </div>
                            <div>
                              <button
                                onClick={handleVerifyOTP}
                                className="verify-btn"
                              >
                                Verify
                              </button>
                            </div>
                          </div>
                          {/* ================== */}
                          {/* <div className="otp-verification-btn">
                            <>
                              <div>
                                <button
                                  onClick={handleCloseModal}
                                  className="cancel-btn"
                                >
                                  Cancel
                                </button>
                              </div>
                              {showResendButton ? (
                                <button
                                  className="verify-btn"
                                  onClick={handleVerifyOTP}
                                >
                                  Resend OTP
                                </button>
                              ) : (
                                <div>
                                  <button
                                    onClick={handleVerifyOTP}
                                    className="verify-btn"
                                  >
                                    Verify
                                  </button>
                                </div>
                              )}
                            </>
                          </div> */}
                          {/* ================== */}
                          {otpError ? (
                            <div
                              style={{ textAlign: "center" }}
                              className="mt-4"
                            >
                              {otpError}
                            </div>
                          ) : (
                            <div className="countdown-text d-flex justify-content-center pt-4">
                              {seconds > 0 ? (
                                <>
                                  <p className="d-flex">
                                    Please wait for{" "}
                                    {seconds < 10 ? `0${seconds}` : seconds}{" "}
                                    seconds
                                  </p>
                                </>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "220px",
                                  }}
                                  className="abc"
                                >
                                  <div>Didn't recieve OTP?</div>
                                  <div>
                                    <a
                                      style={{
                                        cursor: "pointer",
                                        textDecorationLine: "underline",
                                        fontWeight: 600,
                                        color: "#08416b",
                                      }}
                                      onClick={handleSendOtp}
                                    >
                                      Resend
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* ========== Verify OTp Modal end ========== */}
                </div>
              </div>
              <div>
                <PhoneInput
                  // alwaysDefaultMask={true}
                  country={selectedCountryISO}
                  enableSearch={true}
                  value={formData.mobileNumber}
                  onChange={(phone) => setPhone(phone)}
                  className="phone-input"
                  countryCodeEditable={false}
                />
                {/* </div> */}
              </div>
              <div className="donation-terms">
                <div>
                  <FormGroup className="doasnation-checkbox">
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      className="donation-checkbox"
                    />
                  </FormGroup>
                </div>
                <div>
                  <span className="terms-condition">
                    I Agree to{" "}
                    <a
                      onClick={handleClick}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms and Condition for Donation
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="d-flex gap-3">
              <div className="form-floating mb-3">
                <textarea
                  className="form-control donation-textarea"
                  id="address"
                  name="address"
                  placeholder="Leave a comment here"
                  value={formData.address}
                  onChange={handleChangeAddress}
                  maxLength={500}
                ></textarea>
                <label for="floatingTextarea">Address</label>
              </div>
              <div className="form-floating mb-3">
                <textarea
                  className="form-control donation-textarea"
                  id="note"
                  name="note"
                  placeholder="Leave a comment here"
                  value={formData.note}
                  onChange={handleChangeNote}
                  maxLength={500}
                ></textarea>
                <label for="floatingTextarea">Note</label>
              </div>
            </div>
          </div>
          <div className="payment-menothod-wrap">
            <Grid container spacing={3} className="donation-buttons pt-4">
              <Grid item xs={12} sm={6} md={3}>
                <div className="payment-inner-wrap">
                  <div>
                    <h6>Total Donation</h6>
                  </div>
                  <div>
                    <h6>
                      {currencySymbol}
                      {getFormattedPrice(total)}
                    </h6>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <div className="payment-btn-wrap">
                  <button className="payment-btn" onClick={handlePayment}>
                    Proceed To Payment
                  </button>
                </div>
              </Grid>
            </Grid>
          </div>
        </Card>
      </Container>
      {/*  ========== Personal Info end  ========== */}
    </>
  );
}
