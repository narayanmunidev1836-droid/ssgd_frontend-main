import React from "react";
import notFound from "../../assets/images/not-found-img.jpg";

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
