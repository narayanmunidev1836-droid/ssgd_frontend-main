import React from "react";
import { useNavigate } from "react-router-dom";
import "./CTASection.css";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section" aria-label="Donation call to action">
      <div className="cta-content-panel" data-aos="fade-up">
        <h2 className="cta-heading">Be a Part of the Divine Journey</h2>

        <p className="cta-description">
          Support our educational, spiritual and social initiatives.
          <br />
          Your contribution helps build a better and brighter future.
        </p>

        <button
          type="button"
          className="cta-btn"
          onClick={() => navigate("/donation")}
        >
          <span>Donate Now</span>
          <span className="cta-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
};

export default CTASection;
