"use client";
import React from "react";
import { MdOutlinePeople, MdOutlineSchool, MdVolunteerActivism, MdOutlineEco } from "react-icons/md";
import "./StatsSection.css";

const stats = [
  {
    icon: <MdOutlinePeople />,
    value: "500K+",
    label: "Devotees Connected",
  },
  {
    icon: <MdOutlineSchool />,
    value: "100+",
    label: "Educational Initiatives",
  },
  {
    icon: <MdVolunteerActivism />,
    value: "50+",
    label: "Service Projects",
  },
  {
    icon: <MdOutlineEco />,
    value: "Green",
    label: "Initiatives for a Cleaner Tomorrow",
  },
];

const StatsSection = () => {
  return (
    <div className="stats-section">
      <div className="stats-decorative-line" />
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="stat-icon-wrap">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
