"use client";
import React, { useState, useEffect, useRef } from "react";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { BsRepeat1 } from "react-icons/bs";
import { BsRepeat } from "react-icons/bs";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import InnerpageLoader from "../../Home/InnerpageLoader";
import {
  downloadAudio,
  fetchPublicationList,
  fetchSlider,
} from "../../../api/API";
import _imageNotFound from "../../../../src/assets/images/NoImageFound.webp";
const imageNotFound = _imageNotFound.src;
import "./AudioPlayer.css";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

import { useNavigate, useParams } from "../../../common/routerCompat.js";

import { fetchPublicationDetails } from "../../../api/API";
import { Container } from "@mui/material";
import PublicationSearchModal from "../../../common/PublicationSearchModal/PublicationSearchModal";
import AudioPlayerLoader from "../../../common/Loader/AudioPlayerLoader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

const AudioListPlayer = ({ audioListData, publiCationLoading }) => {
  const params = useParams();

  const [isAlbumDetail, setIsAlbumDetail] = useState(false);
  const [finalAudioListData, setFinalAudioListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState([]);
  const [albumName, setAlbumName] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [publicationList, setPublicationList] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [publicationData, setPublicationData] = useState(null);
  const [publicatioAlbumnData, setPublicationAlbumData] = useState(null);
  const [isAlbum, setIsAlbum] = useState(false);
  const [list, setList] = useState([]);
  const [publicationId, setPublicationId] = useState();
  const [SelectedPublicationslug, setSelectedPublicationslugn] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const [downloadAudioZip, setDownloadAudioZip] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState(null);

  // Custom player state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  ///FOR BREADCRUM
  const [publicationDetailResponse, setPublicationDetailResponse] = useState();

  const navigate = useNavigate();

  if (isAlbumDetail === false && params.album_id) {
    setIsAlbumDetail(true);
  }

  useEffect(() => {
    if (audioListData) {
      setFinalAudioListData(audioListData);
    }
  }, [audioListData]);

  //For audio - album list
  useEffect(() => {
    if (isAlbumDetail) {
      const fetchData = async () => {
        try {
          const response = await fetchPublicationDetails({
            url: process.env.NEXT_PUBLIC_API_URL,
            page: "publication",
            album_id: params.album_id,
          });
          setFinalAudioListData(response.data.responseBody.list);
          setPublicationDetailResponse(response.data.responseBody);
          setAlbumName(response.data.responseBody.albums.title);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [isAlbumDetail]);

  const handleDownloadSong = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.setAttribute("download", "");
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleDownloadAllAudio = async () => {
    try {
      setIsLoader(true);
      setDownloadComplete(false);
      let idKey, idValue;

      if (params.id) {
        idKey = "publication_id";
        idValue = params.id;
      } else if (params.album_id) {
        idKey = "album_id";
        idValue = params.album_id;
      } else {
        setIsLoader(false);
        return;
      }

      const data = {
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "publication",
        [idKey]: idValue,
      };
      const response = await downloadAudio(data);

      if (response.data.responseBody && response.data.responseBody.length > 0) {
        const urlToDownload = response.data.responseBody[0];
        handleDownloadSong(urlToDownload);
        setDownloadComplete(true);
      } else {
        console.error("No URLs found in the response.");
        setIsLoader(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoader(false);
    }
    setIsLoader(false);
  };

  useEffect(() => {
    if (Array.isArray(finalAudioListData)) {
      const modifiedListData = finalAudioListData.map((audio) => {
        let src;
        try {
          src = JSON.parse(audio.media)[0];
        } catch (error) {}

        return { ...audio, isPlaying: false, src: src };
      });

      // Sort ascending by number prefix in track name
      modifiedListData.sort((a, b) => {
        const numA = parseInt(a.name?.match(/^\d+/)?.[0] || "0");
        const numB = parseInt(b.name?.match(/^\d+/)?.[0] || "0");
        return numA - numB;
      });

      const audioPlayerHelperClone = { ...audioPlayerHelper };

      updateAudioPlayerHelper({
        ...audioPlayerHelperClone,
        songs: modifiedListData,
      });
    }
  }, [finalAudioListData]);

  useEffect(() => {
    if (params.pub_id) {
      fetchData1(params.pub_id);
      setPublicationId(params.pub_id);
    }
  }, [params.pub_id]);

  //For audio list
  const fetchData1 = async (publicationid) => {
    try {
      const response = await fetchPublicationList({
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "publication",
        publication_id: publicationid,
      });

      if (response?.data?.responseBody.list_publication) {
        setPublicationData(response.data.responseBody.publication.ui_slug);
      }

      setSelectedPublicationslugn(
        response.data.responseBody.publication.ui_slug
      );

      if (response.data.responseBody.albums) {
        setIsAlbum(true);
        setPublicationAlbumData(response.data.responseBody.albums);
      }

      setList(response.data.responseBody);

      setPublicationList(response?.data?.responseBody.list_publication);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleButtonClick = (
    publicationName,
    PublicationId,
    index,
    ui_slug,
    publicationData,
    isActive
  ) => {
    setPublicationAlbumData(null);
    setSelectedPublicationslugn(ui_slug);
    setActiveTab(index);
    setIndicatorPosition(index);
    fetchData1(PublicationId);
    setActiveStatus(isActive);

    setPublicationId(PublicationId);

    navigate(`/publication-detail/${PublicationId}/${publicationName}`);
    setPublicationId(PublicationId);
  };

  const breadcrumbsData = [
    { label: "Home", url: "/" },
    {
      label: `Publication`,
      url: `/publication-detail/${publicationDetailResponse?.list_publication?.[publicationDetailResponse?.list_publication?.length - 1]?.id}/${publicationDetailResponse?.list_publication?.[publicationDetailResponse?.list_publication?.length - 1]?.name}`,
    },
    {
      label: `${publicationDetailResponse?.publication?.name}`,
      url: `/publication-detail/${publicationDetailResponse?.publication?.id}/${publicationDetailResponse?.publication?.name}`,
    },
    <label color="text.primary" className="active-link-color">
      {publicationDetailResponse?.albums?.title}
    </label>,
  ];

  const [currentSongTitle, setCurrentSongTitle] = useState("");
  const [audioPlayerHelper, updateAudioPlayerHelper] = useState({
    loopMode: "all",
    currentIndex: 0,
    songs: [],
  });

  const audioRef = useRef(null);

  // Time tracking for custom player
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
    };
  }, []);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setVolume(vol);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    audio?.addEventListener("ended", handleSongEnded);

    const playAudio = async () => {
      try {
        const currentSrc = audio.src;
        const newSrc =
          audioPlayerHelper.songs[audioPlayerHelper.currentIndex].src;

        if (currentSrc !== newSrc) {
          await audio.load();
        }

        const isAnySongPlaying = audioPlayerHelper.songs.some(
          (song) => song.isPlaying
        );

        if (isAnySongPlaying === true) {
          await audio.play();
        } else {
          await audio.pause();
        }
      } catch (e) {}
    };
    const currentSong = audioPlayerHelper.songs[audioPlayerHelper.currentIndex];
    setCurrentSongTitle(currentSong?.name?.replace(/^\d+\s*[-.):\s]*\s*/, "") || currentSong?.name);

    playAudio();

    return () => {
      audio?.removeEventListener("ended", handleSongEnded);
    };
  }, [audioPlayerHelper]);

  const updateAudioState = (audioPlayerHelperClone) => {
    const stateString = JSON.stringify(audioPlayerHelper);
    const cloneString = JSON.stringify(audioPlayerHelperClone);
    const isSameValue = stateString === cloneString;

    if (!isSameValue) {
      updateAudioPlayerHelper(audioPlayerHelperClone);
    }
  };

  const handleSongEnded = () => {
    const audioPlayerHelperClone = { ...audioPlayerHelper };

    if (audioPlayerHelperClone.loopMode === "single") {
      const updatedSongs = audioPlayerHelperClone.songs.map((song, index) => ({
        ...song,
        isPlaying: index === audioPlayerHelperClone.currentIndex,
      }));
      updateAudioPlayerHelper({
        ...audioPlayerHelperClone,
        songs: updatedSongs,
      });
    } else {
      const nextIndex =
        (audioPlayerHelperClone.currentIndex + 1) %
        audioPlayerHelperClone.songs.length;
      const updatedSongs = audioPlayerHelperClone.songs.map((song, index) => ({
        ...song,
        isPlaying: index === nextIndex,
      }));
      updateAudioPlayerHelper({
        ...audioPlayerHelperClone,
        currentIndex: nextIndex,
        songs: updatedSongs,
      });
    }
  };

  const handlePauseFromPlayer = () => {
    const audioPlayerHelperClone = { ...audioPlayerHelper };
    const updatedSongs = audioPlayerHelperClone.songs.map((song, index) => ({
      ...song,
      isPlaying:
        index === audioPlayerHelperClone.currentIndex ? false : song.isPlaying,
    }));
    updateAudioState({
      ...audioPlayerHelperClone,
      songs: updatedSongs,
    });
  };

  const handlePlayFromPlayer = () => {
    const audioPlayerHelperClone = { ...audioPlayerHelper };
    const updatedSongs = audioPlayerHelperClone.songs.map((song, index) => ({
      ...song,
      isPlaying: index === audioPlayerHelperClone.currentIndex,
    }));
    updateAudioState({
      ...audioPlayerHelperClone,
      songs: updatedSongs,
    });
  };

  const handlePlayFromList = (index) => {
    const audioPlayerHelperClone = { ...audioPlayerHelper };
    const updatedSongs = audioPlayerHelperClone.songs.map((song, i) => ({
      ...song,
      isPlaying: i === index,
    }));
    updateAudioState({
      ...audioPlayerHelperClone,
      songs: updatedSongs,
      currentIndex: index,
    });
  };

  const handlePauseFromList = (index) => {
    const audioPlayerHelperClone = { ...audioPlayerHelper };
    const updatedSongs = audioPlayerHelperClone.songs.map((song, i) => ({
      ...song,
      isPlaying: i === index ? false : song.isPlaying,
    }));
    updateAudioState({
      ...audioPlayerHelperClone,
      songs: updatedSongs,
    });
  };

  const toggleLoopMode = () => {
    const audioPlayerHelperClone = { ...audioPlayerHelper };
    audioPlayerHelperClone.loopMode =
      audioPlayerHelperClone.loopMode === "all" ? "single" : "all";
    updateAudioState(audioPlayerHelperClone);
  };

  const playNextSong = () => {
    const audioPlayerHelperClone = { ...audioPlayerHelper };
    let nextIndex;
    if (audioPlayerHelperClone.loopMode === "all") {
      nextIndex =
        (audioPlayerHelperClone.currentIndex + 1) %
        audioPlayerHelperClone.songs.length;
    } else {
      nextIndex = audioPlayerHelperClone.currentIndex + 1;
      if (nextIndex >= audioPlayerHelperClone.songs.length) {
        nextIndex = audioPlayerHelperClone.currentIndex;
      }
    }
    const updatedSongs = audioPlayerHelperClone.songs.map((song, i) => ({
      ...song,
      isPlaying: i === nextIndex,
    }));
    updateAudioState({
      ...audioPlayerHelperClone,
      songs: updatedSongs,
      currentIndex: nextIndex,
    });
  };

  const playPreviousSong = () => {
    const audioPlayerHelperClone = { ...audioPlayerHelper };
    let prevIndex;
    if (audioPlayerHelperClone.loopMode === "all") {
      prevIndex =
        (audioPlayerHelperClone.currentIndex -
          1 +
          audioPlayerHelperClone.songs.length) %
        audioPlayerHelperClone.songs.length;
    } else {
      prevIndex = audioPlayerHelperClone.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = audioPlayerHelperClone.currentIndex;
      }
    }
    const updatedSongs = audioPlayerHelperClone.songs.map((song, i) => ({
      ...song,
      isPlaying: i === prevIndex,
    }));
    updateAudioState({
      ...audioPlayerHelperClone,
      songs: updatedSongs,
      currentIndex: prevIndex,
    });
  };

  useEffect(() => {
    setLoading(true);
    const fetchBanner = async () => {
      try {
        const response = await fetchSlider({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "publication",
        });
        setBanner(response.data.responseBody);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  const handleDownload = (song, index) => {
    const url = audioPlayerHelper.songs[index].src;
    setIsLoading(true);
    setDownloadingIndex(index);
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${song?.name}.mp3`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        setDownloadingIndex(null);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching PDF:", error);
        setDownloadingIndex(null);
        setIsLoading(false);
      });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  const isCurrentPlaying =
    audioPlayerHelper.songs[audioPlayerHelper.currentIndex]?.isPlaying;

  return (
    <div>
      {isAlbumDetail && (
        <div>
          <div className="contact-img-wrap">
            <div className="spinner-container-banner">
              <InnerpageLoader
                src={banner}
                className="about-img"
                onImageLoad={handleImageLoad}
              />
            </div>
            {imageLoaded && (
              <div className="breadcrumbs-wrap">
                <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
              </div>
            )}
          </div>
          {!imageLoaded && (
            <div className="shimmer-activity-wrapper">
              <div className="shimmer" />
            </div>
          )}
        </div>
      )}

      <Container>
        {Array.isArray(publicationList) && publicationList.length > 0 ? (
          <div className="publication-serach-wrap pt-lg-5 pt-md-0">
            <div>
              <div className="publication-tabs">
                <div className="publication-tab-wrap">
                  {publicationList.map((publication, index) => (
                    <div key={index}>
                      <button
                        className={
                          publicationId?.toString() ===
                          publication.id.toString()
                            ? "active-tab"
                            : ""
                        }
                        onClick={() =>
                          handleButtonClick(
                            publication.name,
                            publication.id,
                            index,
                            publication.ui_slug,
                            publication.albums
                          )
                        }
                      >
                        {publication.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <PublicationSearchModal />
          </div>
        ) : (
          <div
            className="publication-serach-wrap"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <div className="publication-tabs">
                <div className="publication-tab-wrap">
                  <div
                    className="shimmerTab"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="publication-tab-shimmer" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="publication-Search-shimmer" />
          </div>
        )}

        {typeof finalAudioListData === "string" ||
        (Array.isArray(!finalAudioListData) && !finalAudioListData) ? (
          <div className="no-data mt-4">No data available</div>
        ) : Array.isArray(finalAudioListData) &&
          finalAudioListData.length > 0 ? (
          <div className="audio-player-1" data-aos="fade-up">
            {/* ---- Album Detail Card ---- */}
            <div className="album-detail-card">
              <div className="album-detail-left">
                <LazyLoadImage
                  src={
                    publicationDetailResponse?.albums?.image ?? imageNotFound
                  }
                  alt=""
                  className="album-detail-img"
                  wrapperClassName="lazy-load-image-background aboutustype"
                />
              </div>
              <div className="album-detail-right">
                <span className="album-category-badge">
                  <MusicNoteIcon style={{ fontSize: 16 }} />{" "}
                  {publicationDetailResponse?.publication?.name || ""}
                </span>
                <h2 className="album-detail-title">{albumName}</h2>
                <p className="album-detail-desc">
                  {publicationDetailResponse?.albums?.short_description ||
                    ""}
                </p>
                <div className="album-meta-row">
                  <div className="album-meta-item">
                    <MusicNoteIcon className="album-meta-icon" />
                    <div>
                      <span className="album-meta-label">Total Tracks</span>
                      <strong className="album-meta-value">
                        {audioPlayerHelper.songs.length}
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="album-action-buttons">
                  <button
                    className="album-download-btn"
                    onClick={handleDownloadAllAudio}
                  >
                    <DownloadForOfflineIcon /> Download Album
                    {isLoader && <AudioPlayerLoader />}
                  </button>
                </div>
              </div>
            </div>

            {/* ---- Track List Table ---- */}
            <div className="track-table-wrap">
              <div className="track-table-header">
                <div className="track-col-num">#</div>
                <div className="track-col-title">Title</div>
                <div className="track-col-actions">Actions</div>
              </div>
              {audioPlayerHelper.songs.map((song, index) => (
                <div
                  className={`track-row ${
                    audioPlayerHelper.currentIndex === index && song.isPlaying
                      ? "track-row-active"
                      : ""
                  }`}
                  key={index}
                  onClick={() => {
                    if (
                      audioPlayerHelper.currentIndex === index &&
                      song.isPlaying
                    ) {
                      handlePauseFromList(index);
                    } else {
                      handlePlayFromList(index);
                    }
                  }}
                >
                  <div className="track-col-num">
                    {audioPlayerHelper.currentIndex === index &&
                    song.isPlaying ? (
                      <div className="playing">
                        <span className="playing__bar playing__bar1"></span>
                        <span className="playing__bar playing__bar2"></span>
                        <span className="playing__bar playing__bar3"></span>
                      </div>
                    ) : (
                      song.name?.match(/^\d+/)?.[0] || String(index + 1).padStart(2, "0")
                    )}
                  </div>
                  <div className="track-col-title">
                    <h6
                      className={`track-name ${
                        song.isPlaying ? "track-name-active" : ""
                      }`}
                    >
                      {song?.name?.replace(/^\d+\s*[-.):\s]*\s*/, "") || song?.name}
                    </h6>
                    {song.short_description && (
                      <p className="track-desc">{song.short_description}</p>
                    )}
                  </div>
                  <div className="track-col-actions">
                    <button
                      className="track-play-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          audioPlayerHelper.currentIndex === index &&
                          song.isPlaying
                        ) {
                          handlePauseFromList(index);
                        } else {
                          handlePlayFromList(index);
                        }
                      }}
                    >
                      {audioPlayerHelper.currentIndex === index &&
                      song.isPlaying ? (
                        <PauseCircleIcon className="track-icon-play" />
                      ) : (
                        <PlayCircleIcon className="track-icon-play" />
                      )}
                    </button>
                    <button
                      className="track-download-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(song, index);
                      }}
                    >
                      {downloadingIndex === index ? (
                        <AudioPlayerLoader />
                      ) : (
                        <DownloadForOfflineIcon className="track-icon-download" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ---- Shimmer Loading State ---- */
          <div className="audio-player-1" data-aos="fade-up">
            <div className="album-shimmer-card">
              <div className="album-shimmer-img"></div>
              <div className="album-shimmer-info">
                <div
                  className="album-shimmer-line"
                  style={{ width: "30%" }}
                ></div>
                <div
                  className="album-shimmer-line"
                  style={{ width: "70%", height: "28px" }}
                ></div>
                <div
                  className="album-shimmer-line"
                  style={{ width: "50%" }}
                ></div>
                <div
                  className="album-shimmer-line"
                  style={{ width: "80%", marginTop: "10px" }}
                ></div>
                <div
                  className="album-shimmer-line"
                  style={{ width: "40%", height: "40px", marginTop: "10px" }}
                ></div>
              </div>
            </div>

            <div className="track-table-wrap">
              {[...Array(6)].map((_, index) => (
                <div className="track-shimmer-row" key={index}>
                  <div className="track-shimmer-num"></div>
                  <div className="track-shimmer-title"></div>
                  <div className="track-shimmer-btn"></div>
                  <div className="track-shimmer-btn"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* ---- Bottom Audio Player ---- */}
      {typeof finalAudioListData === "string" ||
      (Array.isArray(finalAudioListData) &&
        finalAudioListData.length === 0) ? (
        <div></div>
      ) : (
        <div className="audio-bottom-player">
          <div className="bottom-player-left">
            <img
              src={
                publicationDetailResponse?.albums?.image ?? imageNotFound
              }
              alt=""
              className="bottom-player-img"
            />
            <div className="bottom-player-info">
              <p className="bottom-player-title">{currentSongTitle}</p>
              <p className="bottom-player-album">{albumName}</p>
              <span className="bottom-player-time">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="bottom-player-center">
            <div className="bottom-player-controls">
              <button onClick={toggleLoopMode} className="bottom-ctrl-btn">
                {audioPlayerHelper.loopMode === "all" ? (
                  <BsRepeat className="bottom-ctrl-icon" />
                ) : (
                  <BsRepeat1 className="bottom-ctrl-icon" />
                )}
              </button>
              <button onClick={playPreviousSong} className="bottom-ctrl-btn">
                <TbPlayerTrackPrevFilled className="bottom-ctrl-icon" />
              </button>
              {isCurrentPlaying ? (
                <button
                  onClick={handlePauseFromPlayer}
                  className="bottom-play-btn"
                >
                  <PauseCircleIcon className="bottom-play-icon" />
                </button>
              ) : (
                <button
                  onClick={handlePlayFromPlayer}
                  className="bottom-play-btn"
                >
                  <PlayCircleIcon className="bottom-play-icon" />
                </button>
              )}
              <button onClick={playNextSong} className="bottom-ctrl-btn">
                <TbPlayerTrackNextFilled className="bottom-ctrl-icon" />
              </button>
            </div>
            <div className="bottom-progress-wrap">
              <span className="bottom-progress-time">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="bottom-progress-bar"
                step="0.1"
              />
              <span className="bottom-progress-time">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="bottom-player-right">
            <div className="bottom-volume-wrap">
              <VolumeUpIcon className="bottom-volume-icon" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="bottom-volume-bar"
              />
            </div>
          </div>

          <audio
            ref={audioRef}
            src={
              audioPlayerHelper.songs[audioPlayerHelper.currentIndex]?.src
            }
            autoPlay={false}
            onPause={handlePauseFromPlayer}
            onPlay={handlePlayFromPlayer}
            style={{ display: "none" }}
          />
        </div>
      )}
    </div>
  );
};
export default AudioListPlayer;
