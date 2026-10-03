import React from "react";
import { useNavigate } from "react-router-dom";
import "./MissionSection.css";
import missionImg from "../../assets/images/templeTemp.webp";
import missionBg from "../../assets/images/mission-background.webp";

const MissionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="mission-section" style={{ backgroundImage: `url(${missionBg})` }}>
      <div className="container">
        <div className="mission-inner">
          {/* Left: Text Content */}
          <div className="mission-text" data-aos="fade-right">
            <p className="mission-label">OUR MISSION</p>
            <h2 className="mission-heading-gu">
              સંસ્કારિત, સુશિક્ષિત અને
              <br />
              સેવામાં સમર્પિત સમાજ
            </h2>
            <p className="mission-desc">
              To propagate the divine teachings of Bhagwan Shree Swaminarayan
              through spirituality, education, character building and selfless service
              for a better and brighter society.
            </p>
            <button
              className="mission-btn"
              onClick={() => navigate("/about-us")}
            >
              Know More &nbsp;&#8594;
            </button>
          </div>

          {/* Right: Image */}
          <div className="mission-image-wrap" data-aos="fade-left">
            <img
              src={missionImg}
              alt="Our Mission"
              className="mission-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
