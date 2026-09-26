import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import "./CommonBreadcrumbs.css";
import { NavLink } from "react-router-dom";

function handleClick(event) {
  // event.preventDefault();
  console.info("clicked a breadcrumb");
}

function CommonBreadcrumbs({ items, separator }) {
  const breadcrumbs = items.map((item, index) => {
    if (item.url) {
      return (
        <NavLink
          key={index}
          underline="hover"
          color="inherit"
          style={{color:"inherit !important"}}
          to={item.url}
          onClick={handleClick}
        >
          {item.label}
        </NavLink>
      );
    } else if (React.isValidElement(item)) {
      return React.cloneElement(item, { key: index });
    }
  });

  return (
    <>
      <div className="breadcrumbs">
        <Breadcrumbs separator={separator} aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </div>
    </>
  );
}

export default CommonBreadcrumbs;
