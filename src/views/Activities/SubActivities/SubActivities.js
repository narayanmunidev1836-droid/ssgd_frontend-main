"use client";
import React, { useState, useEffect, useRef } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import _imageNotFound from "../../../assets/images/NoImageFound.webp";
const imageNotFound = _imageNotFound.src;
import { useNavigate } from "../../../common/routerCompat.js";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import {
  fetchActivitiyList,
  fetchNavbarData,
  fetchSlider,
} from "../../../api/API";
import { useParams } from "../../../common/routerCompat.js";
import InnerpageLoader from "../../Home/InnerpageLoader";
import ActivityLoader from "../../../common/Loader/ActivityLoader";
import "./SubActivities.css";
import { TablePagination } from "@mui/material";
import FullpageLoader from "../../../common/HomeSliderLoader/FullpageLoader";
import { IoSearch } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { FormattedText } from "../../../common/UrlFormate/FormatedText";

const SubActivities = () => {
  const [activities, setActivities] = useState("");
    const [year, setYear] = useState("All");
  const [apiData, setApiData] = useState([]);
  const [banner, setBanner] = useState([]);

  const [filterActivities, setFilterActivities] = useState([]);
  const [filterYear, setFilterYear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialApiCall, setisInitialApiCall] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [totalData, setTotalData] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [headerData, setHeaderData] = useState([]);
  const [activityListLoader, setActivityListLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const params = useParams();

  useEffect(() => {
    if (params.activity_id) {
      setActivities(params.activity_id);
    } else {
      setActivities("All");
    }
  }, [params.activity_id]);

  // Remove this useEffect that's resetting page to 0
  // useEffect(() => {
  //   setPage(0); // Remove this
  // }, [searchData, year, activities]);
  
  // Modify the search effect
  useEffect(() => {
    if (searchData !== '') {
      setPage(1);
      setHasMore(true);
      setApiData([]);
    }
  }, [searchData]);
  
  // Update filter handlers
  const handleChangeYear = (event) => {
    setYear(event.target.value);
    setPage(1);
    setHasMore(true);
    setApiData([]);
  };
  
  const handleFilterChange = (event) => {
  const selectedValue = event.target.value;

  if (selectedValue === "All") {
    navigate("/activities");
  } else {
    const selectedItem = headerData.find((item) => item.id == selectedValue);

    if (selectedItem) {
      let name = FormattedText(selectedItem.name)
      navigate(`/activities/${selectedItem.id}/${name}`);
    }
  }
};
  
  const handleChangeActivity = (event) => {
    setActivities(event.target.value);
    setPage(1);
    setHasMore(true);
    setApiData([]);
    handleFilterChange(event);
  };
  
  useEffect(() => {
    if (activities) {
      fetchDatafromDropdown(activities);
    }
  }, [searchData, page, activities]);



  const fetchData = async () => {
    try {
      const response = await fetchNavbarData({
        url: process.env.NEXT_PUBLIC_API_URL,
      });
      if (response.data.status == true) {
        setHeaderData(response.data.responseBody.nav_activity);

        // console.log(
        //   "activityIdactivityId",
        //   response?.data?.responseBody?.nav_activity
        // );
        // console.log(
        //   "response.data.responseBody.site",
        //   response.data.responseBody.site
        // );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (year === "All") {
      if (isInitialApiCall === false) {
        fetchDatafromDropdown(activities);
      } else {
        setisInitialApiCall(false);
        // isInitialApiCall = false;
      }
    } else {
      fetchDatafromDropdown(activities);
    }
  }, [year]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const breadcrumbsData = [ 
    { label: "Home", url: "/" }, 
    params.name ? {
      label: "Activities", 
      url: "/activities"
    } : 
    <label color="text.primary" className="active-link-color">
      Activities
    </label>,
    ...(params.name ? [
      <label color="text.primary" className="active-link-color">
        {(params.name).replace("-", " ")}
      </label>
    ] : [])
  ];

  const navigate = useNavigate();

  // const handleClick = (id, date) => {
  //   navigate(`/activities-detail/${params.activity_id}/${id}`);
  // };

  const handleClick = (activityId, id, image, date) => {
    navigate(`/activities-detail/${activityId}/${id}`, {
      state: { image, date },
    });
      };

  // Add these new states after other state declarations

  
  // Modify fetchDatafromDropdown function
  const fetchDatafromDropdown = async (id) => {
    try {
      setActivityListLoader(true);
      var data = {
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "activity",
        pageData: page,
        per_page: 10,
        search: searchData,
        year: year !== "All" ? year : undefined,
        activity_id: id !== "All" ? id : undefined
      };
      
      const response = await fetchActivitiyList(data);
      setActivityListLoader(false);
      setLoading(false);
      
      const responseBody = response.data.responseBody;
      const totalPages = Math.ceil(responseBody.total / 10);
      setTotalData(responseBody.total);
      
      // Only set hasMore if we haven't reached the last page
      setHasMore(page < totalPages);
  
      if (responseBody.list?.length) {
        if (page === 1) {
          setApiData(responseBody.list);
        } else if (page <= totalPages) {
          setApiData(prev => [...prev, ...responseBody.list]);
        }
      } else {
        if (page === 1) {
          setApiData([]);
        }
        setHasMore(false);
      }
  
      setFilterActivities(Object.values(responseBody.filter_activity));
      setFilterYear(responseBody.filter_year);
    } catch (error) {
      setActivityListLoader(false);
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };
  
  // Add scroll handler effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const scrollThreshold = document.documentElement.scrollHeight - 500;
  
      if (scrollPosition >= scrollThreshold && !loading && !activityListLoader && hasMore) {
        setPage(prev => prev + 1);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, activityListLoader, page, totalData]);
  

  const fetchBanner = async () => {
    setLoading(true);
    try {
      const response = await fetchSlider({
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "activity",
      });
      setBanner(response.data.responseBody);
            setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
useEffect(() => {
  fetchBanner();
  }, []);

  // const handleSearchActivity = (e) => {
  //   setSearchActivity(e.target.value);
  //   console.log("");
  // };

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

      <Container className="sub_activities" >
        <div className="first_div">
          <div className="second-div">
            <select
              value={year}
              onChange={handleChangeYear}
              aria-label="Without label"
              // className="activities-width"
              className="activities-selection"
              // style={{ margin: "8px", minWidth: "220px" }}
            >
              <option value="All">All</option>
              {filterYear.map((yearItem) => (
                <option key={yearItem} value={yearItem}>
                  {yearItem}
                </option>
              ))}
            </select>

            <select
              value={activities}
              onChange={handleChangeActivity}
              aria-label="Without label"
              // className="activities-width"
              className="activities-selection"
              // style={{ margin: "8px", minWidth: "220px" }}
            >
              <option value="All">All</option>
              {headerData.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name}
                </option>
              ))}
            </select>
            {/* </div> */}
          </div>

          <div className="activities-search-container">
            <IoSearch className="activities-search-icon" />
            <input
              type="search"
              className="activities-search-input"
              placeholder="Search activities..."
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
        </div>
      </Container>
      <Container>
        <hr className="filter-divider" />

        {hasMore && activityListLoader ? (
          <Grid
            container
            spacing={3}
            justifyContent="center"
            className="sub-activities"
            data-aos="fade-up"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <div className="activity-shimmer-card"></div>
              </Grid>
            ))}
          </Grid>
        ) : apiData.length > 0 ? (
          <Grid
            container
            spacing={3}
            justifyContent="center"
            className="sub-activities"
            data-aos="fade-up"
          >
            {apiData.map((activity, index) => {
              const date = new Date(activity.activity_date);
              const options = { day: "numeric", month: "short" };
              const formattedDate = date.toLocaleDateString("en-US", options);
              const day = date.getDate();
              const month = formattedDate.split(" ")[0];

              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card className="activities-inner-content-wrap-sub-actvities h-100">
                    <div className="sub-act-img-wrap">
                      <LazyLoadImage
                        src={
                          activity?.thumbnail_image !== ""
                            ? activity.thumbnail_image
                            : imageNotFound
                        }
                        alt={activity?.title || "No Image Found"}
                        className="activities-img"
                        wrapperClassName="lazy-load-image-background aboutustype"
                        afterLoad={() => {
                          const image = document.querySelector(
                            `.lazy-load-image-background[data-src="${
                              activity?.thumbnail_image || imageNotFound
                            }"]`
                          );
                          if (image) {
                            image.classList.add("lazy-load-image-loaded");
                          }
                        }}
                        onClick={() =>
                          handleClick(
                            activity.activity_id,
                            activity.id,
                            activity.image,
                            formattedDate
                          )
                        }
                        onError={(e) => {
                          e.target.src = imageNotFound;
                        }}
                      />
                    </div>

                    <div className="activities-inner-content-sub-actvities">
                      <p
                        className="sub-activites-name"
                        onClick={() => setActivities(activity.activity_id)}
                      >
                        {activity.name}
                      </p>
                      <h4
                        className="sub-activities-title"
                        onClick={() =>
                          handleClick(
                            activity.activity_id,
                            activity.id,
                            activity.image,
                            formattedDate
                          )
                        }
                      >
                        {activity.title}
                      </h4>
                      <h6
                        className="sub-activities-desc"
                        onClick={() =>
                          handleClick(
                            activity.activity_id,
                            activity.id,
                            activity.image,
                            formattedDate
                          )
                        }
                      >
                        {activity.short_description}
                      </h6>
                    </div>
                    <div className="activities-date">
                      <div>
                        <h5>{day}</h5>
                      </div>
                      <div>
                        <p>{month}</p>
                      </div>
                    </div>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <div className="no-data mt-5">No data available</div>
        )}

       {/* {hasMore &&  <Grid
            container
            spacing={3}
            justifyContent="center"
            className="sub-activities"
            data-aos="fade-up"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <div className="activity-shimmer-card"></div>
              </Grid>
            ))}
          </Grid>} */}
      </Container>
    </>
  );
};

export default SubActivities;
