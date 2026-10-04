"use client";
import React from "react";
import { useState } from "react";
import HomeSliderLoader from "../../common/HomeSliderLoader/HomeSliderLoader";
import Loader from "../../common/Loader/Loader";
export default function ImageComponent({ src, width, size, className }) {
  const [loading, setLoading] = useState(true);

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

        <HomeSliderLoader />
      </div>
    </div>
  );
}
