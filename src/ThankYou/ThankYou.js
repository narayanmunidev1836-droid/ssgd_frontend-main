import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import "./Thankyou.css";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Button, CardContent, Typography } from "@mui/material";

const ThankYou = () => {
  const [transactionId, setQueryParam] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");

  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("transaction_id");
    const message = params.get("message");
    const url = params.get("url");

        
    if (transactionId) {
      setQueryParam(transactionId);
    }
    if (message) {
      setMessage(message);
    }
    if (url) {
      setUrl(url);
    }
  }, []);

  const handleDownload = () => {
    if (url) {
      // Fetch the PDF content
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          // Create a temporary URL for the Blob
          const blobUrl = URL.createObjectURL(blob);
          // Create a temporary anchor element
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = "Invoice.pdf"; // Set the file name here
          link.style.display = "none";
          // Append the anchor to the body
          document.body.appendChild(link);
          // Trigger a click event on the anchor to initiate the download
          link.click();
          // Remove the temporary anchor element
          document.body.removeChild(link);
          // Revoke the Blob URL
          URL.revokeObjectURL(blobUrl);
        })
        .catch((error) => {
          console.error("Error fetching PDF:", error);
        });
    }
  };
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <Container className="payment-status" maxWidth="sm">
        <Card className="status-card" elevation={4}>
          <CardContent className="status-content">
            {url ? (
              <>
                <i className="fas fa-circle-check success-icon"></i>
                <Typography variant="h5" className="status-title">
                  Your payment was successful
                </Typography>
                <Typography variant="body1" className="status-description">
                  Thank you for your payment. <br /> You can download your
                  receipt below.
                </Typography>

                <div className="status-details">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleDownload}
                    startIcon={<i className="fas fa-download"></i>}
                  >
                    Download PDF
                  </Button>
                </div>
              </>
            ) : (
              <>
                <i className="fas fa-circle-xmark fail-icon"></i>
                <Typography variant="h5" className="status-title fail-text">
                  Your payment failed!
                </Typography>
                <Typography variant="body1" className="status-description">
                  Something went wrong. <br /> Please try again or contact
                  support.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClick}
                  startIcon={<i className="fas fa-arrow-rotate-left"></i>}
                >
                  OK
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ThankYou;
