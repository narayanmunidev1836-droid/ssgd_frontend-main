import React, { useState, useEffect, useRef } from "react";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { BsRepeat1 } from "react-icons/bs";
import { BsRepeat } from "react-icons/bs";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { IoIosPause, IoMdDownload } from "react-icons/io";
import { BiSolidDownload } from "react-icons/bi";
import Loader from "../../../common/Loader/Loader";
import InnerpageLoader from "../../Home/InnerpageLoader";
import {
  downloadAudio,
  fetchPublicationList,
  fetchSlider,
} from "../../../api/API";
import imageNotFound from "../../../../src/assets/images/NoImageFound.jpg.png";
import "./AudioPlayer.css";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

import { useNavigate, useParams } from "react-router-dom";

import { fetchPublicationDetails } from "../../../api/API";
import { Container } from "@mui/material";
import PublicationSearchModal from "../../../common/PublicationSearchModal/PublicationSearchModal";
import AudioPlayerLoader from "../../../common/Loader/AudioPlayerLoader";
import FullpageLoader from "../../../common/HomeSliderLoader/FullpageLoader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

const AudioListPlayer = ({ audioListData , publiCationLoading }) => {
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
            url: process.env.REACT_APP_API_URL,
            page: "publication",
            album_id: params.album_id,
          });
                    setFinalAudioListData(response.data.responseBody.list);
          // setPublication(response.data.responseBody.publication);
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
        url: process.env.REACT_APP_API_URL,
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
        url: process.env.REACT_APP_API_URL,
        page: "publication",
        // order_by: "all",
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

    // window.history.pushState(
    //   null,
    //   "",
    //   `/publication-detail/${PublicationId}/${publicationName}`
    // );
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

  useEffect(() => {
    const audio = audioRef.current;

    audio?.addEventListener("ended", handleSongEnded);

    const playAudio = async () => {
      try {
        const currentSrc = audio.src;
        const newSrc =
          audioPlayerHelper.songs[audioPlayerHelper.currentIndex].src;

        // Check if the current audio source is the same as the new source
        if (currentSrc !== newSrc) {
          await audio.load(); // Load the new source
        }

        // Check If Any Song is isPlaying is Set To True then Start Audio Player
        const isAnySongPlaying = audioPlayerHelper.songs.some(
          (song) => song.isPlaying
        );

        if (isAnySongPlaying === true) {
          await audio.play();
        } else {
          await audio.pause();
        }
      } catch (e) {
              }
    };
    const currentSong = audioPlayerHelper.songs[audioPlayerHelper.currentIndex];
    setCurrentSongTitle(currentSong?.name);

    playAudio();

    
    return () => {
      audio?.removeEventListener("ended", handleSongEnded);
    };
  }, [audioPlayerHelper]);

  const updateAudioState = (audioPlayerHelperClone) => {
    // Convert state objects to strings for comparison
    const stateString = JSON.stringify(audioPlayerHelper);
    const cloneString = JSON.stringify(audioPlayerHelperClone);

    // Check if the string representations are equal
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
    // Clone the audioPlayerHelper state
    const audioPlayerHelperClone = { ...audioPlayerHelper };

    // Update the isPlaying property of the currently playing song to false
    const updatedSongs = audioPlayerHelperClone.songs.map((song, index) => ({
      ...song,
      isPlaying:
        index === audioPlayerHelperClone.currentIndex ? false : song.isPlaying,
    }));

    // Update the cloned state with the new array of songs
    updateAudioState({
      ...audioPlayerHelperClone,
      songs: updatedSongs,
    });
  };

  const handlePlayFromPlayer = () => {
    // Clone the audioPlayerHelper state
    const audioPlayerHelperClone = { ...audioPlayerHelper };

    // Update the isPlaying property of the currently playing song to true
    const updatedSongs = audioPlayerHelperClone.songs.map((song, index) => ({
      ...song,
      isPlaying: index === audioPlayerHelperClone.currentIndex,
    }));

    // Update the cloned state with the new array of songs
    updateAudioState({
      ...audioPlayerHelperClone,
      songs: updatedSongs,
    });
  };

  const handlePlayFromList = (index) => {
    // Clone the audioPlayerHelper state
    const audioPlayerHelperClone = { ...audioPlayerHelper };

    // Create a new array of songs with updated isPlaying values
    const updatedSongs = audioPlayerHelperClone.songs.map((song, i) => ({
      ...song,
      isPlaying: i === index,
    }));

    // Update the cloned state with the new array of songs and currentIndex
    updateAudioState({
      ...audioPlayerHelperClone,
      songs: updatedSongs,
      currentIndex: index,
    });
  };

  const handlePauseFromList = (index) => {
    // Clone the audioPlayerHelper state
    const audioPlayerHelperClone = { ...audioPlayerHelper };

    // Update the isPlaying property of the song at the specified index to false
    const updatedSongs = audioPlayerHelperClone.songs.map((song, i) => ({
      ...song,
      isPlaying: i === index ? false : song.isPlaying,
    }));

    // Update the cloned state with the new array of songs
    updateAudioState({
      ...audioPlayerHelperClone,
      songs: updatedSongs,
    });
  };

  const toggleLoopMode = () => {
    // Clone the audioPlayerHelper state
    const audioPlayerHelperClone = { ...audioPlayerHelper };

    audioPlayerHelperClone.loopMode =
      audioPlayerHelperClone.loopMode === "all" ? "single" : "all";

    updateAudioState(audioPlayerHelperClone);
  };

  const playNextSong = () => {
    // Clone the audioPlayerHelper state
    const audioPlayerHelperClone = { ...audioPlayerHelper };

    // Calculate the index of the next song
    let nextIndex;
    if (audioPlayerHelperClone.loopMode === "all") {
      nextIndex =
        (audioPlayerHelperClone.currentIndex + 1) %
        audioPlayerHelperClone.songs.length;
    } else {
      nextIndex = audioPlayerHelperClone.currentIndex + 1;
      if (nextIndex >= audioPlayerHelperClone.songs.length) {
        // If currentIndex is at the end of the playlist and loopMode is 'single', stay at the same index
        nextIndex = audioPlayerHelperClone.currentIndex;
      }
    }

    // Create a new array of songs with updated isPlaying values
    const updatedSongs = audioPlayerHelperClone.songs.map((song, i) => ({
      ...song,
      isPlaying: i === nextIndex,
    }));

    // Update the cloned state with the new array of songs and currentIndex
    updateAudioState({
      ...audioPlayerHelperClone,
      songs: updatedSongs,
      currentIndex: nextIndex,
    });
  };

  const playPreviousSong = () => {
    // Clone the audioPlayerHelper state
    const audioPlayerHelperClone = { ...audioPlayerHelper };

    // Calculate the index of the previous song
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
        // If currentIndex is at the beginning of the playlist and loopMode is 'single', stay at the same index
        prevIndex = audioPlayerHelperClone.currentIndex;
      }
    }

    // Create a new array of songs with updated isPlaying values
    const updatedSongs = audioPlayerHelperClone.songs.map((song, i) => ({
      ...song,
      isPlaying: i === prevIndex,
    }));

    // Update the cloned state with the new array of songs and currentIndex
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
          url: process.env.REACT_APP_API_URL,
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

  const handleDownloadAudio = (index) => {
    var src = audioPlayerHelper.songs[index].src;
  };

  const handleDownload = (song, index) => {
    const url = audioPlayerHelper.songs[index].src;
    setIsLoading(true);
    setDownloadingIndex(index);
    // Fetch the PDF content
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary URL for the Blob
        const blobUrl = URL.createObjectURL(blob);
        // Create a temporary anchor element
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${song?.name}.mp3`; // Set the file name here
        link.style.display = "none";
        // Append the anchor to the body
        document.body.appendChild(link);
        // Trigger a click event on the anchor to initiate the download
        link.click();
        // Remove the temporary anchor element
        document.body.removeChild(link);
        // Revoke the Blob URL
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
          {/* {!imageLoaded && <FullpageLoader />} */}
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
            style={{ display: "flex", justifyContent: "beetween" }}
          >
            <div>
              <div className="publication-tabs">
                {/* <div className="publication-tab-wrap">
                  <div
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
                </div> */}
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
          <div className="no-data mt-4">
            {/* No data available for the selected year. */}
            No data available
          </div>
        ) : Array.isArray(finalAudioListData) && finalAudioListData.length > 0 ? (
          <div className="audio-player-1"  data-aos="fade-up">
            <div className="audio-player-image">
              <div className="audio-player-wrap">
                <div className="">
                  <div className="audio-player-inneer-wrap pt-5">
                    <div className="audio-player-img-wrap d-flex">
                      <div className="audio-section-width">
                        {/* <img
                          // src={
                          //   audioPlayerHelper.songs[audioPlayerHelper.currentIndex]
                          //     ?.image
                          // }
                          //working
                          src={
                            publicationDetailResponse?.albums?.image ??
                            imageNotFound
                          }
                          alt=""
                          className="audio-img-1"
                        /> */}
                        <LazyLoadImage
                          src={
                            publicationDetailResponse?.albums?.image ??
                            imageNotFound
                          }
                          alt=""
                          className="audio-img-1"
                          wrapperClassName="lazy-load-image-background aboutustype"
                          afterLoad={() => {
                            const image = document.querySelector(
                              `.lazy-load-image-background[data-src="${
                                publicationDetailResponse?.albums?.image ??
                                imageNotFound
                              }"]`
                            );
                            if (image) {
                              image.classList.add("lazy-load-image-loaded");
                            }
                          }}
                        />
                      </div>
                      <div className="audio-section-width-wrap">
                        <p className="audio-album-name">{albumName}</p>
                        <div className="audio-title-wrap">
                          {currentSongTitle && (
                            <p className="current-song-title-data">
                              {currentSongTitle}
                            </p>
                          )}
                        </div>
                        <hr className="m-0 mb-2" />
                        <div
                          className="d-flex gap-2"
                          onClick={handleDownloadAllAudio}
                        >
                          <DownloadForOfflineIcon className="download-icon-player" />
                          <p className="download-album">Download Album</p>
                          {isLoader && <AudioPlayerLoader />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="track-container-1">
              {audioPlayerHelper.songs.map((song, index) => (
                <>
                  <div className="audio-wrap" data-aos="fade-up">
                    <div className="audio-list-wrap1" key={index}>
                      <div className="audio-list-wrap">
                        {/* <div>
                          <img
                            src={
                              publicationDetailResponse?.albums?.image ??
                              imageNotFound
                            }
                            className="audio-list-image"
                          />
                        </div> */}
                        <div
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
                          <h6
                            key={song.id}
                            className={`current-song-title-color ${
                              song.isPlaying ? "current-song-title" : ""
                            }`}
                          >
                            {song?.name}
                          </h6>
                          <p>{song.short_description}</p>
                        </div>
                      </div>

                      <div
                        className="audio-list-1"
                        // onClick={() => {
                        //   if (
                        //     audioPlayerHelper.currentIndex === index &&
                        //     song.isPlaying
                        //   ) {
                        //     handlePauseFromList(index);
                        //   } else {
                        //     handlePlayFromList(index);
                        //   }
                        // }}
                      >
                        <div className="d-flex">
                          <button
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
                            className="play-pause-btn"
                          >
                            <div className="player-1">
                              {audioPlayerHelper.currentIndex === index &&
                                song.isPlaying && (
                                  <div className="playing">
                                    <span className="playing__bar playing__bar1"></span>
                                    <span className="playing__bar playing__bar2"></span>
                                    <span className="playing__bar playing__bar3"></span>
                                  </div>
                                )}

                              {audioPlayerHelper.currentIndex === index &&
                              song.isPlaying ? (
                                <PauseCircleIcon className="pause-icon-audio" />
                              ) : (
                                <PlayCircleIcon className="play-icon-audio" />
                              )}
                            </div>
                          </button>
                          {/* <button
                            className="play-pause-btn"
                            onClick={() => handleDownload(song, index)}
                          >
                            <DownloadForOfflineIcon className="download-icon-audio" />
                          </button> */}
                          <button
                            className="play-pause-btn"
                            onClick={() => handleDownload(song, index)}
                          >
                            {downloadingIndex === index ? (
                              <AudioPlayerLoader />
                            ) : (
                              <DownloadForOfflineIcon className="download-icon-audio" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        ) : (
          <div className="audio-player-1" data-aos="fade-up">
            <div className="audio-player-image">
              <div className="audio-player-wrap">
                <div className="">
                  <div className="audio-player-inneer-wrap pt-5">
                    <div className="audio-player-img-wrap d-flex">
                      <div className="audio-section-width">
                        <div className="publication-detail-image-card"></div>
                      </div>
                      <div className="audio-section-width-wrap">
                        <div className="publication-tab-shimmer"></div>
                        <div className="audio-title-wrap pt-2">
                          <div className="publication-tab-shimmer"></div>
                        </div>
                        <hr className="m-0 my-2" />
                        <div className="publication-tab-shimmer w-25"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="track-container-1">
              {[...Array(5)].map((index) => (
                <>
                  <div className="audio-wrap">
                    <div className="audio-list-wrap1" key={index}>
                      <div className="audio-list-wrap">
                        {/* <div>
                          <img
                            src={
                              publicationDetailResponse?.albums?.image ??
                              imageNotFound
                            }
                            className="audio-list-image"
                          />
                        </div> */}
                        <div>
                          <h6>
                            <div
                              className="publication-tab-shimmer"
                              style={{ width: "500px", height: "25px" }}
                            ></div>
                          </h6>
                        </div>
                      </div>

                      <div className="audio-list-1">
                        <div className="d-flex gap-2">
                          <div className="publication-button-round-shimmer"></div>
                          <div className="publication-button-round-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        )}

        

        {/*======== End =======  */}
      </Container>
      {typeof finalAudioListData === "string" ||
      (Array.isArray(finalAudioListData) && finalAudioListData.length === 0) ? (
        <div></div>
      ) : (
        <div className="audio-player-container-2 mt-3" data-aos="fade-up">
          <div className="audio-player-div">
            <button onClick={toggleLoopMode} className="audio-btn">
              {audioPlayerHelper.loopMode === "all" ? (
                <BsRepeat className="play-repeatIcon" />
              ) : (
                <BsRepeat1 className="play-repeatIcon" />
              )}
            </button>
            <TbPlayerTrackPrevFilled
              onClick={playPreviousSong}
              className="prev-icon  prev-album-icon"
            />

            <audio
              ref={audioRef}
              controls
              src={audioPlayerHelper.songs[audioPlayerHelper.currentIndex]?.src}
              autoPlay={false}
              onPause={handlePauseFromPlayer}
              onPlay={handlePlayFromPlayer}
              className="audio-player"
            />
            <TbPlayerTrackNextFilled
              onClick={playNextSong}
              className="next-icon"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default AudioListPlayer;
