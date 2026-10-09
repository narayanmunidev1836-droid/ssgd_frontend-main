"use client";
import React from "react";
import { Link } from "../../common/routerCompat";
import _templeBg from "../../assets/images/dailyKathaBackground.webp";
const templeBg = _templeBg.src;

const NotFound = () => {
  return (
    <section
      className="text-center"
      style={{
        backgroundColor: "#fffaf0",
        backgroundImage: `url("${templeBg}")`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
        minHeight: "70vh",
        padding: "72px 16px 140px",
      }}
    >
      <div
        aria-hidden="true"
        className="fw-bold"
        style={{
          backgroundImage:
            "linear-gradient(180deg, var(--accent-gold) 0%, var(--global-color) 55%, var(--global-color-hover) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(5rem, 20vw, 10rem)",
          lineHeight: 1,
        }}
      >
        404
      </div>
      <h1
        className="fw-bold mt-3"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--global-color-hover) 0%, var(--global-color) 50%, var(--accent-gold) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(1.75rem, 5vw, 3rem)",
        }}
      >
        Page Not Found
      </h1>
      <div
        className="mx-auto my-3"
        style={{ width: "120px", height: "2px", backgroundColor: "var(--accent-gold)" }}
      />
      <p
        className="mx-auto"
        style={{
          color: "#5a3a2e",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1.1rem",
          maxWidth: "520px",
        }}
      >
        The page you are looking for may have been moved, renamed or is
        temporarily unavailable. Please check the address or head back to the
        home page.
      </p>
      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
        <Link
          to="/"
          className="btn text-white px-4 py-2"
          style={{
            backgroundColor: "var(--global-color)",
            boxShadow: "0 4px 10px rgba(139, 0, 7, 0.3)",
          }}
        >
          <i className="fa-solid fa-house me-2" aria-hidden="true"></i>
          Go to Home
        </Link>
        <Link
          to="/contact-us"
          className="btn px-4 py-2"
          style={{
            color: "var(--global-color)",
            backgroundColor: "#fff",
            border: "1px solid var(--global-color)",
          }}
        >
          <i className="fa-solid fa-phone me-2" aria-hidden="true"></i>
          Contact Us
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
