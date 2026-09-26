import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import BookList from "./BookList";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

const BookAndAlbumList = ({ publicatioAlbumnData, isAlbum ,publiCationLoading }) => {
  
  const params = useParams();
  
  const navigate = useNavigate();

  const handleViewDetailsClick = (id, pub_id) => {
        navigate(`/publication/${params.id}/book-list/${id}/publication/${pub_id}`);
      };
    useEffect(() => {
        AOS.init({
          duration: 1000,
          once: false,
        });
      }, []);
  return (
    <>
      {isAlbum ? (
        <Grid
          container
          spacing={3}
          justifyContent="center"
          className="katha-content-wrap"
          data-aos="fade-up"
        >
          {publiCationLoading ? (
          <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
              <div className="wallpaper-content">
              <div className="publication-image-card" />
              </div>
            </Grid>
          ))}
        </Grid>
        ):(
          Array.isArray(publicatioAlbumnData) &&
            publicatioAlbumnData.map((album) => (
              <Grid key={album.id} item xs={6} sm={6} md={3}>
                <div className="katha-img-wrap"  data-aos="fade-up">
                  {/* <img
                    src={album.thumbnail_image}
                    alt={album.title}
                    className="katha-img"
                  /> */}
                  <LazyLoadImage
                    src={album.thumbnail_image}
                    alt={album.title}
                    className="katha-img"
                    wrapperClassName="lazy-load-image-background aboutustype"
                    afterLoad={() => {
                      const image = document.querySelector(
                        `.lazy-load-image-background[data-src="${album.thumbnail_image}"]`
                      );
                      if (image) {
                        image.classList.add("lazy-load-image-loaded");
                      }
                    }}
                  />
                  <div className="katha-content">
                    <div>
                      <h4>{album.title}</h4>
                    </div>
                    <div>
                      <p>{album.publication}</p>
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          handleViewDetailsClick(album.id, album.publication_id)
                        }
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </Grid>
            )))}
        </Grid>
      ) : (
        <BookList publicatioAlbumnData={publicatioAlbumnData} publiCationLoading={publiCationLoading} />
      )}
    </>
  );
};

export default BookAndAlbumList;
