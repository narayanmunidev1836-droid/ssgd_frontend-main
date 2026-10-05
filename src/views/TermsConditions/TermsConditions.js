"use client";
import React, { useEffect, useState } from "react";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Typography from "@mui/material/Typography";
import { termsAndCondition } from "../../api/API";
import "./TermsConditions.css";
import _image from "../../assets/images/subheader.webp";
const image = _image.src;

const TermsConditions = () => {
  const [text, setText] = useState("");
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    <Typography className="active-link-color">Terms & Conditions</Typography>,
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await termsAndCondition({
          url: "https://ssgd.srashtasoft.in/",
        });
        setText(response.data.responseBody.value);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="contact-img-wrap">
        <img src={image} alt="" className="about-img" />
        <div className="breadcrumbs-wrap">
          <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
        </div>
      </div>

      <div className="tc-page">
        <div className="tc-container">
          <div className="tc-card">
            <h3 className="tc-title">TERMS AND CONDITIONS</h3>
            <div className="tc-body">
              <p dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
