"use client";
import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { fetchPublicationSearchData } from "../../api/API";
import { useNavigate } from "../routerCompat.js";

// Wait for the user to stop typing before calling the search API
const SEARCH_DEBOUNCE_MS = 400;

const PublicationSearchModal = ({ onTap }) => {
  const [searchData, setSearchData] = useState("");
  // null = nothing searched yet, {} = searched with no matches
  const [publicationList, setPublicationList] = useState(null);
  const navigate = useNavigate();

  const query = searchData.trim();

  useEffect(() => {
    if (query === "") {
      setPublicationList(null);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const response = await fetchPublicationSearchData(
          {
            url: process.env.NEXT_PUBLIC_API_URL,
            page: "publication",
          },
          query
        );
        if (!cancelled) {
          setPublicationList(response.data.responseBody.publication_list);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, SEARCH_DEBOUNCE_MS);

    // Typing again cancels the pending call and ignores any stale response
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const clearSearch = () => {
    setSearchData("");
    setPublicationList(null);
  };

  const handleAlbumClick = (type, detail) => {
    clearSearch();
    const slug = publicationList[type].slug;
    if (slug === "audio") {
      navigate(
        `/audio-album/${detail.album_id}/publication/${detail.publications_id}`
      );
    }
    if (slug === "video") {
      navigate(
        `/video-album/${detail.album_id}/publication/${detail.publications_id}`
      );
    }
    if (slug === "pdf") {
      navigate(
        `/publication/${detail.publications_id}/book-list/${detail.album_id}/publication/${detail.publications_id}/`
      );
    }
  };

  const handlePublicationClick = (type, detail) => {
    clearSearch();
    if (onTap) {
      onTap(detail.publications_id);
    }
    const slug = publicationList[type].slug;
    if (slug === "pdf") {
      navigate(
        `/publication-detail/${detail.publications_id}/${type}?is_open_pdf=${detail.id}`
      );
    } else if (slug === "image") {
      navigate(
        `/publication-detail/${detail.publications_id}/${type}?is_open_wallpaper=${detail.id}`
      );
    } else if (slug === "video") {
      navigate(
        `/publication-detail/${detail.publications_id}/${type}?is_open=${detail.id}`
      );
    } else {
      navigate(`/publication-detail/${detail.publications_id}/${type}`);
    }
  };

  return (
    <div className="publication_search_wrap">
      <div className="search-container">
        <IoSearch className="search-icon1" />
        <input
          type="search"
          className="search-input"
          placeholder="Search.."
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
      </div>

      {query !== "" && publicationList !== null && (
        <div className="publication-search-results">
          {Object.keys(publicationList).length === 0 ? (
            <p className="publication-search-empty">
              No results found for "{query}"
            </p>
          ) : (
            Object.keys(publicationList).map((type) => (
              <div key={type} className="publication-search-group">
                <h6 className="publication-search-group-title">{type}</h6>
                <div className="publication-search-cards">
                  {publicationList[type].details.map((detail, idx) => (
                    <button
                      type="button"
                      key={idx}
                      className="publication-search-card"
                      onClick={() =>
                        detail.album_id
                          ? handleAlbumClick(type, detail)
                          : handlePublicationClick(type, detail)
                      }
                    >
                      <span className="publication-search-card-name">
                        {detail.name}
                      </span>
                      <span className="publication-search-card-arrow">
                        &#8594;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PublicationSearchModal;
