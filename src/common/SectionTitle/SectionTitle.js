"use client";
import React from "react";

const SectionTitle = ({ title, className }) => {
  const sectionTitleClasses = `section-title ${className || ""}`.trim();

  return (
    <>
      <h6 className={sectionTitleClasses}>{title}</h6>
    </>
  );
};

export default SectionTitle;
