"use client";
import React from "react";
import "./FullpageLoader.css";
import _logo from "../../assets/images/SSGD-logo.webp";
const logo = _logo.src;

const FullpageLoader = () => {
  return (
    <>
      <div className="loader-container-logo">
        <img src={logo} alt="Loading..." className="loader-logo" />
      </div>
    </>
  );
};

export default FullpageLoader;
