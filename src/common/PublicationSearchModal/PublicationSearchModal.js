"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { fetchPublicationSearchData } from "../../api/API";
import { useNavigate } from "../routerCompat.js";

const PublicationSearchModal = ({ onTap }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [publicationList, setPublicationList] = useState([]);
  const [modalHeight, setModalHeight] = useState("auto");

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSearchData("");
    setPublicationList([]);
    setModalHeight("auto");
  };

  useEffect(() => {
        if (searchData !== "") {
      fetchPublicationData();
    } else if (searchData === "") {
      setPublicationList([]);
    }
  }, [searchData]);

  useEffect(() => {
    if (searchData === "") {
      if (publicationList.length > 0) {
        setPublicationList([]);
      }
    }
  }, [publicationList]);

  const fetchPublicationData = async () => {
    try {
      const response = await fetchPublicationSearchData(
        {
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "publication",
        },
        searchData
      );
      if (searchData !== "") {
        // const responseData = response.data.responseBody.publication_list;
        setPublicationList(response.data.responseBody.publication_list);
      }
      // setSearchData("");
            setModalHeight("300px");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (searchData !== "") {
  //     fetchPublicationData();
  //   }
  // }, [searchData]);

  // useEffect(() => {
  //   fetchPublicationData();
  // }, []);

  // *
  // const handleSearch = (e) => {
  //   setSearchData(e);
  // };

  const handleSearch = (e) => {
    const searchText = e;
    setSearchData(searchText);
    setModalHeight(searchText.trim() === "" ? "auto" : "300px");
    // fetchPublicationData();
  };

  // const handleSearchData = (searchText) => {
  //   console.log("searcttext", searchText.length);
  //   if (searchText === "") {
  //     console.log("searchTextsearchText", searchText);
  //     setPublicationList();
  //     return;
  //   }
  // };

  // useEffect(() => {
  //   handleSearchData(searchData);
  // }, [searchData]);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Focus on search input when modal opens
    if (modalOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [modalOpen]);

  return (
    <>
      {/* <div onClick={openModal} className="publication-modal-search">
        <div className="search_input"></div>
        <div className="search-text">Search..</div>
      </div> */}

      <div onClick={openModal} className="publication_search_wrap">
        {/* <input
          type="search"
          className="search_input_activity"
          placeholder="Search.."
        /> */}
        <div className="search-container">
          <IoSearch className="search-icon1" />
          <input
            type="search"
            className="search-input"
            placeholder="Search.."
          />
        </div>
      </div>

      {/* =============== Search modal start =============== */}
      {modalOpen && (
        // <div className="loader-container ">
        <div className="modal">
          <div
            className="modal-content publication"
            style={{ height: modalHeight, overflowY: "auto" }}
          >
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            {/* =============== Search input start =============== */}
            <div className="search-input-wrap">
              <input
                ref={searchInputRef}
                type="search"
                className="search-input-publicationlist"
                placeholder="Search"
                value={searchData}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="search-icon-wrap">
              <IoSearch className="search-icon-publication" />
            </div>
            {/* =============== Search input end =============== */}

            {/* {Object.keys(publicationList).map((key) => (
              <div key={key}>
                <h6 className="publication-modal-text">{key}</h6>
                {publicationList[`${key}`] ? (
                  <h6 className="publication-modal-content">
                    {publicationList[`${key}`]["0"].name}
                  </h6>
                ) : (
                  <p>No publications found for {key}</p>
                )}
              </div>
            ))} */}

            {/* =============== Publication list start =============== */}

            {Object.keys(publicationList).length === 0 && searchData !== "" ? (
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                No results found for "{searchData}"
              </p>
            ) : (
              Object.keys(publicationList).map((type, index) => (
                <div key={index}>
                  <h6 className="publication-modal-text">{type}</h6>
                  {publicationList[type].details.map((detail, idx) => (
                    <div key={idx}>
                      {detail.album_id ? (
                        <h6
                          className="publication-modal-content"
                          onClick={() => {
                            closeModal();
                            if (publicationList[type].slug === "audio") {
                              navigate(
                                `/audio-album/${detail.album_id}/publication/${detail.publications_id}`
                              );
                            }
                            if (publicationList[type].slug === "video") {
                              navigate(
                                `/video-album/${detail.album_id}/publication/${detail.publications_id}`
                              );
                            }
                            if (publicationList[type].slug === "pdf") {
                              // navigate(
                              //   `/publication/${detail.album_id}/publication/${detail.publications_id}`
                              // );
                              navigate(
                                `/publication/${detail.publications_id}/book-list/${detail.album_id}/publication/${detail.publications_id}/`
                              );
                            }
                          }}
                        >
                          {detail.name}
                        </h6>
                      ) : (
                        <h6
                          className="publication-modal-content"
                          onClick={() => {
                            closeModal();
                            if (onTap) {
                              onTap(detail.publications_id);
                            }
                                                        if (publicationList[type].slug === "pdf") {
                              navigate(
                                `/publication-detail/${detail.publications_id}/${type}?is_open_pdf=${detail.id}`
                              );
                            } else if (publicationList[type].slug === "image") {
                              navigate(
                                `/publication-detail/${detail.publications_id}/${type}?is_open_wallpaper=${detail.id}`
                              );
                            } else if (publicationList[type].slug === "video") {
                              navigate(
                                `/publication-detail/${detail.publications_id}/${type}}?is_open=${detail.id}`
                              );
                            } else {
                              navigate(
                                `/publication-detail/${detail.publications_id}/${type}`
                              );
                            }
                          }}
                        >
                          {detail.name}
                        </h6>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}

            {/* =============== Publication list end =============== */}
          </div>
        </div>
        // </div>
      )}
      {/* =============== Search modal start =============== */}
    </>
  );
};

export default PublicationSearchModal;
