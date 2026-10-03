import React, { useState, useEffect } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { FaSearchPlus } from "react-icons/fa";
import Grid from "@mui/material/Grid";
import imageNotFound from "../../src/assets/images/NoImageFound.webp";
import { useLocation } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Images = ({ publicatioAlbumnData,publiCationLoading }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleDownload = async (e, i) => {
    try {
      const imageUrlArray = JSON.parse(e.media);
      const imageUrl = imageUrlArray[0];
      
      // Add a cache-busting query parameter
      const cacheBustingUrl = `${imageUrl}?t=${new Date().getTime()}`;

      const response = await fetch(cacheBustingUrl, { mode: "cors" });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = imageUrl.split("/").pop(); // Use the filename from the URL
      anchor.target = "_blank";

      document.body.appendChild(anchor); // Append to body to ensure it's clickable
      anchor.click();

      document.body.removeChild(anchor); // Remove it after clicking
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading media:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const is_open_wallpaper = params.get("is_open_wallpaper");
        if (is_open_wallpaper && publicatioAlbumnData) {
            const index = publicatioAlbumnData.findIndex(
        (item) => item.id.toString() === is_open_wallpaper
      );
            if (index !== -1) {
        // handleView(
        //   JSON.parse(book.media)[0],
        //   book.name,
        //   book.short_description,
        //   book.publications_id
        // );
        setPhotoIndex(index);
        setIsOpen(true);

        // Parse the current search parameters from the location
        const searchParams = new URLSearchParams(location.search);

        // Remove the 'is_open_wallpaper' parameter
        searchParams.delete("is_open_wallpaper");

        // Construct the new search string
        const newSearch = searchParams.toString();

        // Construct the new pathname with the updated search parameters
        const newPathname = location.pathname;

        // Combine the new pathname and search string to create the new URL
        const newUrl = `${newPathname}${newSearch ? "?" + newSearch : ""}`;

        // Navigate to the new URL
        //  history.push();

        window.history.pushState(null, "", newUrl);
      }
    }
  },[]);

  useEffect(() => {
      AOS.init({
        duration: 1000,
        once: false,
      });
    }, []);

  return (
    <div className="pt-4">
      <Grid container spacing={2}>
        {publiCationLoading ? (
          <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
              <div className="wallpaper-content" data-aos="fade-up">
              <div className="publication-image-card" />
              </div>
            </Grid>
          ))}
        </Grid>
        ):(
          Array.isArray(publicatioAlbumnData) &&
          publicatioAlbumnData.length > 0 &&
          publicatioAlbumnData.map((item, index) => {
            const mediaArray = item.media ? JSON.parse(item.media) : null;
            const thumbMediaArray = item.thumb_media
            ? JSON.parse(item.thumb_media)
            : null;
            return (
              <>
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <div
                    key={index}
                    className="wallpaper-content"
                    style={{ width: "100%" }}
                    data-aos="fade-up"
                  >
                    <div
                      onClick={() => {
                        setPhotoIndex(index);
                        setIsOpen(true);
                      }}
                    >
                      {/* <img
                        alt=""
                        src={thumbMediaArray ? thumbMediaArray : imageNotFound}
                        className="wallpaper-img"
                      /> */}
                      <LazyLoadImage
                        src={thumbMediaArray ? thumbMediaArray : imageNotFound}
                        alt=""
                        className="wallpaper-img"
                        wrapperClassName="lazy-load-image-background aboutustype"
                        afterLoad={() => {
                          const image = document.querySelector(
                            `.lazy-load-image-background[data-src="${
                              thumbMediaArray ? thumbMediaArray : imageNotFound
                            }"]`
                          );
                          if (image) {
                            image.classList.add("lazy-load-image-loaded");
                          }
                        }}
                      />
                      <div className="search-icon">
                        <FaSearchPlus />
                      </div>
                    </div>

                    {/* <div className="image-details">
                      <h4 className="wallpaper-name">{item.name}</h4>
                    </div> */}
                    {/* <button onClick={() => handleDownload(item)}>
                      Download
                    </button> */}
                    <button
                      onClick={() => handleDownload(item)}
                      className="mt-2"
                    >
                      Download
                    </button>
                  </div>
                </Grid>
              </>
            );
          })
        )}
        {isOpen && (
          <Lightbox
            mainSrc={JSON.parse(publicatioAlbumnData[photoIndex].media)}
            nextSrc={
              publicatioAlbumnData[
                (photoIndex + 1) % publicatioAlbumnData.length
              ].media
            }
            prevSrc={
              publicatioAlbumnData[
                (photoIndex + publicatioAlbumnData.length - 1) %
                  publicatioAlbumnData.length
              ].media
            }
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex(
                (photoIndex + publicatioAlbumnData.length - 1) %
                  publicatioAlbumnData.length
              )
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % publicatioAlbumnData.length)
            }
          />
        )}
      </Grid>
    </div>
  );
};

export default Images;
