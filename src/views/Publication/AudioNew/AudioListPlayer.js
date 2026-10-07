"use client";
import React, { useState, useEffect, useRef } from "react";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { BsRepeat1 } from "react-icons/bs";
import { BsRepeat } from "react-icons/bs";
import { BsShare, BsHeart, BsHeartFill } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import FavouriteAlbumList from "../Favourites/FavouriteAlbumList";
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
  const [isFavourite, setIsFavourite] = useState(false);
  const [favouriteTracks, setFavouriteTracks] = useState([]);
  const [showFavourites, setShowFavourites] = useState(false);

  const FAVOURITE_KEY = "favouriteAudioAlbums";
  const FAVOURITE_TRACK_KEY = "favouriteAudioTracks";

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

  const readFavouriteAlbums = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(FAVOURITE_KEY) || "[]");
      if (!Array.isArray(stored)) return [];
      return stored.map((item) =>
        typeof item === "string" ? { album_id: item } : item
      );
    } catch (error) {
      return [];
    }
  };

  const getAlbumSnapshot = () => ({
    album_id: params.album_id ? params.album_id.toString() : "",
    publication_id: params.pub_id ? params.pub_id.toString() : "",
    title: typeof albumName === "string" && albumName ? albumName : "",
    image: publicationDetailResponse?.albums?.image || "",
  });

  useEffect(() => {
    if (!params.album_id) return;
    const stored = readFavouriteAlbums();
    setIsFavourite(
      stored.some(
        (album) => String(album.album_id) === params.album_id.toString()
      )
    );
  }, [params.album_id]);

  const getTrackKey = (song) => String(song?.id ?? song?.name ?? "");
  const getTrackId = (item) => String(item?.id ?? item ?? "");
  const favouriteTrackIds = favouriteTracks.map(getTrackId);

  const isTrackFavourite = (song) => {
    const key = getTrackKey(song);
    return key ? favouriteTrackIds.includes(key) : false;
  };

  const allTracksFavourite =
    Array.isArray(finalAudioListData) &&
    finalAudioListData.length > 0 &&
    finalAudioListData.every((song) => isTrackFavourite(song));

  const isAlbumFavourite = isFavourite || allTracksFavourite;

  const toggleFavourite = () => {
    if (!params.album_id) return;
    const stored = readFavouriteAlbums();
    const albumId = params.album_id.toString();

    if (isAlbumFavourite) {
      const updated = stored.filter(
        (album) => String(album.album_id) !== albumId
      );
      localStorage.setItem(FAVOURITE_KEY, JSON.stringify(updated));
      setIsFavourite(false);

      if (allTracksFavourite) {
        setFavouriteTracks([]);
        localStorage.setItem(FAVOURITE_TRACK_KEY, JSON.stringify([]));
      }
      toast.info("Removed from favourite");
    } else {
      const updated = [...stored, getAlbumSnapshot()];
      localStorage.setItem(FAVOURITE_KEY, JSON.stringify(updated));
      setIsFavourite(true);
      toast.success("Added to favourite");
    }
  };

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(FAVOURITE_TRACK_KEY) || "[]"
      );
      setFavouriteTracks(
        Array.isArray(stored)
          ? stored.map((item) =>
              typeof item === "string" ? { id: item } : item
            )
          : []
      );
    } catch (error) {
      setFavouriteTracks([]);
    }
  }, []);

  const toggleFavouriteTrack = (song) => {
    const key = getTrackKey(song);
    if (!key) return;

    const alreadyFavourite = favouriteTrackIds.includes(key);
    const updated = alreadyFavourite
      ? favouriteTracks.filter((item) => getTrackId(item) !== key)
      : [
          ...favouriteTracks,
          {
            id: key,
            name: song?.name || "",
            album_id: params.album_id ? params.album_id.toString() : "",
            publication_id: params.pub_id ? params.pub_id.toString() : "",
            album_title: typeof albumName === "string" ? albumName : "",
            src: typeof song?.src === "string" ? song.src : "",
          },
        ];

    setFavouriteTracks(updated);
    localStorage.setItem(FAVOURITE_TRACK_KEY, JSON.stringify(updated));

    if (alreadyFavourite) {
      toast.info("Removed from favourite");
    } else {
      const updatedIds = updated.map(getTrackId);
      const albumNowFavourite =
        Array.isArray(finalAudioListData) &&
        finalAudioListData.length > 0 &&
        finalAudioListData.every((track) =>
          updatedIds.includes(getTrackKey(track))
        );

      if (albumNowFavourite) {
        const stored = readFavouriteAlbums();
        const albumId = params.album_id ? params.album_id.toString() : "";
        if (albumId && !stored.some((album) => String(album.album_id) === albumId)) {
          localStorage.setItem(
            FAVOURITE_KEY,
            JSON.stringify([...stored, getAlbumSnapshot()])
          );
          setIsFavourite(true);
        }
        toast.success("Album added to favourite");
      } else {
        toast.success("Added to favourite");
      }
    }
  };

  const copyLink = async (link) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = link;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Unable to copy link");
    }
  };

  const shareLink = async ({ title, text, url }) => {
    const link = url || window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: link });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    copyLink(link);
  };

  const getAlbumTitle = () =>
    typeof albumName === "string" && albumName ? albumName : "Audio Album";

  const handleShareAlbum = () => {
    const title = getAlbumTitle();
    shareLink({
      title,
      text: `Listen to ${title}`,
      url: window.location.href,
    });
  };

  const handleShareSong = (song, index) => {
    const songName =
      song?.name?.replace(/^\d+\s*[-.):\s]*\s*/, "") || song?.name || "Audio";
    const albumTitle =
      typeof albumName === "string" && albumName ? albumName : "";
    // Share the website page, never the backend media URL
    shareLink({
      title: songName,
      text: `Listen to ${songName}${albumTitle ? ` - ${albumTitle}` : ""}`,
      url: window.location.href,
    });
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
    setShowFavourites(false);
    setPublicationAlbumData(null);
    // Clear the open album right away so it is not shown while the route change is pending
    setFinalAudioListData([]);
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

  const currentSong = audioPlayerHelper.songs[audioPlayerHelper.currentIndex];

  const isCurrentPlaying =
    audioPlayerHelper.songs[audioPlayerHelper.currentIndex]?.isPlaying;

  return (
    <div className="temple-page-bg">
      {isAlbumDetail && (
        <div>
          <div className="contact-img-wrap no-banner-head">
            <div className="breadcrumbs-wrap">
              <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
            </div>
          </div>
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
                            publication.id.toString() && !showFavourites
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
                  <div>
                    <button
                      className={showFavourites ? "active-tab" : ""}
                      onClick={() => setShowFavourites(true)}
                    >
                      <BsHeartFill /> Favourites
                    </button>
                  </div>
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

        {showFavourites ? (
          <FavouriteAlbumList />
        ) : typeof finalAudioListData === "string" ||
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
                  <button className="album-share-btn" onClick={handleShareAlbum}>
                    <BsShare /> Share
                  </button>
                  <button
                    className={`album-fav-btn ${
                      isAlbumFavourite ? "album-fav-btn-active" : ""
                    }`}
                    onClick={toggleFavourite}
                    aria-pressed={isAlbumFavourite}
                  >
                    {isAlbumFavourite ? <BsHeartFill /> : <BsHeart />}
                    {isAlbumFavourite ? "Favourited" : "Favourite"}
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
                    <button
                      className="track-share-btn"
                      aria-label="Share"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareSong(song, index);
                      }}
                    >
                      <BsShare className="track-icon-share" />
                    </button>
                    <button
                      className={`track-fav-btn ${
                        isTrackFavourite(song) ? "track-fav-btn-active" : ""
                      }`}
                      aria-label="Favourite"
                      aria-pressed={isTrackFavourite(song)}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavouriteTrack(song);
                      }}
                    >
                      {isTrackFavourite(song) ? (
                        <BsHeartFill className="track-icon-fav" />
                      ) : (
                        <BsHeart className="track-icon-fav" />
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
                  <div className="track-shimmer-btn"></div>
                  <div className="track-shimmer-btn"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* ---- Bottom Audio Player ---- */}
      {showFavourites ||
      typeof finalAudioListData === "string" ||
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
              {currentSong && (
                <button
                  className={`bottom-fav-btn ${
                    isTrackFavourite(currentSong)
                      ? "bottom-fav-btn-active"
                      : ""
                  }`}
                  onClick={() => toggleFavouriteTrack(currentSong)}
                  aria-pressed={isTrackFavourite(currentSong)}
                  aria-label="Favourite"
                  title={
                    isTrackFavourite(currentSong)
                      ? "Remove from favourite"
                      : "Add to favourite"
                  }
                >
                  {isTrackFavourite(currentSong) ? (
                    <BsHeartFill className="bottom-fav-icon" />
                  ) : (
                    <BsHeart className="bottom-fav-icon" />
                  )}
                </button>
              )}
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
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};
export default AudioListPlayer;
