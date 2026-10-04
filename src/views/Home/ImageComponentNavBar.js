"use client";
import React from "react";
import _defaultLogo from "../../assets/images/logo.webp";

const defaultLogo = _defaultLogo.src;

export default function ImageComponentNavBar({ src, width, size, className }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={src || defaultLogo}
        className={className}
        alt="logo"
        onError={(e) => {
          if (!e.currentTarget.src.endsWith(defaultLogo)) {
            e.currentTarget.src = defaultLogo;
          }
        }}
      />
    </div>
  );
}
