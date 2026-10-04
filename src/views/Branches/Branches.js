"use client";
// effect blur and black&white
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { SlLocationPin } from "react-icons/sl";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { Link } from "../../common/routerCompat.js";
import { fetchBranchespageData, fetchSlider } from "../../api/API";
import Loader from "../../common/Loader/Loader";
import InnerpageLoader from "../Home/InnerpageLoader";
import "./Branches.css";
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Branches = () => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    <label color="text.primary" className="active-link-color">
      Branches
    </label>,
  ];
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchImage, setBranchImage] = useState();
  const [banner, setBanner] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchBranchespageData({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "branch",
        });
        if (response.data.status === true) {
          setApiData(response.data.responseBody);
          setBranchImage(response.data.responseBody.image);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
      try {
        const response = await fetchSlider({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "branch",
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
      {/* {!imageLoaded && <FullpageLoader />} */}
      <Container className="">
        <div className="spinner-container branches-page">
          <Grid container spacing={3} justifyContent="center">
            {loading
              ? [...Array(3)].map((_, index) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <div className="slider-item" key={index} data-aos="fade-up">
                    <div className="slider-item-shimmer" style={{height:"450px", width:"100%"}}>
                    <div className="slider-item-shimmer-text small" />
                      <div className="slider-item-shimmer-text" />
                      <div className="slider-item-shimmer-text" />
                    </div>
                  </div>
                  </Grid>
                ))
              : apiData &&
                apiData.branches &&
                apiData.branches.map((branch, index) => (
                  <Grid key={index} item xs={12} sm={6} md={4}>
                    {/* {branch.website_url ? (
                      <Link
                        to={branch.website_url}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        <Card className="branch-wrap"  data-aos="fade-up">
                          <LazyLoadImage
                            src={branch.image}
                            alt="branch- image"
                            className="branch-img-1"
                            // effect="blur"

                            //black&white effect
                            wrapperClassName="lazy-load-image-background"
                            afterLoad={() => {
                              const image = document.querySelector(
                                `.lazy-load-image-background[data-src="${branch.image}"]`
                              );
                              if (image) {
                                image.classList.add("lazy-load-image-loaded");
                              }
                            }}
                          />
                          <CardContent>
                            <h4 className="branch-name">{branch.name}</h4>
                            <ul className="footer-link-wrap mt-3">
                              <div className="footer-link-wrap1">
                                <div>
                                  <SlLocationPin className="footer-icon" />
                                </div>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: branch.location,
                                  }}
                                ></p>
                              </div>
                              <div className="footer-link-wrap1">
                                <div>
                                  <FiPhone className="footer-icon" />
                                </div>
                                <p>{branch.mobile_number}</p>
                              </div>
                              <div className="footer-link-wrap1">
                                <div>
                                  <MdOutlineEmail className="footer-icon" />
                                </div>
                                <p>{branch.email}</p>
                              </div>
                            </ul>
                          </CardContent>
                        </Card>
                      </Link>
                    ) : ( */}
                      <div>
                        <Card className="branch-wrap"  data-aos="fade-up">
                          <LazyLoadImage
                            src={branch.image}
                            alt="branch- image"
                            className="branch-img-1"
                            // effect="blur"

                            //black&white effect
                            wrapperClassName="lazy-load-image-background"
                            afterLoad={() => {
                              const image = document.querySelector(
                                `.lazy-load-image-background[data-src="${branch.image}"]`
                              );
                              if (image) {
                                image.classList.add("lazy-load-image-loaded");
                              }
                            }}
                          />
                          <CardContent>
                            <h4 className="branch-name">{branch.name}</h4>
                            <ul className="footer-link-wrap mt-3">
                              <div className="footer-link-wrap1">
                                <div>
                                  <SlLocationPin className="footer-icon" />
                                </div>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: branch.location,
                                  }}
                                ></p>
                              </div>
                              <div className="footer-link-wrap1">
                                <div>
                                  <FiPhone className="footer-icon" />
                                </div>
                                <p>{branch.mobile_number}</p>
                              </div>
                              <div className="footer-link-wrap1">
                                <div>
                                  <MdOutlineEmail className="footer-icon" />
                                </div>
                                <p>{branch.email}</p>
                              </div>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    {/* )} */}
                  </Grid>
                ))}
          </Grid>
        </div>
      </Container>
      <div className="section-padding"></div>
    </>
  );
};

export default Branches;

//
// import React, { useState, useEffect } from "react";
// import Grid from "@mui/material/Grid";
// import Container from "@mui/material/Container";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import { SlLocationPin } from "react-icons/sl";
// import { MdOutlineEmail } from "react-icons/md";
// import { FiPhone } from "react-icons/fi";
// import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
// import { Link } from "../../common/routerCompat.js";
// import { fetchBranchespageData, fetchSlider } from "../../api/API";
// import Loader from "../../common/Loader/Loader";
// import InnerpageLoader from "../Home/InnerpageLoader";
// import "./Branches.css";
// import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// // import { ClipLoader } from "react-spinners";
// import { FadeLoader } from "react-spinners";
// import "react-lazy-load-image-component/src/effects/blur.css";
// import Lazyloader from "../../common/Loader/Lazyloader";

