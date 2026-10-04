"use client";
import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const PublicationFilter = (props) => {
  const [internalValue, setInternalValue] = useState("all");
  const selectedValue =
    props.value !== undefined && props.value !== null
      ? props.value
      : internalValue;

  const handleChange = (event) => {
    setInternalValue(event.target.value);
    props.HandleOrderBy(event.target.value);
  };
    return (
    <>
      <div className="publication-filter-wrap">
        {/* <FormControl className="publication-filter">
          <Select
            value={selectedValue}
            onChange={handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            className="publication-filter-dropdown"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="alpha">Alphabetical</MenuItem>
          </Select>
        </FormControl> */}
        <select
          value={selectedValue}
          onChange={handleChange}
          className="publication-filter-dropdown"
        >
          <option value="all">All</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alpha">Alphabetical</option>
          <option value="favourites">My Favourites</option>
        </select>
      </div>
    </>
  );
};

export default PublicationFilter;
