import React, { useState, useEffect, useRef } from "react";
import image from "../../../../assets/images/subheader.webp";
import image1 from "../../../../assets/images/Satsang App Gopalanand Swamini Vato.webp";
import CommonBreadcrumbs from "../../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { BsRepeat1 } from "react-icons/bs";
import { BsRepeat } from "react-icons/bs";
import { IoPlay } from "react-icons/io5";
import { IoIosPause } from "react-icons/io";
import "./AudioPlayer.css";

const AudioPlayer = () => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    { label: "Audio", url: "/publication-detail/audio" },
    <Typography color="text.primary" className="active-link-color">
      Audio
    </Typography>,
  ];

  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Song 1",
      src: "https://www.kozco.com/tech/LRMonoPhase4.mp3",
      isPlaying: false,
    },
    {
      id: 2,
      title: "Song 2",
      src: "https://www.kozco.com/tech/piano2.wav",
      isPlaying: false,
    },
    {
      id: 3,
      title: "Song 3",
      src: "https://www.kozco.com/tech/organfinale.mp3",
      isPlaying: false,
    },
    {
      id: 4,
      title: "Song 4",
      src: "https://www.kozco.com/tech/32.mp3",
      isPlaying: false,
    },
  ]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [loopMode, setLoopMode] = useState("all"); // 'all' or 'single'
  const audioRef = useRef(null);

  const [isFirstIntrection, setIsFirstIntrection] = useState(true);
  const [needRebuild, setNeedRebuild] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      if (loopMode === "single") {
        audio.play();
      } else {
        setIsFirstIntrection(false);
                        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [loopMode]);

  useEffect(() => {
    const audio = audioRef.current;
    const playAudio = async () => {
      try {
        await audio.load(); // Load the new source
      } catch (e) {
              }
    };
    playAudio();
    if (isFirstIntrection === false) {
      handleTrackChange(currentSongIndex);
      togglePlayback(currentSongIndex);
    }
          }, [currentSongIndex, isFirstIntrection]);

  useEffect(() => {
      }, [songs]);

  const togglePlayback = async (index) => {
        const audio = audioRef.current;
    if (songs[currentSongIndex].isPlaying) {
      await audio.pause();
      handlePauseAll();
    } else {
      try {
        await audio.play();
        handleTrackChange(index);
      } catch (err) {
        console.error("Playback failed:", err);
      }
    }
      };

  const playPrevious = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };

  const playNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const toggleLoopMode = () => {
    setLoopMode((prevLoopMode) => (prevLoopMode === "all" ? "single" : "all"));
  };

  const handleTrackChange = (index) => {
        const updatedSongs = songs.map((song, idx) =>
      idx === index
        ? { ...song, isPlaying: true }
        : { ...song, isPlaying: false }
    );
    setSongs(updatedSongs);
      };

  const handlePauseAll = () => {
        const updatedSongs = songs.map((song) => {
      const updatedItem = {
        ...song,
        isPlaying: false,
      };

      return updatedItem;
    });
    setSongs(updatedSongs);
      };

  const handleCurrentPlay = () => {
        const updatedSongs = songs.map((song, index) => {
      if (index === currentSongIndex) {
        const updatedItem = {
          ...song,
          isPlaying: true,
        };

        return updatedItem;
      }

      return song;
    });
    setSongs(updatedSongs);
      };

  return (
    <>
      <div className="contact-img-wrap">
        <img src={image} alt="" className="about-img" />
        <div className="breadcrumbs-wrap">
          <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
        </div>
      </div>
      <div className="section-padding"></div>
      <Container>
        <div className="audio-player-1">
          <div>
            <div className="audio-player-wrap">
              <div>
                <img src={image1} alt="" className="audio-img-1" />
              </div>
              <div className="pt-3">
                <div className="audio-title-wrap">
                  <p>
                    <span>Currently Playing:</span>
                    {currentSongIndex !== null &&
                    songs[currentSongIndex].isPlaying
                      ? songs[currentSongIndex].title
                      : "-"}
                  </p>
                </div>

                <div className="audio-player-container-1 mt-3">
                  <div className="icon_wrap">
                    <button onClick={toggleLoopMode} className="audio-btn">
                      {loopMode === "all" ? <BsRepeat /> : <BsRepeat1 />}
                    </button>

                    <TbPlayerTrackPrevFilled
                      onClick={playPrevious}
                      className="prev-icon"
                    />

                    {/* <button onClick={() => togglePlayback(currentSongIndex)}>
                    {songs[currentSongIndex].isPlaying ? <IoIosPause /> : <IoPlay />}
                  </button> */}
                  </div>

                  <div>
                    <audio
                      ref={audioRef}
                      controls
                      src={songs[currentSongIndex].src}
                      autoPlay={false}
                      onPause={handlePauseAll}
                      onPlay={handleCurrentPlay}
                      className="audio_player"
                    />
                  </div>

                  <div>
                    {/* <button onClick={playNext}>Next</button> */}
                    <TbPlayerTrackNextFilled
                      onClick={playNext}
                      className="next-icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="track-container-1">
            {songs.map((song, index) => (
              <>
                <div
                  className="audio-list-1"
                  onClick={async () => {
                    if (currentSongIndex == index && song.isPlaying) {
                      const audio = audioRef.current;

                      await audio.pause();
                      handlePauseAll();
                      togglePlayback(currentSongIndex);
                    } else {
                      if (
                        currentSongIndex === 0 &&
                        isFirstIntrection === true
                      ) {
                        setIsFirstIntrection(false);
                      }
                      setCurrentSongIndex(index);
                    }
                  }}
                >
                  <div>
                    <h6
                      key={song.id}
                      className={
                        currentSongIndex === index && song.isPlaying
                          ? "current-song-title"
                          : ""
                      }
                    >
                      {song.title}
                    </h6>
                  </div>

                  <div className="player-1">
                    {currentSongIndex === index && song.isPlaying && (
                      <div className="playing">
                        <span className="playing__bar playing__bar1"></span>
                        <span className="playing__bar playing__bar2"></span>
                        <span className="playing__bar playing__bar3"></span>
                      </div>
                    )}

                    <button
                      onClick={async () => {
                        if (currentSongIndex == index && song.isPlaying) {
                          const audio = audioRef.current;

                          await audio.pause();
                          handlePauseAll();
                          togglePlayback(currentSongIndex);
                        } else {
                          if (
                            currentSongIndex === 0 &&
                            isFirstIntrection === true
                          ) {
                            setIsFirstIntrection(false);
                          }

                          setCurrentSongIndex(index);
                        }
                      }}
                      className="play-pause-btn"
                    >
                      {/* {currentSongIndex === index && song.isPlaying ? 'Pause' : 'Play'} */}
                      {currentSongIndex === index && song.isPlaying ? (
                        <IoIosPause className="pause-icon" />
                      ) : (
                        <IoPlay className="play-icon" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default AudioPlayer;
