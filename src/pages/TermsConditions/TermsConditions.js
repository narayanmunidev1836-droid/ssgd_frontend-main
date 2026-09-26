import React, { useEffect, useState } from "react";
import image from "../../assets/images/subheader.jpg";
import Container from "@mui/material/Container";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Typography from "@mui/material/Typography";
import { termsAndCondition } from "../../api/API";
import "./TermsConditions.css";

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
      <div className="section-padding"></div>
      <Container className="terms-condition">
        <h3 className="">TERMS AND CONDITIONS</h3>
        <div>
          <p dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      </Container>
    </>
  );
};

export default TermsConditions;
