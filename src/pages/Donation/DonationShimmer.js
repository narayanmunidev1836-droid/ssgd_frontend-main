import { Container, Grid } from "@mui/material";
import React from "react";

const DonationShimmer = () => {
  return (
    <Container style={{ paddingTop: "100px" }}>
      {/* Title shimmer */}
      <div
        className="shimmer-title"
        style={{ width: "40%", height: "40px", marginBottom: "30px", borderRadius: "6px",marginLeft:"auto",marginRight:"auto",display:"block" }}
      />

      {/* Grid shimmer boxes */}
      <Grid container spacing={2}>
        {[...Array(3)].map((_, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <div className="shimmer-box" />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DonationShimmer;
