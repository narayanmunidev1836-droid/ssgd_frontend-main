import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
const ViewBill = () => {


    const location = useLocation();

    // Get the query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
  
    // Get the value of the "pdfUrl" query parameter
    const pdfUrl = queryParams.get("pdfUrl");

    return (
        <div className="container-fluid slider-wrap">
            <iframe
                src={pdfUrl}
                style={{
                    width: "100%",
                    height: "100vh",
                    margin: "0 auto",
                    display: "flex",
                    marginBottom: "25px",
                }}
            ></iframe>
        </div>
    );
};

export default ViewBill;
