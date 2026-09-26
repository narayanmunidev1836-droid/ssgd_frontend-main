import React from "react";
import "./FullpageLoader.css";
import logo from "../../assets/images/SSGD-logo.jpeg";

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
