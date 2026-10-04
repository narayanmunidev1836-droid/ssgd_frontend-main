"use client";
import React from "react";
import { useNavigate } from "../../common/routerCompat.js";
import "./Header.css";

const Header = ({ donation, handleClickDonation, pages }) => {
  const navigate = useNavigate();

  const handleClickDailyDarshan = () => {
    navigate("/daily-darshan");
  };

  const handleClickDailyKatha = () => {
    navigate("/daily-katha");
  };

  const handleClickDonors = () => {
    navigate("/donation");
  };

  // const handleClickDonationNew = () => {
  //   navigate("/donation");
  // };

  const handlePageClick = async (id, name, website_page, pageUrl) => {
    if (website_page === "other_website") {
      window.open(pageUrl, "_blank");
    } else {
      navigate(`/custome-page/${name}/${id}`);
    }
  };

  return (
    <>
      <div className="header-wrap d-flex align-items-center justify-content-between">
        <div className="d-flex header-left">
          {pages &&
            Object.values(pages).map((page) => {
              return page.highlight !== "1" ? (
                <div key={page.id}>
                  <h6
                    key={page.id}
                    onClick={() =>
                      handlePageClick(
                        page.id,
                        page.name,
                        page.website_page,
                        page.page_url
                      )
                    }
                  >
                    {page.name}
                  </h6>
                </div>
              ) : (
                ""
              );
            })}
        </div>
        <div className="d-flex align-items-center header-right">
          {/* <div>
            <h6 onClick={handleClickDonationNew}>Donation </h6>
          </div> */}
          <div>
            <h6 onClick={handleClickDonors}>Donations</h6>
          </div>
          <div>
            <h6 onClick={handleClickDailyKatha}>Daily Katha </h6>
          </div>
          <div className={donation !== "1" ? "no-border" : ""}>
            <h6 onClick={handleClickDailyDarshan}>Daily Darshan </h6>
          </div>
          <div>
            {donation === "1" ? (
              <h6 onClick={handleClickDonation}>Donate Now</h6>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
