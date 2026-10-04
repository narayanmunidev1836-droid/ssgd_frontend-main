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
import { FaCity } from "react-icons/fa";
import { isValidPhoneNumber } from "libphonenumber-js";
import { toast, ToastContainer } from "react-toastify";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchDonationList,
  retrieveInfo,
  sendOtp,
  verifyOtp,
  countryData,
  paymentData,
  fetchSlider,
  fetchDonationMembersList,
  getBranch,
  getMemberData,
} from "../../api/API";
import "./Donation.css";
import parsePhoneNumber from "libphonenumber-js";
import { Sync } from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Loader from "../../common/Loader/Loader";
import InnerpageLoader from "../Home/InnerpageLoader";
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
import _image1 from "../../assets/images/daily-darshan-image2.webp";
const image1 = _image1.src;
import { CgCloseO } from "react-icons/cg";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate, useParams } from "../../common/routerCompat.js";
import { MdEmail } from "react-icons/md";

const getFormattedPrice = (price) => `${price.toFixed(2)}`;

const breadcrumbsData = [
  { label: "Home", url: "/" },
  <Typography color="text.primary" className="active-link-color">
    Donation
  </Typography>,
];

export default function DonationNew({ memberId, memberType }) {
  const [donationList, setDonationList] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [total, setTotal] = useState(0);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherDonationValue, setOtherDonationValue] = useState(0);
  const [memberInfoData, setMemberInfoData] = useState([]);
  const [retrieveInformation, setRetrieveInformation] = useState("");
  const [response, setResponse] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const modalRef = useRef(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountryISO, setSelectedCountryISO] = useState("in");
  const [selectedCountryCode, setSelectedCountryCode] = useState("91");
  const [selectedDonationId, setSelectedDonationId] = useState({});
  const [currencySymbol, setCurrencySymbol] = useState();
  const [otpError, setOtpError] = useState();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [verifyListData, setVerifyListData] = useState([]);
  const [memberIdData, setMemberIdData] = useState();
  const navigate = useNavigate();
  const [clearData, setClearData] = useState(false);
  // const [formData, setFormData] = useState({
  //   first_name: "",
  //   last_name: "",
  //   city: "",
  //   country: "",
  //   email: "",
  //   mobileNumber: "",
  //   note: "",
  //   address: "",
  // });
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    cardType: "Aadhar card",
    cardNumber: "",
    city: "",
    note: "",
    mobileNumber: "",
    email: ""
  });
  const [memberName, setMemberName] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [donationType, setDonationType] = useState("Regular");
  const [mobileNumber, setMobileNumber] = useState(
    localStorage.getItem("verifiedMobileNumber") || ""
  );

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isValidCard, setIsValidCard] = useState(
    localStorage.getItem("validCard") || false
  );
  const [isValidationVisible, setIsValidationVisible] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [charLimitExceeded, setCharLimitExceeded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

    // const maxWords = 10;
  const maxCharacters = 100;

  const [isSendOtpDisabled, setIsSendOtpDisabled] = useState(false);
  const [isReSendOtpDisabled, setIsReSendOtpDisabled] = useState(true);
  const [isVerifyOtpDisabled, setIsVerifyOtpDisabled] = useState(
    !localStorage.getItem("verifiedOtp")
  );
  const [isOtpVerified, setIsOtpVerified] = useState(
    !!localStorage.getItem("verifiedOtp")
  );
  const [timeLeft, setTimeLeft] = useState(null);
  const [selectedFormDate, setSelectedFormDate] = useState();
  const [bankDetails, setBankDetails] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const cityInputRef = useRef(null);

  
  useEffect(() => {
    const scriptId = "google-maps-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDk77EgsWrBF3epQ3fXzPl-lK7uJVpOgn0&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
              };
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (window.google && window.google.maps && cityInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(cityInputRef.current, {
        types: ["geocode"], // Changed from "(cities)" to "geocode" to allow all locations
      });
  
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          setFormData((prev) => ({
            ...prev,
            city: place.formatted_address,
          }));
          setSuggestions([]); // Clear suggestions on selection
        }
      });
    }
  }, [setFormData]);

  const handleChangeData = (e) => {
    const inputValue = e.target.value;
    setFormData((prev) => ({ ...prev, city: inputValue }));

    if (inputValue.trim().length > 2) {
      // Fetch predictions based on input
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: inputValue,
          componentRestrictions: { country: [] },
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]); // Clear suggestions when input is empty or too short
    }
  };

  // Handle city selection from the dropdown
  const handleSelectCity = (city) => {
    setFormData((prev) => ({ ...prev, city }));
    setSuggestions([]); // Clear suggestions
  };
  const location = useLocation();
  // const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  // const query = searchParams.get('query');

  useEffect(() => {
    const storedTime = localStorage.getItem("otpExpiryTime");

    if (storedTime) {
      const expiryTime = parseInt(storedTime, 10) + 600000;
      const remainingTime = expiryTime - Date.now();

      if (remainingTime > 0) {
        const timeout = setTimeout(() => {
          localStorage.removeItem("verifiedMobileNumber");
          localStorage.removeItem("verifiedOtp");
          localStorage.removeItem("otpExpiryTime");
          localStorage.removeItem("verifiedData");
          localStorage.removeItem("selectedMemberData");
          localStorage.removeItem("selectedMemberId");
          localStorage.removeItem("validCard");
          setIsOtpVerified(false);
          setMobileNumber("");
          setOtp("");
        }, remainingTime);

        return () => clearTimeout(timeout); // Cleanup on component unmount
      } else {
        // Already expired
        localStorage.removeItem("verifiedMobileNumber");
        localStorage.removeItem("verifiedOtp");
        localStorage.removeItem("otpExpiryTime");
        localStorage.removeItem("verifiedData");
        localStorage.removeItem("selectedMemberData");
        localStorage.removeItem("selectedMemberId");
        localStorage.removeItem("validCard");
        setIsOtpVerified(false);
        setMobileNumber("");
        setOtp("");
      }
    }
  }, []);

  useEffect(() => {
    try {
      if (isValidCard) {
        setValidationMessage("Valid Aadhaar Card number");
        setIsValidCard(true);
      }
    } catch (error) {
      console.error("Error in validateAadhar:", error);
    }
    setIsValidationVisible(true);
  }, [isValidCard]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Clear timer on component unmount
    } else if (timeLeft !== null) {
      setIsReSendOtpDisabled(false);
      setTimeLeft(null);
      // Enable the button after 30 seconds
    }
  }, [timeLeft]);

  useEffect(() => {
    const otpExpiryDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
    const expiryTime = Date.now() + otpExpiryDuration;
    localStorage.setItem("otpExpiryTime", expiryTime.toString());
  }, []);

  const handleCardTypeChange = (e) => {
    setFormData({ ...formData, cardType: e.target.value });

    // setFormData({ ...formData, cardNumber: e.target.value });
    setValidationMessage("");
    setIsValidCard(false);
    setIsValidationVisible(false);
  };

  const handleFormdateChange = (newDate) => {
    setSelectedFormDate(newDate);
    const formDate = dayjs(newDate).format("DD/MM/YYYY");
      };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    // setCardNumber(e.target.value);
    // validateCard(e.target.value, cardType);
    setFormData({ ...formData, cardNumber: value });
    if (value === "") {
      setValidationMessage("");
      setIsValidCard(false);
      setIsValidationVisible(false);
    } else {
      validateCard(value, formData.cardType);
    }
  };

    const validateCard = (number, type) => {
     // Debugging line
     // Debugging line
     // Debugging line

    if (type === "Aadhar card") {
      try {
        const isValid = validateAadhar(number);
         // This should now log

        if (isValid) {
          setValidationMessage("Valid Aadhaar Card number");
          setIsValidCard(true);
        } else {
          setValidationMessage("Invalid Aadhaar Card Number");
          setIsValidCard(false);
        }
      } catch (error) {
        console.error("Error in validateAadhar:", error);
      }
    } else if (type === "Pan card") {
      if (validatePan(number)) {
        setValidationMessage("Valid PAN Card Number");
        setIsValidCard(true);
      } else {
        setValidationMessage("Invalid PAN Card Number");
        setIsValidCard(false);
      }
    }
    setIsValidationVisible(true);
  };

  const validateAadhar = (aadharNumber) => {
    const aadharPattern = /^[2-9]{1}[0-9]{11}$/;

    if (!aadharPattern.test(aadharNumber)) {
            return false;
    }

    const verhoeffTableD = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    ];

    const verhoeffTableP = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
    ];

    const verhoeffTableInv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

    let c = 0;
    const reversedAadhar = aadharNumber.split("").reverse().join("");
    
    for (let i = 0; i < reversedAadhar.length; i++) {
      c =
        verhoeffTableD[c][
          verhoeffTableP[i % 8][parseInt(reversedAadhar[i], 10)]
        ];
          }

        return c === 0;
  };

  const validatePan = (panNumber) => {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panPattern.test(panNumber);
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

  useEffect(() => {
      }, [donationList]);

  const resetSelectedDonorId = () => {
    const updatedCheckedState = checkedState.map((item, index) => false);
        setCheckedState(updatedCheckedState);
  };

  useEffect(() => {
    const storedExpiryTime = localStorage.getItem("otpExpiryTime");
    const currentTime = Date.now();

    // Check if expiry time exists and has passed
    if (storedExpiryTime && currentTime > parseInt(storedExpiryTime)) {
      // Remove expired data from localStorage
      localStorage.removeItem("verifiedData");
      localStorage.removeItem("verifiedMobileNumber");
      localStorage.removeItem("verifiedOtp");
      localStorage.removeItem("otpExpiryTime");
      setVerifyListData([]); // Clear the state if needed
    } else {
      // If data is still valid, load it
      const storedData = localStorage.getItem("verifiedData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setVerifyListData(parsedData); // Update the state with the parsed data
      }
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("memberInfoDataLocal");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMemberInfoData(parsedData); // Update the state with the parsed data
    }
  }, []);

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
    // console.log("e.target.value..", e.target.value);
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
          // donation_type: "regular"
          donation_type: donationType.toLowerCase(),
          donation_block_id: params.id,
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
  }, [donationType]);

  //Retrieve - Info
  // const handleRetrieveInfo = async () => {
  //   try {
  //     if (!emailPattern.test(retrieveInformation)) {
  //       notify("Please enter valid email address");
  //       return;
  //     }

  //     const data = {
  //       url: apiUrl,
  //       page: "donation",
  //       email: retrieveInformation,
  //     };
  //     const response = await retrieveInfo(data);
  //     if (response.data.responseBody.donaterData.length === 0) {
  //       notify("No data found please fill up the form");
  //       return;
  //     }

  //     if (response.data.responseBody.verify_status === false) {
  //       setResponse(response);
  //       notify("Please verify email");
  //       return;
  //     }

  //     setIsVerified(response.data.responseBody.verify_status);

  //     console.log("Response from retrieve info", response.data.responseBody);
  //     setResponse(response);
  //   } catch (error) {
  //     console.error("Error sending email data", error);
  //   }
  // };

  //Terms and condition page
  const handleClick = (event) => {
    event.preventDefault();
    // navigate("/terms-conditions");
    window.open("/terms-conditions", "_blank");
  };

  const params = useParams();
  
  const fetchBankDetails = async () => {
    try {
      const response = await getBranch({
        url: apiUrl,
        page: "donation",
        branch_id: params.id,
      });
            if (response.data.status === true) {
        if (response.data.responseBody.blogs) {
          setBankDetails(response.data.responseBody);
        } else {
          // notify("Please select branch")
          // setTimeout(() => {
          navigate("/donation?invalid_branch=true");
          // }, 1500);
        }
              } else {
        console.error("Error updating data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (params && params.id) {
            fetchBankDetails();
    }
  }, [params.id]);

  //Send - OTP
  const handleSendOtp = async () => {
    if (!mobileNumber) {
      notify("Please Enter Your Mobile Number");
      return;
    }
    try {
      const data = {
        url: apiUrl,
        page: "donation",
        blog_id: params.id,
        // email: formData.email,
        mobile_number: mobileNumber,
      };
      const response = await sendOtp(data);
      if (response.status === 200 || response.status === 201) {
                setOtpError(null);
                successNotify(response.data.message);

        setIsSendOtpDisabled(true);
        // setIsReSendOtpDisabled(false);
        setIsVerifyOtpDisabled(false);
        setTimeLeft(30);
        setOtp("");
        setIsOtpVerified(false);
      }
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

  const handleVerifyOTP = async () => {
    try {
      const data = {
        url: apiUrl,
        page: "donation",
        blog_id: params.id,
        mobile_number: mobileNumber,
        otp: otp,
      };

      const response = await verifyOtp(data);
      if (response.data.status === true) {
        setVerifyListData(response.data.responseBody);
        localStorage.setItem(
          "verifiedData",
          JSON.stringify(response.data.responseBody)
        );
        setIsOtpVerified(true);
        setIsVerifyOtpDisabled(true);
        setIsSendOtpDisabled(true);
        setIsReSendOtpDisabled(true);

        const expiryTime = Date.now() + 10 * 60 * 1000;
        localStorage.setItem("verifiedMobileNumber", mobileNumber);
        localStorage.setItem("verifiedOtp", otp);
        localStorage.setItem("otpExpiryTime", expiryTime.toString());
        localStorage.setItem("selectedCountryISO", selectedCountryISO);

        successNotify(response.data.message);
      } else {
        notify("Invalid OTP Please Enter A Valid OTP");
      }
    } catch (error) {
      notify(
        error?.response?.data?.message ?? "Invalid OTP Please Enter A Valid OTP"
      );
    }
  };

  const handleReSendOTP = async () => {
    //if api call sycess add this two
    // setIsReSendOtpDisabled(true);
    // setTimeLeft(30);
    try {
      const data = {
        url: apiUrl,
        page: "donation",
        blog_id: params.id,
        mobile_number: mobileNumber,
      };
      const response = await sendOtp(data);
      if (response.status === 200 || response.status === 201) {
                setIsReSendOtpDisabled(true);
        setTimeLeft(30);
      }
    } catch (error) {
      if (error.response?.data?.code === 422) {
        setOtpError(error?.response?.data?.message?.toString());
        notify(error?.response?.data?.message?.toString());
        return;
      }
      console.error("Error data", error);
    }
  };

  useEffect(() => {
    const verifiedNumber = localStorage.getItem("verifiedMobileNumber");
    const verifiedOtp = localStorage.getItem("verifiedOtp");

    if (verifiedNumber) {
      setMobileNumber(verifiedNumber);
      setIsSendOtpDisabled(true);
    }

    if (verifiedOtp) {
      setOtp(verifiedOtp);
      setIsVerifyOtpDisabled(true);
      setIsOtpVerified(true);
    }
  }, []);

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
        middleName: data.middle_name || "",
        country: data.country || "",
        email: data.email || "",
        mobileNumber: data.mobile_number || "",
        cardType: "Aadhar card",
        note: "",
        address: "",
      });
    }
  }, [response]);
  // console.log("country", formData.country);

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  useEffect(() => {
    // Check if the user is returning after a successful redirect
    if (sessionStorage.getItem("redirectBack") === "true") {
      // Remove the flag to prevent infinite back navigation
      sessionStorage.removeItem("redirectBack");

      // Navigate to the previous page
      navigate(-1);
    }
  }, [navigate]);

  //Paymet  - API
  const handlePayment = async () => {
    try {
      if (mobileNumber === "") {
        notify("Please Enter Your Mobile Number");
        return;
      }

      
      //check this accroding to requirement

      // if (isOtpVerified === false) {
      //   notify("Please Verify mobile number first");
      //   return;
      // }

      if (
        Array.isArray(members) &&
        members.length > 0 &&
        selectedMember === null
      ) {
        notify("Please Select Member First");
        return;
      }

            if (
        selectedCountryISO !== "us" &&
        (formData.cardNumber == "" || isValidCard == false)
      ) {
        notify("Please Enter Valid Card Details");
        return;
      }

      if (isEmpty(selectedDonationId) && !otherDonationValue) {
        notify("Please Enter Or Select Donation");
        return;
      }

      if (showOtherInput === true) {
        setSelectedDonationId({
          ...selectedDonationId,
          others: otherDonationValue,
        });
      }

      // if (!formData.firstName || !formData.middleName || !formData.surname) {
      //   notify("Please Fill Personal Information");
      //   return;
      // }

            if (
        !formData.firstName?.trim() ||
        !formData.middleName?.trim() ||
        !formData.surname?.trim()
      ) {
        notify("Please Fill Personal Information");
        return;
      }

      if (!formData.city) {
        notify("Please enter a city");
        return;
      }

      // Check if donationType is "Anamat" and no date is selected
      if (donationType === "Anamat" && !selectedFormDate) {
        notify("Please Select A Date For Anamat Donation");
        return;
      }

      // const formattedAnamatDate = dayjs(selectedFormDate).format('DD/MM/YYYY');
      const formattedAnamatDate =
        donationType === "Anamat"
          ? dayjs(selectedFormDate).format("DD/MM/YYYY")
          : null;

      const data = {
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "donation",
        donation_type: donationType.toLowerCase(),
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.surname,
        country: selectedCountryISO,
        ...(donationType === "Anamat" && { anamat_date: formattedAnamatDate }),
        // anamat_date: formattedAnamatDate,
        adhar_or_pancard: formData.cardNumber,
        mobile_number: mobileNumber,
        email: formData.email,
        city: formData.city,
        amount: total,
        note: formData.note,
        blog_id: params.id,
        donation_ids:
          showOtherInput && otherDonationValue
            ? {
                ...selectedDonationId,
                others: otherDonationValue,
              }
            : selectedDonationId,
      };

      
      localStorage.setItem("verifiedData", JSON.stringify(data));
      localStorage.setItem("validCard", isValidCard);
      setFormData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        middleName: data.middle_name || "",
        city: data.city || "",
        mobileNumber: data.mobile_number || "",
        note: data.note,
        cardType: "Aadhar card",
        cardNumber: data.adhar_or_pancard,
        email:data.email,
      });

      const response = await paymentData(data);
                  if (response.data.status === true) {
        // window.open(response.data.responseBody.url);
        // Set a flag to detect that the user will return after redirection
        sessionStorage.setItem("redirectBack", "true");
        window.location.href = response.data.responseBody.url;
        clearAllField();
      }
    } catch (error) {
      console.error("Error", error);
      if (error.response?.data?.code === 422) {
        notify(error?.response?.data?.message);
        return;
      }
    }
  };

  useEffect(() => {
    if (clearData === true) {
      setSelectedCountryISO(selectedCountryISO);
      setSelectedCountryCode(selectedCountryCode);
      setClearData(false);
    }
  }, [clearData]);

  const clearAllField = () => {
        setFormData({
      firstName: "",
      lastName: "",
      middleName: "",
      cardNumber: "",
      surname: "",
      city: "",
      cardType: "Aadhar card",
      country: selectedCountryISO,
      email: "",
      mobileNumber: "",
      note: "",
      address: "",
    });
    setClearData(true);

    setIsValidEmail(false);
    setSelectedDonationId({});
    resetSelectedDonorId();
    setTotal(0);
    setRetrieveInformation("");
    setIsVerified(false);
    setResponse(null);
  };
    const handleChangeMobileNumber = (value, country) => {
    // Clear OTP if the mobile number changes
    if (mobileNumber !== value) {
      setMobileNumber(value);
      setOtp(""); // Clear OTP input
      setIsSendOtpDisabled(false); // Enable "Send OTP" button
      setIsVerifyOtpDisabled(true); // Disable "Verify" button
      setIsOtpVerified(false); // Reset OTP verification status
    }
  };

  const handleChangeNote = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, note: value });
      };

  // const handleChangeAddress = (e) => {
  //   const value = e.target.value;
  //   setFormData({ ...formData, address: value });
  //   console.log(formData);
  // };

  // const handleChangeAddress = (e) => {
  //   const value = e.target.value;
  //   const words = value.trim().split(/\s+/);
  //   if (words.length <= maxWords) {
  //     setFormData({ ...formData, address: value });
  //     setWordCount(words.length);
  //     } else {
  //       alert(`You can only type up to ${maxWords} words.`);
  //     }
  //   }
  // };

  const handleChangeAddress = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setFormData({ ...formData, address: value });
      setCharLimitExceeded(false);
    } else {
      setCharLimitExceeded(true);
    }
    // else {
    //   alert(`You can only type up to ${maxCharacters} characters.`);
    // }
  };

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

  const handleMemberChange = async (e) => {
    const selectedMemberId = e.target.value;
    setMemberName(selectedMemberId);
    localStorage.setItem("selectMemberIdData", selectedMemberId);

    // Find the selected member in your data
    const selectedMember = verifyListData.find(
      (member) => member.memberId === parseInt(selectedMemberId)
    );
    
    // Store the selected member in localStorage
    localStorage.setItem("selectedMemberData", JSON.stringify(selectedMember));

    // Retrieve the selectedMemberIdData from localStorage
    const selectedMemberIdData = localStorage.getItem("selectMemberIdData");

    // Retrieve the selectedMemberData from localStorage and parse it into an object
    const selectedMemberData = JSON.parse(
      localStorage.getItem("selectedMemberData")
    );

    // Ensure that selectedMemberData exists before accessing its properties
    if (selectedMemberData) {
      const params = {
        url: process.env.NEXT_PUBLIC_API_URL,
        memberId: selectedMemberIdData,
        memberType: selectedMemberData.memberType,
      };

      // Make the API call
      const resp = await getMemberData(params);
      if (resp.data.status === true) {
        setMemberInfoData(resp.data.requestBody.memberInfo);
        localStorage.setItem(
          "memberInfoDataLocal",
          JSON.stringify(resp.data.requestBody.memberInfo)
        );

        // Determine card type and number based on the member info
        const cardType =
          resp.data.requestBody.memberInfo.addProofType === "AADHAAR CARD"
            ? "Aadhar card"
            : resp.data.requestBody.memberInfo.addProofType === "PAN CARD"
            ? "Pan card"
            : "Aadhar card";

        const cardNumber =
          resp.data.requestBody.memberInfo.addProofType === "AADHAAR CARD"
            ? resp.data.requestBody.memberInfo.aadharNo || ""
            : resp.data.requestBody.memberInfo.addProofType === "PAN CARD"
            ? resp.data.requestBody.memberInfo.panNo || ""
            : resp.data.requestBody.memberInfo.aadharNo || "";

        // Update form data with member info
        setFormData({
          firstName: resp.data.requestBody.memberInfo.studentname,
          middleName: resp.data.requestBody.memberInfo.fathersname,
          surname: resp.data.requestBody.memberInfo.surname,
          email: resp.data.requestBody.memberInfo.email,
          cardType: cardType,
          cardNumber: resp.data.requestBody.memberInfo.aadharNo
            ? resp.data.requestBody.memberInfo.aadharNo
            : resp.data.requestBody.memberInfo.panNo,
          city: resp.data.requestBody.memberInfo.cityVillage || "",
          note: resp.data.requestBody.memberInfo.note || "",
          mobileNumber: resp.data.requestBody.memberInfo.mobileNo,
        });

        // Validate the card
        validateCard(cardNumber, cardType);
      } else {
        setMemberInfoData([]);
      }
    } else {
      console.error("Selected member data is not available");
    }
  };

  useEffect(() => {
    // Check if a member has been selected previously
    const selectedMemberId = localStorage.getItem("selectMemberIdData");
    const selectedMemberData = localStorage.getItem("selectedMemberData");

    if (selectedMemberId && selectedMemberData) {
      setMemberName(selectedMemberId);
      setVerifyListData(JSON.parse(localStorage.getItem("verifiedData"))); // Ensure this is loaded if needed

      const parsedMemberData = JSON.parse(selectedMemberData);

            setFormData({
        firstName: parsedMemberData.firstName,
        middleName: parsedMemberData.fatherName,
        surname: parsedMemberData.lastName,
        cardType: parsedMemberData.aadharNo ? "Aadhar card" : "Pan card",
        cardNumber: parsedMemberData.aadharNo
          ? parsedMemberData.aadharNo
          : parsedMemberData.panNo,
        city: parsedMemberData.city || "",
        note: parsedMemberData.note || "",
        mobileNumber: parsedMemberData.fatherMobile,
        email: parsedMemberData.email,
      });

      // Optionally, make the API call to fetch additional data
      const params = {
        url: process.env.NEXT_PUBLIC_API_URL,
        memberId: selectedMemberId,
        memberType: parsedMemberData.memberType,
      };

      const fetchData = async () => {
        const resp = await getMemberData(params);
        if (resp.data.status === true) {
          setMemberInfoData(resp.data.requestBody.memberInfo);
          localStorage.setItem(
            "memberInfoDataLocal",
            JSON.stringify(resp.data.requestBody.memberInfo)
          );
        }
      };

      fetchData();
    }
  }, []);

  useEffect(() => {
    // Get verified data from localStorage
    const verifiedData = JSON.parse(localStorage.getItem("verifiedData"));

    if (verifiedData) {
      // Set form data using the parsed verified data
      setFormData({
        firstName: verifiedData.first_name, // First name
        middleName: verifiedData.middle_name, // Middle name
        surname: verifiedData.last_name, // Surname
        cardType: verifiedData.adhar_or_pancard ? "Aadhar card" : "Pan card", // Card type based on available data
        cardNumber: verifiedData.adhar_or_pancard, // Card number (either Aadhar or Pan)
        city: verifiedData.city || "", // City (default to empty string if not available)
        note: verifiedData.note || "", // Note (default to empty string if not available)
        mobileNumber: verifiedData.mobile_number, // Mobile number
        email: verifiedData.email, // Email (default to empty string if not available)
      });
    }
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const fetchMemberDetails = async (memberId, memberType) => {
  //   try {
  //     const response = await fetch(`/api/members/${memberId}`);
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching member details:", error);
  //   }
  // };

  // const fetchMemberDetails = async (memberId, memberType) => {
  //   try {
  //     const url = `https://mobapi-live.ssgd.org/Member/getMember?memberId=${memberId}&memberType=${memberType}`;
  //     const response = await fetch(url,
  //       {
  //         mode: 'no-cors',
  //         method: "GET",
  //         headers: {
  //           "access-control-allow-origin" : "*",
  //           "apitokenkey": "DD1C3A8C-DE04-4489-AED9-F54FE9CA1DBB",
  //           "appname": "SSGD_WEB_DONATE",
  //         }
  //       });
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching member details:", error);
  //   }
  // };

  // const fetchMemberDetails = async (memberId, memberType) => {
  //   try {
  //     const url = `https://mobapi-live.ssgd.org/Member/getMember?memberId=${memberId}&memberType=${memberType}`;
  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "accept": "*/*",
  //         "referer": "https://mobapi-live.ssgd.org/",
  //         "apitokenkey": "DD1C3A8C-DE04-4489-AED9-F54FE9CA1DBB",
  //         "appname": "SSGD_WEB_DONATE",
  //       }
  //     });
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching member details:", error);
  //   }
  // };

  useEffect(() => {
    fetchMemberDetails();
  }, []);

  const fetchMemberDetails = async (memberId, memberType) => {
    try {
      // memberId = "3326";
      // memberType = "Member";
      // setSelectedMember("jsnjdn");

      if (memberId && memberType) {
        const response = await fetchDonationMembersList({
          url: process.env.NEXT_PUBLIC_API_URL,
          memberId: memberId,
          memberType: memberType,
        });
                const { memberInfo } = response.data.requestBody;

        const cardTYpe =
          memberInfo.addProofType === "AADHAAR CARD"
            ? "Aadhar card"
            : memberInfo.addProofType === "PAN CARD"
            ? "Pan card"
            : "Aadhar card";
        const cardNumber =
          memberInfo.addProofType === "AADHAAR CARD"
            ? memberInfo.aadharNo || ""
            : memberInfo.addProofType === "PAN CARD"
            ? memberInfo.panNo || ""
            : memberInfo.aadharNo || "";
        setFormData({
          firstName: memberInfo.studentname || "",
          middleName: memberInfo.fathersname || "",
          surname: memberInfo.surname || "",
          cardType: cardTYpe,
          cardNumber: cardNumber,
          city: memberInfo.cityVillage || "",
          note: memberInfo.note || "",
          email: memberInfo.email || "",
        });
        validateCard(cardNumber, cardTYpe);
      }
    } catch (error) {
          }
  };

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const { state } = useLocation(); // Get the passed state
  const { donation_india, donation_usa, donation_abroad } = state || {};

  useEffect(() => {
    if (donation_india === "1") {
      setSelectedCountryISO("in");
    } else if (donation_usa === "1") {
      setSelectedCountryISO("us");
    } else if (donation_abroad === "1") {
      setSelectedCountryISO("GB");
    }
  }, [donation_india, donation_usa, donation_abroad]);

    // const handleChangeCountry = async (event) => {
  //   const selectedCountryValue = event.target.value;
  //   setSelectedCountry(selectedCountryValue);
  //   console.log("SelectedCountry", selectedCountryValue);
  //   const data = {
  //     name: selectedCountryValue,
  //   };
  //   console.log("data123country", data);
  //   try {
  //     const response = await getState(data);
  //     if (response.status === 200 || response.status === 201) {
  //       console.log("stateResponse", response.data.states);
  //       setState(response.data.states);

  //     }
  //   } catch (error) {
  //     console.error("Error sending form data:", error);
  //   }
  // };

  useEffect(() => {
    if (localStorage.getItem("selectedCountryISO") !== selectedCountryISO) {
      setIsOtpVerified(false);
      setOtp("");
      setVerifyListData("");
      setFormData({
        firstName: "",
        middleName: "",
        surname: "",
        cardType: "Aadhar card",
        cardNumber: "",
        city: "",
        note: "",
        email: "",
      });
    } else {
      localStorage.getItem("verifiedOtp");
      localStorage.getItem("verifiedData");
      localStorage.getItem("selectedMemberData");
    }
  }, [selectedCountryISO]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleClickimageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
    setOpenImageModal(true);
  };

  const handleClose = () => {
    setOpenImageModal(false);
  };

  const handleDonationTypeChange = (event) => {
    setDonationType(event.target.value);
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
 
      <ToastContainer />
      {/*  ====================  Donation types button start  ====================  */}
      <Container className="donation-page">
        <div className="select-donation-wrap">
          <div className="branch-name-wrap">
            <h5>Welcome to {bankDetails?.blogs?.blog_title}</h5>
          </div>
          <div className="select-donation-inner-wrap">
            <div>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="Regular"
                  name="radio-buttons-group"
                  className="donation-type-button"
                  value={donationType}
                  onChange={handleDonationTypeChange}
                >
                  <FormControlLabel
                    value="Regular"
                    control={
                      <Radio
                        sx={{
                          color: "#08416b",
                          "&.Mui-checked": {
                            color: "#08416b",
                          },
                        }}
                      />
                    }
                    label="Regular"
                  />
                  <FormControlLabel
                    value="Anamat"
                    control={
                      <Radio
                        sx={{
                          color: "#08416b",
                          "&.Mui-checked": {
                            color: "#08416b",
                          },
                        }}
                      />
                    }
                    label="Anamat"
                  />
                  {/* <FormControlLabel
                  value="Recurring"
                  control={
                    <Radio
                      sx={{
                        color: "#08416b",
                        "&.Mui-checked": {
                          color: "#08416b",
                        },
                      }}
                    />
                  }
                  label="Recurring"
                /> */}
                </RadioGroup>
              </FormControl>
            </div>
            <div>
              {donationType === "Anamat" && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoItem label="Select Date">
                    <DesktopDatePicker
                      value={selectedFormDate}
                      onChange={handleFormdateChange}
                      className="custom-input"
                      disablePast
                      renderInput={(params) => (
                        <TextField {...params} className="custom-input" />
                      )}
                    />
                  </DemoItem>
                </LocalizationProvider>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/*  ====================  Donation types button end  ====================  */}

      {/*  ====================  Retrieve Information start  ====================  */}
      <Container className="pt-4">
        <div className="donation-input-wrap">
          {/* <div></div> */}
          <div className="donation-phone-input">
            <label className="retrieve-info-label">
              Enter your mobile number
            </label>

            <PhoneInput
              country={selectedCountryISO}
              enableSearch={true}
              value={mobileNumber}
              name="mobileNumber"
              onChange={handleChangeMobileNumber}
              countryCodeEditable={false}
              inputStyle={{
                width: "100%",
                paddingRight: "40px",
                height: "37px",
                marginBottom: "0px",
              }}
            />

            {/* <input
              type="number"
              className="form-control"
              aria-describedby="basic-addon2"
              name="mobileNumber"
              value={mobileNumber}
              onChange={(e) => handleChangeMobileNumber(e.target.value)}
              inputStyle={{
                width: "100%",
                paddingRight: "40px",
                height: "37px",
                marginBottom: "0px",
              }}
            /> */}
            <button
              className={isSendOtpDisabled ? "btn1-disable" : "btn1"}
              disabled={isSendOtpDisabled}
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </div>
          <div className="input-group donation-otp">
            <input
              inputRef={textFieldRef}
              // type="email"
              className="form-control"
              placeholder="Enter OTP"
              aria-label="Enter OTP"
              aria-describedby="basic-addon2"
              value={otp}
              onChange={handleChangeOtp}
              disabled={isOtpVerified}
              onKeyDown={handleTextFieldKeyDown}
            />
            <div className="input-group-append">
              <button
                ref={buttonRef}
                // className="input-group-text donation-verify-btn"
                id="basic-addon2"
                onClick={handleVerifyOTP}
                className={
                  isVerifyOtpDisabled
                    ? "input-group-text donation-verify-btn-disable"
                    : "input-group-text donation-verify-btn"
                }
                disabled={isVerifyOtpDisabled}
              >
                {isOtpVerified ? "Verified" : "Verify"}
              </button>
            </div>
          </div>
          <div className="donaion-resend-btn-wrap">
            <button
              className={
                isReSendOtpDisabled
                  ? "donation-disabled-btn"
                  : "donation-resend-otp-btn"
              }
              disabled={isReSendOtpDisabled}
              onClick={handleReSendOTP}
            >
              {" "}
              {isReSendOtpDisabled && timeLeft !== null ? (
                <>
                  Resend OTP in {timeLeft}s
                  {/* <CircularProgress
                    variant="determinate"
                    value={(1 - timeLeft / 30) * 100}
                    size={20} // Size of the progress bar
                    style={{ marginLeft: "10px" }}
                  /> */}
                </>
              ) : (
                "Resend OTP"
              )}
            </button>
          </div>
        </div>
        {Array.isArray(verifyListData) && verifyListData.length > 0 && (
          <select
            className="form-select branch-selection my-3"
            aria-label="Default select example"
            value={memberName}
            onChange={handleMemberChange} // Use onChange instead of onClick for proper selection handling
          >
            <option value="" disabled hidden>
              Please select a member
            </option>
            {verifyListData.map((member) => (
              <option key={member.memberId} value={member.memberId}>
                {member.firstName} {member.middleName} {member.lastName}
              </option>
            ))}
          </select>
        )}
      </Container>

      {/*  ====================  Retrieve Information end  ====================  */}
      <Container className="">
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
                    {/* ==================== Donation list start  ==================== */}
                    {donationList.map(({ title, amount, image }, index) => {
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
                            {image ? <div onClick={() => handleClickimageModal(image)}>
                              <img src={image} className="donation-image" alt="donationImage"/>
                            </div> : ""}
                            
                          </div>
                        </div>
                      );
                    })}

                    {/*  ==================== Donation list end  ==================== */}
                    {/* ==================== Other donation start ==================== */}
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
                    {/*  ==================== Other donation end  ==================== */}
                  </div>
                </Grid>
                {/* View image */}

                {/* ==================== Selected donation list start ==================== */}
                <div>
                  <div className="donation-summary-title">
                    <div className="">DONATION SUMMARY:</div>
                  </div>
                  <div className="right-section-summary">
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
                {/* ==================== Selected donation list end ==================== */}
                {/* ==================== Total amount start ==================== */}
                <div>
                  <div className="donation-total">
                    <div>Total:</div>
                    <div>
                      {currencySymbol}
                      {getFormattedPrice(total)}
                    </div>
                  </div>
                </div>
                {/* ==================== Total amount end ==================== */}
              </AccordionDetails>
            </Accordion>
          </Accordion>
        </div>
      </Container>
      <Container>
        <div className="OR">OR</div>
      </Container>
      {/*  ==================== Personal Info start  ==================== */}
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
                    className="form-control donation-input "
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    aria-label="Username"
                    disabled={selectedMember && formData.firstName !== ""}
                    aria-describedby="basic-addon1"
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
                    id="middlename"
                    name="middleName"
                    className="form-control donation-input"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Middle Name"
                    aria-label="middlename"
                    disabled={selectedMember && formData.middleName !== ""}
                    aria-describedby="basic-addon1"
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
                    id="surname"
                    name="surname"
                    className="form-control donation-input"
                    placeholder="Last Name"
                    aria-label="surname"
                    aria-describedby="basic-addon1"
                    value={formData.surname}
                    onChange={handleChange}
                    disabled={selectedMember && formData.surname !== ""}
                  />
                </div>
              </div>
         
            </div>
          </div>
          <div className="tt">
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
                    placeholder="Email"
                    aria-label="email"
                    aria-describedby="basic-addon1"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={selectedMember && formData.email !== ""}
                  />
                </div>
              </div>
            {selectedCountryISO != "us" && (
              <>
                <div className="ff">
                  <div className="donation-aadharcard-dropdown">
                    <div>
                      <div className="donation-card-selection">
                        <select
                          onChange={handleCardTypeChange}
                          value={formData.cardType}
                          className="dropdown-aadharcard"
                          disabled={
                            selectedMember && formData.cardNumber !== ""
                          }
                        >
                          <option value="Aadhar card">Aadhar card</option>
                          <option value="Pan card">Pan card</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        className="donation-aadhar-input"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        disabled={
                          selectedMember &&
                          formData.cardNumber !== "" &&
                          isValidCard
                        }
                        maxLength={12}
                        onKeyPress={(e) => {
                          if (!/^\d$/.test(e.key)) {
                            e.preventDefault(); // Prevents non-numeric input
                          }
                        }}
                      />

                    </div>
                    <p
                      className="donation-validation-message1"
                      style={{
                        marginTop: isValidationVisible ? "-22px" : "0px",
                        visibility: isValidationVisible ? "visible" : "hidden",
                        color: isValidCard ? "green" : "red",
                        fontSize: "14px",
                        width: "max-content",
                      }}
                    >
                      {validationMessage}
                    </p>
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
                    <div className="terms-condition-wrap">
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
              </>
            )}

            <div className="donation-note-wrap">
              <div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    <FaCity className="donation-icon" />
                  </span>
                  {selectedCountryISO === "us" ? (
                    <>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className="form-control donation-input"
                        placeholder="City"
                        value={formData.city}
                        ref={cityInputRef}
                        onChange={handleChangeData} // Track input changes
                        aria-label="City"
                        aria-describedby="basic-addon1"
                        disabled={selectedMember && formData.city !== ""}
                      />
                      {suggestions.length > 0 && (
                        <ul
                          className="dropdown"
                          style={{
                            position: "absolute",
                            zIndex: 1000,
                            width: "100%",
                            background: "#fff",
                            border: "1px solid #ccc",
                            listStyleType: "none",
                            padding: 0,
                            margin: 0,
                            borderRadius: "5px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            top: "50px",
                            height: "207px",
                            overflow: "auto",
                          }}
                        >
                          {suggestions.map((suggestion) => (
                            <li
                              key={suggestion.place_id}
                              onClick={() =>
                                handleSelectCity(suggestion.description)
                              }
                              style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              {suggestion.description}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="form-control donation-input"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      disabled={selectedMember && formData.city !== ""}
                    />
                  )}
                </div>
              </div>
              <div className="form-floating mb-3">
                <textarea
                  className="form-control donation-textarea"
                  id="note"
                  name="note"
                  placeholder="Leave a comment here"
                  value={formData.note}
                  onChange={handleChange}
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
        {/* ==================== View image Modal start ==================== */}
        {openImageModal && (
          <div className="dialog-overlay">
            <Card className="dialog-content-donation">
              <div className="video-container">
                <div className="close-btn-donation">
                  <CgCloseO onClick={handleClose} />
                </div>
                <img
                  src={selectedImage}
                  className="donation-modal-image"
                  // style={{ width: "100%", height: "400px" }}
                />
              </div>
            </Card>
          </div>
        )}
        {/* ==================== View image Modal end ==================== */}
      </Container>
      {/*  ==================== Personal Info end  ==================== */}
    </>
  );
}
