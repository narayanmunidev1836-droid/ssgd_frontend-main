import React from "react";
import { useNavigate } from "react-router-dom";
import "./QuickNavCards.css";
import darshanImg from "../../assets/images/daily-darshan-img1.webp";
import kathaImg from "../../assets/images/B.Swami_1.webp";
import eventsImg from "../../assets/images/slider_10.webp";
import donationImg from "../../assets/images/community_activities.webp";

const cards = [
  {
    img: darshanImg,
    title: "Daily Darshan",
    subtitle: "આજનો દર્શન",
    path: "/daily-darshan",
    color: "#b5090e",
  },
  {
    img: kathaImg,
    title: "Daily Katha",
    subtitle: "આજની કથા",
    path: "/daily-katha",
    color: "#08416b",
  },
  {
    img: eventsImg,
    title: "Live Events",
    subtitle: "લાઈવ પ્રારોગ",
    path: "/",
    color: "#c9984a",
  },
  {
    img: donationImg,
    title: "Donations",
    subtitle: "સેવા અને સહભાગ",
    path: "/donation",
    color: "#2a7a2a",
  },
];

const QuickNavCards = () => {
  const navigate = useNavigate();

  return (
    <div className="quick-nav-section">
      <div className="container">
        <div className="quick-nav-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className="quick-nav-card"
              onClick={() => navigate(card.path)}
              style={{ "--card-accent": card.color }}
            >
              <div className="quick-nav-img-wrap">
                <img src={card.img} alt={card.title} className="quick-nav-thumb" />
              </div>
              <div className="quick-nav-text">
                <h5>{card.title}</h5>
                <p>{card.subtitle}</p>
              </div>
              <div className="quick-nav-chevron">&#8250;</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickNavCards;
