// old code
import React from "react";
import { useState, useEffect } from "react";
import Loader from "../../common/Loader/Loader";
import HomeSliderLoader from "../../common/HomeSliderLoader/HomeSliderLoader";
import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
export default function MyImage({
  src,
  width,
  size,
  className,
  // setIsImageLoaded,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading === false) {
      // setIsImageLoaded(true);
    }
  }, [loading]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: width ? width : "100%",
        // marginTop: "-150px",
      }}
    >
      <img
        src={src}
        className={className}
        style={{
          display: loading ? "none" : "block",
          width: "100%",
          animation: "fadeIn 0.5s",
        }}
        onLoad={(e) => {
          setLoading(false);
        }}
      ></img>
      <div
        style={{
          display: loading ? "block" : "none",
          height: size,
          //   fontSize: size ? size : "24px",
        }}
      >
        {/* <Loader /> */}
        {/* <HomeSliderLoader /> */}
        {/* <FullpageLoader /> */}
      </div>
    </div>
  );
}

//
// import React, { useState, useEffect } from "react";
// import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";

// export default function MyImage({ src, className, onLoad }) {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!loading) {
//       if (onLoad) onLoad();
//     }
//   }, [loading, onLoad]);

//   return (
//     <div style={{ width: "100%" }}>
//       <img
//         src={src}
//         className={className}
//         style={{
//           display: loading ? "none" : "block",
//           width: "100%",
//           animation: "fadeIn 0.5s",
//         }}
//         onLoad={() => setLoading(false)}
//         alt=""
//       />
//       {loading && (
//         <div style={{ height: "100%" }}>
//           <FullpageLoader />
//         </div>
//       )}
//     </div>
//   );
// }

// *
// import React, { useState } from "react";

// const MyImage = ({ src, className, onLoad }) => {
//   const [loading, setLoading] = useState(true);

//   const handleImageLoad = () => {
//     setLoading(false);
//     if (onLoad) {
//       onLoad();
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100%",
//       }}
//     >
//       <img
//         src={src}
//         className={className}
//         style={{
//           display: loading ? "none" : "block",
//           width: "100%",
//           animation: "fadeIn 0.5s",
//         }}
//         onLoad={handleImageLoad}
//       />
//     </div>
//   );
// };

// export default MyImage;

// *
// import React from "react";
// import { useState, useEffect } from "react";
// import Loader from "../../common/Loader/Loader";
// // import HomeSliderLoader from "../../common/HomeSliderLoader/HomeSliderLoader";
// import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";
// export default function MyImage({
//   src,
//   width,
//   size,
//   className,
//   // setIsImageLoaded,
// }) {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (loading === false) {
//       // setIsImageLoaded(true);
//     }
//   }, [loading]);

//   return (
//     <>
//       <img
//         src={src}
//         className={className}
//         style={{
//           display: loading ? "none" : "block",
//           width: "100%",
//           animation: "fadeIn 0.5s",
//         }}
//         onLoad={(e) => {
//           setLoading(false);
//         }}
//       ></img>

//       {/* <Loader /> */}
//       {/* <HomeSliderLoader /> */}
//       <FullpageLoader />
//     </>
//   );
// }

// *
// import React, { useState, useEffect } from "react";
// import FullpageLoader from "../../common/HomeSliderLoader/FullpageLoader";

// const MyImage = ({ src, width, size, className }) => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (loading === false) {
//     }
//   }, [loading]);

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         width: width || "100%",
//       }}
//     >
//       <img
//         src={src}
//         className={className}
//         style={{
//           display: loading ? "none" : "block",
//           width: "100%",
//           animation: "fadeIn 0.5s",
//         }}
//         onLoad={() => setLoading(false)}
//         alt=""
//       />
//       {loading && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "rgba(217, 217, 215, 0.9)",
//             zIndex: 9999,
//           }}
//         >
//           <FullpageLoader />
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyImage;
