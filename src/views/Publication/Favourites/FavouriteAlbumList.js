"use client";
import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "../../../common/routerCompat.js";
import {
  BsHeartFill,
  BsChevronRight,
  BsPlayCircleFill,
  BsPauseCircleFill,
} from "react-icons/bs";
import { toast } from "react-toastify";
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
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);
  const audioSrcRef = useRef("");

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

  const openTrackAlbum = (track) => {
    if (track?.album_id && track?.publication_id) {
      navigate(
        `/audio-album/${track.album_id}/publication/${track.publication_id}`
      );
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        audioSrcRef.current = "";
      }
    };
  }, []);

  const togglePlay = (track, index) => {
    const src = typeof track?.src === "string" ? track.src : "";
    const key = String(track.id ?? index);

    if (!src) {
      toast.info("Audio not available for this track");
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setPlayingId(null);
    }

    const audio = audioRef.current;

    if (playingId === key && !audio.paused) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    if (audioSrcRef.current !== src) {
      audio.src = src;
      audioSrcRef.current = src;
    }

    audio
      .play()
      .then(() => setPlayingId(key))
      .catch(() => {
        setPlayingId(null);
        toast.error("Unable to play this track");
      });
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
          <table className="favourite-track-table">
            <thead>
              <tr className="favourite-track-header">
                <th className="favourite-track-num">#</th>
                <th className="favourite-track-name">Track</th>
                <th className="favourite-track-album">Album</th>
                <th className="favourite-track-actions-cell">
                  <div className="favourite-track-actions">Action</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, index) => {
                const canOpenAlbum = Boolean(
                  track.album_id && track.publication_id
                );
                return (
                  <tr
                    className="favourite-track-row"
                    key={String(track.id ?? index)}
                  >
                    <td className="favourite-track-num">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="favourite-track-name">
                      {cleanTrackName(track.name)}
                    </td>
                    <td className="favourite-track-album">
                      {track.album_title || ""}
                    </td>
                    <td className="favourite-track-actions-cell">
                      <div className="favourite-track-actions">
                        <button
                          className={`favourite-track-play ${
                            playingId === String(track.id ?? index)
                              ? "favourite-track-play-active"
                              : ""
                          }`}
                          aria-label={
                            playingId === String(track.id ?? index)
                              ? "Pause"
                              : "Play"
                          }
                          title={
                            playingId === String(track.id ?? index)
                              ? "Pause"
                              : "Play"
                          }
                          onClick={() => togglePlay(track, index)}
                        >
                          {playingId === String(track.id ?? index) ? (
                            <BsPauseCircleFill />
                          ) : (
                            <BsPlayCircleFill />
                          )}
                        </button>
                        <button
                          className="favourite-track-remove"
                          aria-label="Remove from favourite"
                          title="Remove from favourite"
                          onClick={() => removeTrack(track.id ?? track)}
                        >
                          <BsHeartFill />
                        </button>
                        {canOpenAlbum && (
                          <button
                            className="favourite-track-goto"
                            title="Go to album"
                            onClick={() => openTrackAlbum(track)}
                          >
                            Go to album
                            <BsChevronRight />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FavouriteAlbumList;
