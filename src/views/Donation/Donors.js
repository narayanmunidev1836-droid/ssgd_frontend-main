"use client";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "../../common/routerCompat.js";
import { fetchDonation, fetchNavbarData } from "../../api/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Donors.css";
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
import DonationShimmer from "./DonationShimmer";
import AOS from "aos";
import "aos/dist/aos.css";
import _donationHeader from "../../assets/images/donationHeader.png";
import _donationBackground from "../../assets/images/donationBackground.png";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import {
  FaBarcode,
  FaFlagUsa,
  FaGlobe,
  FaHashtag,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlane,
  FaUniversity,
  FaUser,
} from "react-icons/fa";

// Per-section look: icon and subtitle above the cards, and the card header tone
const sectionMeta = {
  list_blogs_india: { tone: "india" },
  list_blogs_usa: {
    tone: "usa",
    // icon: <FaFlagUsa />,
    subtitle: "Support Swaminarayan Sanskardham's activities in the USA.",
  },
  list_blogs_abroad: {
    tone: "abroad",
    // icon: <FaPlane />,
    subtitle: "For funds transfer from outside India, use the account details below.",
  },
  list_blogs_others: { tone: "others" },
};

// Icon for each bank detail row, matched on its label
const fieldIcon = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("account name")) return <FaUser />;
  if (t.includes("bank name")) return <FaUniversity />;
  if (t.includes("a/c") || t.includes("account no")) return <FaHashtag />;
  if (t.includes("ifsc") || t.includes("swift")) return <FaBarcode />;
  if (t.includes("branch") || t.includes("address")) return <FaMapMarkerAlt />;
  if (t.includes("information")) return <FaPhoneAlt />;
  if (t.includes("type")) return <FaGlobe />;
  return null;
};


const donationHeaderBg = _donationHeader.src;
const donationPageBg = _donationBackground.src;


