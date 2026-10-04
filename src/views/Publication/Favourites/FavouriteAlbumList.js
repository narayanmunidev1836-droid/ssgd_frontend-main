"use client";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "../../../common/routerCompat.js";
import { BsHeartFill } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _imageNotFound from "../../../assets/images/NoImageFound.webp";
const imageNotFound = _imageNotFound.src;
import AOS from "aos";
import "aos/dist/aos.css";

const FAVOURITE_KEY = "favouriteAudioAlbums";
const FAVOURITE_TRACK_KEY = "favouriteAudioTracks";

const FavouriteAlbumList = () => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);

  const loadFavourites = () => {
    try {
      const storedAlbums = JSON.parse(
        localStorage.getItem(FAVOURITE_KEY) || "[]"
      );
      setAlbums(
        Array.isArray(storedAlbums)
          ? storedAlbums.map((item) =>
              typeof item === "string" ? { album_id: item } : item
            )
          : []
      );
    } catch (error) {
      setAlbums([]);
    }

    try {
      const storedTracks = JSON.parse(
        localStorage.getItem(FAVOURITE_TRACK_KEY) || "[]"
      );
      setTracks(
        Array.isArray(storedTracks)
          ? storedTracks.map((item) =>
              typeof item === "string" ? { id: item } : item
            )
          : []
      );
    } catch (error) {
      setTracks([]);
    }
  };

  useEffect(() => {
    loadFavourites();
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  const removeAlbum = (albumId) => {
    const updated = albums.filter(
      (album) => String(album.album_id) !== String(albumId)
    );
    setAlbums(updated);
    localStorage.setItem(FAVOURITE_KEY, JSON.stringify(updated));
    toast.info("Removed from favourite");
  };

  const removeTrack = (trackId) => {
    const updated = tracks.filter(
      (track) => String(track.id ?? track) !== String(trackId)
    );
    setTracks(updated);
    localStorage.setItem(FAVOURITE_TRACK_KEY, JSON.stringify(updated));
    toast.info("Removed from favourite");
  };

  const cleanTrackName = (name) =>
    name?.replace(/^\d+\s*[-.):\s]*\s*/, "") || name || "Track";

  const openAlbum = (album) => {
    if (album.album_id && album.publication_id) {
      navigate(
        `/audio-album/${album.album_id}/publication/${album.publication_id}`
      );
    } else {
      navigate("/audio");
    }
  };

  return (
    <div className="favourite-list-wrap" data-aos="fade-up">
      <div className="favourite-section-head">
        <h4 className="favourite-section-title">My Favourite Albums</h4>
        <span className="favourite-count">{albums.length} albums</span>
      </div>

      {albums.length > 0 ? (
        <Grid
          container
          spacing={3}
          justifyContent="center"
          className="katha-content-wrap"
        >
          {albums.map((album, index) => (
            <Grid
              item
              xs={6}
              sm={6}
              md={3}
              key={album.album_id || `fav-album-${index}`}
            >
              <div
                className="katha-img-wrap katha-img-wrap-publication"
                data-aos="fade-up"
              >
                <img
                  src={album.image || imageNotFound}
                  alt=""
                  className="katha-img katha-albums-image"
                />
                <div
                  className="fav-card-remove"
                  aria-label="Remove from favourite"
                  title="Remove from favourite"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAlbum(album.album_id);
                  }}
                >
                  <BsHeartFill />
                </div>
                <div className="katha-content katha-content-publication">
                  <div className="video-album-content">
                    <h4 className="video-album-content">
                      {album.title || "Audio Album"}
                    </h4>
                  </div>
                  <div>
                    <button onClick={() => openAlbum(album)}>View Details</button>
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className="favourite-empty">
          <p>You have no favourite item yet.</p>
        </div>
      )}

      {tracks.length > 0 && (
        <div className="favourite-tracks-wrap">
          <div className="favourite-section-head">
            <h4 className="favourite-section-title">My Favourite Tracks</h4>
            <span className="favourite-count">{tracks.length} tracks</span>
          </div>
          <div className="favourite-track-table">
            {tracks.map((track, index) => (
              <div
                className="favourite-track-row"
                key={String(track.id ?? index)}
              >
                <span className="favourite-track-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="favourite-track-name">
                  {cleanTrackName(track.name)}
                </span>
                <span className="favourite-track-album">
                  {track.album_title || ""}
                </span>
                <button
                  className="favourite-track-remove"
                  aria-label="Remove from favourite"
                  title="Remove from favourite"
                  onClick={() => removeTrack(track.id ?? track)}
                >
                  <BsHeartFill />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default FavouriteAlbumList;
