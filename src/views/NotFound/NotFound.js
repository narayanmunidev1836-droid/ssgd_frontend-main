"use client";
import React from "react";
import _notFound from "../../assets/images/not-found-img.webp";
const notFound = _notFound.src;

const NotFound = () => {
  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <img
          alt="not-found"
          src={notFound}
          style={{
            width: "100%",
            maxWidth: "800px",
            height: "auto",
          }}
        />
      </div>
    </>
  );
};

export default NotFound;