const Donors = () => {
  const [blogData, setBlogData] = useState({});
  const [loader, setLoader] = useState(true);
  const [qrDialog, setQrDialog] = useState(null);
  const qrDialogRef = useRef(null);

  const [country, setCountry] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const navigate = useNavigate();
  const notify = (msg) => {
    toast.error(msg, {
      position: "top-right",
    });
  };
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  const location = useLocation();

  useEffect(() => {
    const params = location.search;
    // Parse query parameters using URLSearchParams
    const queryParams = new URLSearchParams(location.search);

    // Get the 'invalid_branch' parameter value
    const invalidBranchParam = queryParams.get("invalid_branch");

    // Set state based on the query parameter value
    if (invalidBranchParam === "true") {
      notify("Please select branch");
      if (location.search) {
        // Remove query parameters by navigating to the same path without them
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetchDonation({
  //         url: apiUrl,
  //         page: "donation_blog",
  //       });
  //       if (response.data.status === true) {
  //         setBlogData(response.data.responseBody);
  //         console.log("Update successful", response.data.responseBody);
  //       } else {
  //         console.error("Error updating data:", response.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoader(false); // Set loader to false after data is fetched
  //     }
  //   };
  //   fetchData();
  // }, []);

  const handleOnlineClick = (blog) => {
    if (blog.donation_india == 1) {
      window.open(
        "https://members.shreebrahamanandvidhyalaya.in/DonationOnline/DonationOnline",
        "_blank"
      );
    } else {
      navigate(`/donationNew/${blog.id}`, {
        state: {
          donation_india: blog.donation_india,
          donation_usa: blog.donation_usa,
          donation_abroad: blog.donation_abroad,
          donation_others: blog.donation_others,
        },
      });
    }
  };

  const openQrDialog = (blog) => {
    setQrDialog({
      imageUrl: blog.qr_image,
      title: blog.blog_title,
    });
  };

  useEffect(() => {
    const dialog = qrDialogRef.current;
    if (!dialog || !qrDialog) {
      return undefined;
    }
    if (typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
    const onClick = (event) => {
      if ("closedBy" in HTMLDialogElement.prototype) {
        return;
      }
      if (event.target !== dialog) {
        return;
      }
      const rect = dialog.getBoundingClientRect();
      const clickedBackdrop =
        event.clientY < rect.top ||
        event.clientY > rect.top + rect.height ||
        event.clientX < rect.left ||
        event.clientX > rect.left + rect.width;
      if (clickedBackdrop) {
        dialog.close();
      }
    };
    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, [qrDialog]);



  const getTitle = (key) => {
    if (key === "list_blogs_usa") {
      return "Donation for Usa";
    }
    if (key === "list_blogs_india") {
      return "Donation for India";
    }
    if (key === "list_blogs_others") {
      return "Donation for others";
    }
    if (key === "list_blogs_abroad") {
      return "Donation for Abroad";
    }
    return "Donation";
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetchNavbarData({
  //         url: process.env.NEXT_PUBLIC_API_URL,
  //       });
  //       if (response.data.status == true) {
  //         const siteCountry = response.data.responseBody.site.country;
  //         setCountry(siteCountry);
  //         console.log(
  //           "response.data.responseBody.site1",
  //           response.data.responseBody
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoader(false); // Set loader to false after data is fetched
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchNavbar = fetchNavbarData({
      url: process.env.NEXT_PUBLIC_API_URL,
    }).then((response) => {
      if (response.data.status) {
        setCountry(response.data.responseBody.site.country);
      }
    });

    const fetchBlog = fetchDonation({
      url: apiUrl,
      page: "donation_blog",
    }).then((response) => {
      if (response.data.status) {
        setBlogData(response.data.responseBody);
      } else {
        console.error("Error updating blog data:", response.data);
      }
    });

    // Wait for both requests to finish
    Promise.all([fetchBlog])
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoader(false)); // Set loader to false only after both requests complete
  }, []);

  if (loader) {
    return <DonationShimmer />; // Show loader until both requests finish
  }


  const renderBlogSection = (key, blogs) => (
    <>
      <ToastContainer />
      <div className="dn-section-head">
        {sectionMeta[key]?.icon && (
          <span className="dn-section-icon">{sectionMeta[key].icon}</span>
        )}
        <h2 className="dn-section-title">{getTitle(key).toUpperCase()}</h2>
        {sectionMeta[key]?.subtitle && (
          <p className="dn-section-sub">{sectionMeta[key].subtitle}</p>
        )}
      </div>
      <div className={`dn-grid dn-tone-${sectionMeta[key]?.tone || "others"}`}>
        {blogs.map((blog, index) => {
          const blogDetails = JSON.parse(blog.details);
          return (
            <div key={index} className="dn-cell">
              <div className="bank-info-wrap" data-aos="fade-up">
                <div className="container">
                  <h4 className="bank-details">{blog.blog_title}</h4>
                  <div className="bank-info-grid">
                    {blogDetails.map((item, i) => (
                      <div className="bank-info-row" key={i}>
                        <div className="bank-info-label">
                          {fieldIcon(item.title)}
                          <span>{item.title}:</span>
                        </div>
                        <div className="bank-info-value">{item.detail ? item.detail : "-"}</div>
                      </div>
                    ))}
                  </div>

                </div>
                {(blog.is_online === "1" ||
                  (String(blog.is_qr) === "1" && blog.qr_image)) && (
                    <div className="donors-btn-wrap">
                      {blog.is_online === "1" && (
                        <button
                          type="button"
                          className="donors-btn"
                          onClick={() => handleOnlineClick(blog)}
                        >
                          Online Donation
                        </button>
                      )}
                      {String(blog.is_qr) === "1" && blog.qr_image && (
                        <button
                          type="button"
                          className="donors-btn"
                          onClick={() => openQrDialog(blog)}
                        >
                          View QR
                        </button>
                      )}
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const orderedKeys = () => {
    const defaultOrder = [
      "list_blogs_usa",
      "list_blogs_india",
      "list_blogs_others",
      "list_blogs_abroad",
    ];
    if (country === "INDIA") {
      return [
        "list_blogs_india",
        "list_blogs_usa",
        "list_blogs_others",
        "list_blogs_abroad",
      ];
    }
    if (country === "USA") {
      return [
        "list_blogs_usa",
        "list_blogs_india",
        "list_blogs_others",
        "list_blogs_abroad",
      ];
    }
    return defaultOrder;
  };

  return (
    <>
      <div
        className="dn-hero"
        style={{ "--dn-hero-bg": `url('${donationHeaderBg}')` }}
      >
        <div className="dn-hero-content">
          <h1 className="dn-hero-title">Donations</h1>
          <p className="dn-hero-subtitle">
            Support a brighter future through seva, education and service
          </p>
        </div>
        <div className="breadcrumbs-wrap">
          <CommonBreadcrumbs
            items={[
              { label: "Home", url: "/" },
              <label key="donations" className="active-link-color">
                Donations
              </label>,
            ]}
            separator="›"
          />
        </div>
      </div>
      <div
        className="dn-page"
        style={{ "--dn-page-bg": `url('${donationPageBg}')` }}
      ><div className="dn-container">
          {/* {Object.keys(blogData).map((key) => {
        if (Array.isArray(blogData[key]) && blogData[key].length > 0) {
          return <div key={key}>{renderBlogSection(key, blogData[key])}</div>;
        }
        return null;
      })} */}
          {orderedKeys().map((key) => {
            if (Array.isArray(blogData[key]) && blogData[key].length > 0) {
              return <div key={key}>{renderBlogSection(key, blogData[key])}</div>;
            }
            return null;
          })}
          <dialog
            ref={qrDialogRef}
            className="qr-fullscreen-dialog"
            closedby="any"
            aria-labelledby="qr-dialog-title"
            onClose={() => setQrDialog(null)}
          >
            <form method="dialog" className="qr-fullscreen-dialog-inner">
              <h2 id="qr-dialog-title" className="qr-dialog-title">
                {qrDialog?.title ? `${qrDialog.title} QR Code` : "QR Code"}
              </h2>
              {qrDialog?.imageUrl && (
                <img
                  src={qrDialog.imageUrl}
                  alt={qrDialog.title ? `${qrDialog.title} QR Code` : "QR Code"}
                />
              )}
              <button type="submit" className="qr-dialog-close" aria-label="Close QR code">
                ×
              </button>
            </form>
          </dialog>
        </div></div>
    </>
  );
};

export default Donors;