// const Branches = () => {
//   const breadcrumbsData = [
//     { label: "Home", url: "/" },
//     <label color="text.primary" className="active-link-color">
//       Branches
//     </label>,
//   ];
//   const [apiData, setApiData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [branchImage, setBranchImage] = useState();
//   const [banner, setBanner] = useState(null);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [imageLoadStatus, setImageLoadStatus] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchBranchespageData({
//           url: process.env.NEXT_PUBLIC_API_URL,
//           page: "branch",
//         });
//         if (response.data.status === true) {
//           setApiData(response.data.responseBody);
//           setBranchImage(response.data.responseBody.image);
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchBanner = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchSlider({
//           url: process.env.NEXT_PUBLIC_API_URL,
//           page: "branch",
//         });
//         setBanner(response.data.responseBody);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };

//     fetchBanner();
//   }, []);

//   const handleImageLoad = () => {
//     setImageLoaded(true);
//   };

//   const handleBeforeLoad = (index) => {
//     setImageLoadStatus((prevStatus) => ({
//       ...prevStatus,
//       [index]: true,
//     }));
//   };

//   const handleAfterLoad = (index) => {
//     setImageLoadStatus((prevStatus) => ({
//       ...prevStatus,
//       [index]: false,
//     }));
//   };

//   return (
//     <>
//       <div className="contact-img-wrap">
//         <div className="spinner-container-banner">
//           <InnerpageLoader
//             src={banner}
//             className="about-img"
//             onImageLoad={handleImageLoad}
//           />
//         </div>

//         {imageLoaded && (
//           <div className="breadcrumbs-wrap">
//             <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
//           </div>
//         )}
//       </div>
//       {!imageLoaded && <FullpageLoader />}
//       <Container className="">
//         <div className="spinner-container branches-page">
//           {loading && (
//             <div className="spinner pt-5">
//               <Loader />
//             </div>
//           )}
//           <Grid container spacing={3} justifyContent="center">
//             {apiData &&
//               apiData.branches &&
//               apiData.branches.map((branch, index) => (
//                 <Grid key={index} item xs={12} sm={6} md={4}>
//                   {branch.website_url ? (
//                     <Link
//                       to={branch.website_url}
//                       target="_blank"
//                       style={{ textDecoration: "none" }}
//                     >
//                       <Card className="branch-wrap">
//                         {imageLoadStatus[index] && (
//                           <div className="image-container">
//                             {/* <FadeLoader size={50} color={"#123abc"} /> */}
//                             <Lazyloader />
//                           </div>
//                         )}
//                         <LazyLoadImage
//                           src={branch.image}
//                           alt="branch- image"
//                           className="branch-img-1"
//                           effect="blur"
//                           beforeLoad={() => handleBeforeLoad(index)}
//                           afterLoad={() => handleAfterLoad(index)}
//                         />
//                         <CardContent>
//                           <h4 className="branch-name">{branch.name}</h4>
//                           <ul className="footer-link-wrap mt-3">
//                             <div className="footer-link-wrap1">
//                               <div>
//                                 <SlLocationPin className="footer-icon" />
//                               </div>
//                               <p
//                                 dangerouslySetInnerHTML={{
//                                   __html: branch.location,
//                                 }}
//                               ></p>
//                             </div>
//                             <div className="footer-link-wrap1">
//                               <div>
//                                 <FiPhone className="footer-icon" />
//                               </div>
//                               <p>{branch.mobile_number}</p>
//                             </div>
//                             <div className="footer-link-wrap1">
//                               <div>
//                                 <MdOutlineEmail className="footer-icon" />
//                               </div>
//                               <p>{branch.email}</p>
//                             </div>
//                           </ul>
//                         </CardContent>
//                       </Card>
//                     </Link>
//                   ) : (
//                     <div>
//                       <Card className="branch-wrap">
//                         {imageLoadStatus[index] && (
//                           <div className="image-container">
//                             {/* <FadeLoader size={50} color={"#123abc"} /> */}
//                             <Lazyloader />
//                           </div>
//                         )}
//                         <LazyLoadImage
//                           src={branch.image}
//                           alt="branch- image"
//                           className="branch-img-1"
//                           effect="blur"
//                           beforeLoad={() => handleBeforeLoad(index)}
//                           afterLoad={() => handleAfterLoad(index)}
//                         />
//                         <CardContent>
//                           <h4 className="branch-name">{branch.name}</h4>
//                           <ul className="footer-link-wrap mt-3">
//                             <div className="footer-link-wrap1">
//                               <div>
//                                 <SlLocationPin className="footer-icon" />
//                               </div>
//                               <p
//                                 dangerouslySetInnerHTML={{
//                                   __html: branch.location,
//                                 }}
//                               ></p>
//                             </div>
//                             <div className="footer-link-wrap1">
//                               <div>
//                                 <FiPhone className="footer-icon" />
//                               </div>
//                               <p>{branch.mobile_number}</p>
//                             </div>
//                             <div className="footer-link-wrap1">
//                               <div>
//                                 <MdOutlineEmail className="footer-icon" />
//                               </div>
//                               <p>{branch.email}</p>
//                             </div>
//                           </ul>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   )}
//                 </Grid>
//               ))}
//           </Grid>
//         </div>
//       </Container>
//       <div className="section-padding"></div>
//     </>
//   );
// };

// export default Branches;
