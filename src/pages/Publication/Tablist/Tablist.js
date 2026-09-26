import React, { useEffect } from "react";
import "./Tablist.css";
import Katha from "../Katha/Katha";

const Tablist = () => {
  useEffect(() => {
    const tablist = document.querySelector('[data-ui-tablist="navigation"]');
    const marker = tablist.querySelector(".tabs-marker");

    const setMarker = (tab) => {
      marker.style.width = tab.offsetWidth + "px";
      marker.style.transform = `translateX(${tab.offsetLeft}px)`;
    };

    const tabs = tablist.querySelectorAll("[data-ui-tablist-tab]");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setMarker(tab);
        const tabId = tab.getAttribute("data-ui-tablist-tab");
        const tabPanel = document.getElementById(tabId);

        tabs.forEach((t) => {
          t.classList.remove("active-tab");
        });

        tab.classList.add("active-tab");

        tabs.forEach((t) => {
          const panelId = t.getAttribute("data-ui-tablist-tab");
          const panel = document.getElementById(panelId);
          panel.hidden = true;
        });

        tabPanel.hidden = false;
      });
    });

    setMarker(tabs[0]);
  }, []);

  return (
    <>
      <div>
        <div data-ui-tablist="navigation" className="tabs">
          <div className="tabs-marker"></div>
          <button data-ui-tablist-tab="account" className="tabs-tab active-tab">
            Katha
          </button>
          <button data-ui-tablist-tab="inventory" className="tabs-tab">
            Kirtan
          </button>
          <button data-ui-tablist-tab="bonuses" className="tabs-tab">
            Audio
          </button>
          <button data-ui-tablist-tab="history" className="tabs-tab">
            Video
          </button>
        </div>
        <div className="tabpanels">
          <div id="account" className="tabpanel">
            <Katha />
          </div>
          <div id="inventory" className="tabpanel" hidden>
            {/* Inventory content */}
          </div>
          <div id="bonuses" className="tabpanel" hidden>
            {/* Bonuses content */}
          </div>
          <div id="history" className="tabpanel" hidden>
            {/* History content */}
          </div>
          <div id="support" className="tabpanel" hidden>
            {/* Support content */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tablist;
