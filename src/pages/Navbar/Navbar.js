import React, { useEffect, useState } from "react";
// import navbarlogo from "../../assets/images/navbarlogo.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { HiPlus } from "react-icons/hi";
import { FiAlignRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { fetchNavbarData } from "../../api/API";
import NavbarLoader from "../../common/NavbarLoader/NavbarLoader";
import "./Navbar.css";
import ImageComponentNavBar from "../Home/ImageComponentNavBar";
import Header from "../Header/Header";
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
import { Offcanvas } from "bootstrap";
import { FormattedText } from "../../common/UrlFormate/FormatedText";

function Navbar() {
  const [activeNavLink, setActiveNavLink] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [siteName, setSiteName] = useState();
  const [donation, setdonation] = useState();
  const [publicationList, setPublicationList] = useState();
  const [activityId, setActivityId] = useState();
  const [navActivityIds, setNavActivityIds] = useState([]);
  const [navbarLogo, setNavbarLogo] = useState();
  const [isNavbarLogoLoaded, setIsNavbarLogoLoaded] = useState(false);
  const [pages, setPages] = useState({});
  const [site, setSite] = useState({});
  const [loader, setLoader] = useState(true);
  const [isActivitiesDropdownOpen, setIsActivitiesDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickDonation = () => {
    if (site.donation_site === "own_website") {
      navigate("/donation");
    } else if (
      site.donation_site === "other_website" &&
      site.donation_page_url
    ) {
      window.open(site.donation_page_url, "_blank");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNavbarData({
          url: process.env.REACT_APP_API_URL,
        });
        if (response.data.status == true) {
          const responseBody = response.data.responseBody || {};
          const site = responseBody.site || {};
          setApiData(responseBody.nav_activity || []);
          setSiteName(site.name);
          if (site.name) {
            localStorage.setItem("siteName", site.name);
          }
          setdonation(site.donation);
          setPublicationList(responseBody.nav_publication || []);
          setNavbarLogo(site.logo);
          setSite(site);
          setIsNavbarLogoLoaded(true);
          setActivityId(responseBody?.nav_activity);
          setPages(responseBody?.pages || {});
          //Google analytics script add in index.html file
          const googleAnalyticsScript = site.google_analytics;
          const isValidAnalyticsScript =
            typeof googleAnalyticsScript === "string" &&
            /gtag|ga\(|googletagmanager|google-analytics|GTM-/i.test(
              googleAnalyticsScript
            );
          if (isValidAnalyticsScript) {
            // Remove any existing script tag if it was previously added
            const existingScript = document.getElementById(
              "google-analytics-script"
            );
            if (existingScript) {
              existingScript.remove();
            }
            // Clean the script content and add it to the document
            const cleanedScript = googleAnalyticsScript
              .replace(/<\/?script[^>]*>/g, "")
              .trim();
            const scriptElement = document.createElement("script");
            scriptElement.id = "google-analytics-script";
            scriptElement.type = "text/javascript";
            scriptElement.appendChild(document.createTextNode(cleanedScript));
            document.body.appendChild(scriptElement);
            // Execute Google Analytics (if window.ga exists)
            if (window.ga) {
              window.ga("set", "page", location.pathname); // Set the current page
              window.ga("send", "pageview"); // Send the pageview event
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoader(false); // Set loader to false after data is fetched
      }
    };

    fetchData();
  }, []);

  //Google analytics script add in index.html file
  useEffect(() => {
    if (window.ga) {
      window.ga("set", "page", location.pathname);
      window.ga("send", "pageview");
    }
  }, [location]);

  const containsActivity = (name) => {
    return location.pathname.includes(name);
  };

  useEffect(() => {
    const pathName = location.pathname;
    setActiveNavLink(pathName === "/audio-list");
  }, [location]);

  const handlePageClick = async (id, name, website_page, pageUrl) => {
    if (website_page === "other_website") {
      window.open(pageUrl, "_blank");
    } else {
      navigate(`/custome-page/${name}/${id}`);
    }
  };

  const closeOffcanvas = () => {
    // const offcanvasElement = document.querySelector(".offcanvas");
    // const offcanvasInstance =
    //   window.bootstrap.Offcanvas.getInstance(offcanvasElement);
    // offcanvasInstance.hide();
  };

  useEffect(() => {
    const offcanvasEl = document.getElementById("offcanvasNavbar");
    if (offcanvasEl) {
      const bsOffcanvas = new Offcanvas(offcanvasEl);

      // Optional: Cleanup to avoid multiple instances
      return () => {
        bsOffcanvas.dispose();
      };
    }
  }, []);

  // const handleNavLinkClick = (path) => {
  //   navigate(path);
  //   closeOffcanvas();
  // };

  //working - home link
  // const handleNavLinkClick = (path) => {
  //   navigate(path);
  //   closeOffcanvas();
  //   if (path === "/") {
  //     const homeLink = document.querySelector('.nav-link[href="/]');
  //     if (path === "/") {
  //       const homeLink = document.querySelector('.nav-link[href="/"]');
  //       if (homeLink) {
  //         homeLink.classList.add("active");
  //       }
  //     } else {
  //       const activeLinks = document.querySelectorAll(".nav-link.active");
  //       activeLinks.forEach((link) => link.classList.remove("active"));
  //     }
  //   }
  // };

  //2
  // const handleNavLinkClick = (path) => {
  //   navigate(path);
  //   closeOffcanvas();

  //   const activeLinks = document.querySelectorAll(".nav-link.active");
  //   activeLinks.forEach((link) => link.classList.remove("active"));

  //   const clickedLink = document.querySelector(`.nav-link[href="${path}"]`);
  //   if (clickedLink) {
  //     clickedLink.classList.add("active");
  //   }
  // };

  // working with dropdown
  const handleNavLinkClick = (path, isDropdown) => {
    if (!isDropdown) {
      navigate(path);
    }

    if (!isDropdown) {
      closeOffcanvas();
    }
    // const activeLinks = document.querySelectorAll(".nav-link.active");
    // activeLinks.forEach((link) => link.classList.remove("active"));

    // const clickedLink = document.querySelector(`.nav-link[href="${path}"]`);
    // if (clickedLink) {
    //   clickedLink.classList.add("active");
    // }
  };

  useEffect(() => {
    const offcanvasEl = document.getElementById("offcanvasNavbar");

    if (offcanvasEl) {
      offcanvasEl.addEventListener("hidden.bs.offcanvas", () => {
        // Reset body style manually in case Bootstrap doesn't do it
        document.body.style.overflow = "";
      });
    }

    // Clean up listener when component unmounts
    return () => {
      if (offcanvasEl) {
        offcanvasEl.removeEventListener("hidden.bs.offcanvas", () => {
          document.body.style.overflow = "";
        });
      }
    };
  }, []);


  useEffect(() => {
    const offcanvasEl = document.getElementById("offcanvasNavbar"); // Replace with actual ID
    if (!offcanvasEl) return;

    const handleOffcanvasHidden = () => {
      setIsActivitiesDropdownOpen(false);  // Reset dropdown state when offcanvas hides
    };

    offcanvasEl.addEventListener("hidden.bs.offcanvas", handleOffcanvasHidden);

    return () => {
      offcanvasEl.removeEventListener("hidden.bs.offcanvas", handleOffcanvasHidden);
    };
  }, []);


  return (
    <>
      <Header
        donation={donation}
        handleClickDonation={handleClickDonation}
        pages={pages}
      />
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-right-wrap">
            <NavLink className="navbar-brand" to="/">
              {/* {!isNavbarLogoLoaded && <NavbarLoader />} */}
              <ImageComponentNavBar
                src={navbarLogo}
                alt="logo"
                className="navbar-logo"
              // onLoad={() => setIsNavbarLogoLoaded(true)}
              />
            </NavLink>
            <div className="nav-text">
              {/* <h6>Brahmanand SanskarDham</h6> */}
              {/* <h6>{siteName}</h6> */}
            </div>
          </div>
          <button
            className="navbar-toggler d-xl-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <FiAlignRight className="toggler-iscon" />
          </button>

          <div className="navbar-wrap">
            <div className="navbar-text1 nav-elements">
              <ul className="nav-link-wrap">
                <li className="nav-item active">
                  <NavLink to="/" className="nav-link">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item dropdown">
                  <NavLink
                    className={`nav-link ${containsActivity("activities") ? "active" : "no-active"
                      }`}
                    to={`/activities`}
                  >
                    Activities
                    <HiPlus className="nav-icon" />
                  </NavLink>

                  <ul className="dropdown-menu">
                    {apiData &&
                      Object.values(apiData).map((item) => (
                      <li key={item.id}>
                        <NavLink
                          to={`/activities/${item.id}/${FormattedText(item.name)}`}
                         className={`dropdown-item ${decodeURIComponent(window.location.pathname) === `/activities/${item.id}/${FormattedText(item.name)}` ? "nav-link active" : ""}`}
                        >
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <NavLink
                    className={`nav-link ${containsActivity("publication-detail")
                      ? "active"
                      : "no-active"
                      }`}
                    to={
                      publicationList &&
                      `/publication-detail/${publicationList[0].id}/${publicationList[0].name.toLowerCase()}`
                    }
                  >
                    Publications
                    <HiPlus className="nav-icon" />
                  </NavLink>

                  <ul className="dropdown-menu">
                    {publicationList &&
                      publicationList.length > 0 &&
                      publicationList.map((item) => (
                        <li key={item.id}>
                          <NavLink
                           className={`dropdown-item ${window.location.pathname === `/publication-detail/${item.id}/${FormattedText(item.name)}` ? "nav-link active" : ""}`}
                            to={`/publication-detail/${item.id
                              }/${FormattedText(item.name)}`}
                          >
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                  </ul>
                </li>
                <li className="nav-item active">
                  <NavLink to="/branches" className="nav-link">
                    Branches
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/about-us"
                    className={`nav-link ${activeNavLink ? "active" : ""}`}
                  >
                    About Us
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contact-us" className="nav-link">
                    Contact Us
                  </NavLink>
                </li>
                {pages &&
                  Object.values(pages).map((page, index) => {
                    return page.highlight === "1" ? (
                      <button
                        key={index}
                        className="nav-item nav-link donation"
                        onClick={() =>
                          handlePageClick(
                            page.id,
                            page.name,
                            page.website_page,
                            page.page_url
                          )
                        }
                      >
                        {page.name}
                      </button>
                    ) : (
                      ""
                    );
                  })}
              </ul>
            </div>
          </div>

          {/* ===============  offcanvas =============== */}

          <div
            className="offcanvas offcanvas-start"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                <img src={navbarLogo} alt="logo" className="navbar-logo" />
              </h5>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body nav-elements">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a
                    data-bs-dismiss="offcanvas"
                    className="nav-link"
                    onClick={() => handleNavLinkClick("/")}
                  >
                    Home
                  </a>
                </li>

                {/* Activities Dropdown */}
                <li className="nav-item dropdown">
                  <NavLink
                    className={`nav-link ${containsActivity("activities") ? "active" : "no-active"}`}
                    data-bs-toggle="dropdown"
                    data-bs-dismiss={isActivitiesDropdownOpen ? "offcanvas" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      if (isActivitiesDropdownOpen) {
                        // If dropdown is open, close it and reset state
                        setIsActivitiesDropdownOpen(false);
                        navigate("/activities");
                      } else {
                        // If dropdown is closed, just open it
                        setIsActivitiesDropdownOpen(true);
                        handleNavLinkClick("/activities", true);
                      }
                    }}
                    to={`/activities`}
                  >
                    Activities <HiPlus className="nav-icon" />
                  </NavLink>

                  <ul className="dropdown-menu">
                    {apiData &&
                      Object.values(apiData).map((item, index) => (
                      <li key={item.id}>
                        <a
                          data-bs-dismiss="offcanvas"
                          key={index}
                          className={`dropdown-item ${window.location.pathname === `/activities/${item.id}/${FormattedText(item.name)}` ? " nav-link active" : ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavLinkClick(
                              `/activities/${item.id}/${FormattedText(item.name)}`,
                              false
                            );
                          }}
                          href={`/activities/${item.id}/${item.name}`}
                        >
                          {item.name}
                        </a>
                      </li>
                      )
                    )}
                  </ul>
                </li>

                {/* Publications Dropdown */}
                <li className="nav-item dropdown">
                  <NavLink
                    to={
                      publicationList &&
                      `/publication-detail/${publicationList[0].id}/${publicationList[0].name}`
                    }
                    // className="nav-link"
                    className={`nav-link ${containsActivity("publication-detail")
                      ? "active"
                      : "no-active"
                      }`}
                    data-bs-toggle="dropdown"
                    data-bs-dismiss={isActivitiesDropdownOpen ? "offcanvas" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      if (isActivitiesDropdownOpen) {
                        // If dropdown is open, close it and reset state
                        setIsActivitiesDropdownOpen(false);
                        navigate(
                          publicationList &&
                          `/publication-detail/${publicationList[0].id}/${publicationList[0].name}`
                        );
                      } else {
                        // If dropdown is closed, just open it
                        setIsActivitiesDropdownOpen(true);
                        handleNavLinkClick(
                          publicationList &&
                          `/publication-detail/${publicationList[0].id}/${publicationList[0].name}`,
                          true
                        );
                      }
                    }}
                  >
                    Publications
                    <HiPlus className="nav-icon" />
                  </NavLink>

                  <ul className="dropdown-menu">
                    {publicationList &&
                      publicationList.length > 0 &&
                      publicationList.map((item) => (
                        <li key={item.id}>
                          <a
                            data-bs-dismiss="offcanvas"
                            className={`dropdown-item ${window.location.pathname === `/publication-detail/${item.id}/${FormattedText(item.name)}` ? "nav-link active" : ""}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavLinkClick(
                                `/publication-detail/${item.id
                                }/${FormattedText(item.name)}`,
                                false
                              );
                            }}
                            href={`/publication-detail/${item.id
                              }/${item.name.toLowerCase()}`}
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                  </ul>
                </li>

                <li className="nav-item">
                  <a
                    data-bs-dismiss="offcanvas"
                    className={`nav-link  ${containsActivity("branches") ? "active" : "no-active"}`}
                    onClick={() => handleNavLinkClick("/branches")}
                  >
                    Branches
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    data-bs-dismiss="offcanvas"
                    className={`nav-link  ${containsActivity("about-us") ? "active" : "no-active"}`}
                    onClick={() => handleNavLinkClick("/about-us")}
                  >
                    About Us
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    data-bs-dismiss="offcanvas"
                    className={`nav-link  ${containsActivity("contact-us") ? "active" : "no-active"}`}
                    onClick={() => handleNavLinkClick("/contact-us")}
                  >
                    Contact Us
                  </a>
                </li>

                {pages &&
                  Object.values(pages).map((page) => {
                    return page.highlight === "1" ? (
                      <button
                        key={page.id}
                        data-bs-dismiss="offcanvas"
                        className="nav-item nav-link donation"
                        onClick={() =>
                          handlePageClick(
                            page.id,
                            page.name,
                            page.website_page,
                            page.page_url
                          )
                        }
                      >
                        {page.name}
                      </button>
                    ) : (
                      ""
                    );
                  })}

                {/* // {donation === "1" ? (
                //   <a className="nav-link donation responsive" href="#">
                //     Donate Now
                //   </a>
                // ) : (
                //   ""
                // )} */}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
