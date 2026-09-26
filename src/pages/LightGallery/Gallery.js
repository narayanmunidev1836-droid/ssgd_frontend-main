// import LightGallery from "lightgallery/react";

// // import styles
// import "lightgallery/css/lightgallery.css";
// import "lightgallery/css/lg-zoom.css";
// import "lightgallery/css/lg-thumbnail.css";

// import "lightgallery/scss/lightgallery.scss";
// import "lightgallery/scss/lg-zoom.scss";
// import lgThumbnail from "lightgallery/plugins/thumbnail";
// import lgAutoplay from "lightgallery/plugins/autoplay";
// import lgZoom from "lightgallery/plugins/zoom";
// import image1 from "../../assets/images/child_d_1.jpg";
// import image2 from "../../assets/images/child_d_2.jpg";
// import image3 from "../../assets/images/child_d_3.jpg";
// import image4 from "../../assets/images/child_d_4.jpg";
// import Container from "@mui/material/Container";
// import { FaSearchPlus } from "react-icons/fa";
// import Grid from "@mui/material/Grid";
// import Resizer from "react-image-file-resizer";

// function Gallery() {
//   const onBeforeSlide = (detail) => {
//     const { index, prevIndex } = detail;
//     console.log(index, prevIndex);
//   };

//   const onInit = () => {
//     console.log("lightGallery has been initialized");
//   };

//   return (
//     // <div className="conotainer i">
//     <Container className="sub-title">
//       <h6>Photo Gallery</h6>
//       {/* <Grid container> */}
//       <div>
//         <LightGallery
//           onInit={onInit}
//           speed={500}
//           plugins={[lgThumbnail, lgZoom]}
//         >
//           <a href={image1} className="gallery-activities-wrap">
//             <img alt="" src={image1} className="activities-gallery-img" />
//             <div className="gallery-activities-name">Lorem ipsum dolor</div>
//             <div className="search-icon">
//               <FaSearchPlus />
//             </div>
//           </a>

//           <a href={image2} className="gallery-activities-wrap">
//             <img alt="" src={image2} className="activities-gallery-img" />
//             <div className="gallery-activities-name">Lorem ipsum dolor</div>
//             <div className="search-icon">
//               <FaSearchPlus />
//             </div>
//           </a>
//           <a href={image3} className="gallery-activities-wrap">
//             <img alt="" src={image3} className="activities-gallery-img" />
//             <div className="gallery-activities-name">Lorem ipsum dolor</div>
//             <div className="search-icon">
//               <FaSearchPlus />
//             </div>
//           </a>
//           <a href={image3} className="gallery-activities-wrap">
//             <img alt="" src={image4} className="activities-gallery-img" />
//             <div className="gallery-activities-name">Lorem ipsum dolor</div>
//             <div className="search-icon">
//               <FaSearchPlus />
//             </div>
//           </a>
//         </LightGallery>
//       </div>
//       {/* </Grid> */}
//     </Container>
//     // </div >
//   );
// }

// export default Gallery;

// -------------
import React from "react";
import image1 from "../../assets/images/child_d_1.jpg";
import image2 from "../../assets/images/child_d_2.jpg";
import image3 from "../../assets/images/child_d_3.jpg";
import image4 from "../../assets/images/child_d_4.jpg";
import image from "../../assets/images/date.png";
import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import "lightgallery/scss/lightgallery.scss";
import "lightgallery/scss/lg-zoom.scss";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgZoom from "lightgallery/plugins/zoom";
import { FaSearchPlus } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
// import "./Wallpaper.css";

const Gallery = ({ title, date }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/audio-list");
    // handleButtonClick('Audio', 2);
  };

  const onBeforeSlide = (detail) => {
    const { index, prevIndex } = detail;
      };

  const onInit = () => {
      };

  return (
    <>
      <Container className="sub-title">
        {/* <h6>Photo Gallery</h6> */}
        <div className="date-picker-wrap">
          <div>
            <img src={image} className="date-picker-img" />
          </div>
          <div>
            <h5>10 Aug 2023</h5>
            <h5>{date}</h5>
          </div>
        </div>
        <div className="gallery-title">
          <h4>{title}</h4>
        </div>
        <div className="pt-0 section-padding">
          <LightGallery
            onInit={onInit}
            speed={500}
            plugins={[lgThumbnail, lgZoom]}
          >
            <a href={image1} className="wallpaper-content">
              <img alt="" src={image1} className="katha-img" />
              <div className="search-icon">
                <FaSearchPlus />
              </div>
            </a>

            <a href={image2} className="wallpaper-content">
              <img alt="" src={image2} className="katha-img" />
              <div className="search-icon">
                <FaSearchPlus />
              </div>
            </a>
            <a href={image3} className="wallpaper-content">
              <img alt="" src={image3} className="katha-img" />
              <div className="search-icon">
                <FaSearchPlus />
              </div>
            </a>
            <a href={image4} className="wallpaper-content">
              <img alt="" src={image4} className="katha-img" />
              <div className="search-icon">
                <FaSearchPlus />
              </div>
            </a>
          </LightGallery>
        </div>
      </Container>
    </>
  );
};

export default Gallery;

// slider
// import React from "react";
// import Slider from "react-slick";
// import image1 from "../../assets/images/child_d_1.jpg";
// import image2 from "../../assets/images/child_d_2.jpg";
// import image3 from "../../assets/images/child_d_3.jpg";
// import image4 from "../../assets/images/child_d_4.jpg";
// import image from "../../assets/images/date.png";
// import { FaSearchPlus } from "react-icons/fa";
// import Container from "@mui/material/Container";

// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";
// // import "./Gallery.css"; // Create Gallery.css to define styles for the slider

// const Gallery = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//     autoplay: true,
//     autoplaySpeed: 2000,
//   };

//   return (
//     <Container className="sub-title">
//       <div className="date-picker-wrap">
//         <div>
//           <img src={image} className="date-picker-img" />
//         </div>
//         <div>
//           <h5>10 Aug 2023</h5>
//         </div>
//       </div>
//       <div className="gallery-title">
//         <h4>Child development</h4>
//       </div>
//       <div className="pt-0 section-padding">
//         <Slider {...settings}>
//           <div>
//             <img src={image1} alt="" className="katha-img" />
//             <div className="search-icon">
//               <FaSearchPlus />
//             </div>
//           </div>
//           <div>
//             <img src={image2} alt="" className="katha-img" />
//             <div className="search-icon">
//               <FaSearchPlus />
//             </div>
//           </div>
//           <div>
//             <img src={image3} alt="" className="katha-img" />
//             <div className="search-icon">
//               <FaSearchPlus />
//             </div>
//           </div>
//           <div>
//             <img src={image4} alt="" className="katha-img" />
//             <div className="search-icon">
//               <FaSearchPlus />
//             </div>
//           </div>
//         </Slider>
//       </div>
//     </Container>
//   );
// };

// export default Gallery;
