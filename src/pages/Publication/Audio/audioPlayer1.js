import React, { useState, useEffect, useRef } from 'react';

const AudioPlayer = () => {
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: 'Song 1',
      src: 'https://www.kozco.com/tech/LRMonoPhase4.mp3',
      isPlaying: false,
    },
    {
      id: 2,
      title: 'Song 2',
      src: 'https://www.kozco.com/tech/piano2.wav',
      isPlaying: false,
    },
    {
      id: 3,
      title: 'Song 3',
      src: 'https://www.kozco.com/tech/organfinale.mp3',
      isPlaying: false,
    },
    {
      id: 4,
      title: 'Song 4',
      src: 'https://www.kozco.com/tech/32.mp3',
      isPlaying: false,
    },
  ]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [loopMode, setLoopMode] = useState('all'); // 'all' or 'single'
  const audioRef = useRef(null);

  const [isFirstIntrection, setIsFirstIntrection] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      if (loopMode === 'single') {
        audio.play();
      } else {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
      }
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
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
        console.error('Playback failed:', err);
      }
    }
      };

  const playPrevious = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1,
    );
  };

  const playNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const toggleLoopMode = () => {
    setLoopMode((prevLoopMode) => (prevLoopMode === 'all' ? 'single' : 'all'));
  };

  const handleTrackChange = (index) => {
        const updatedSongs = songs.map((song, idx) =>
      idx === index
        ? { ...song, isPlaying: true }
        : { ...song, isPlaying: false },
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
    <div>
      <ul>
        {songs.map((song, index) => (
          <li key={song.id}>
            {song.title}
            <button
              onClick={() => {
                if (currentSongIndex === 0 && isFirstIntrection === true) {
                  setIsFirstIntrection(false);
                }
                setCurrentSongIndex(index);
              }}
            >
              {currentSongIndex === index && song.isPlaying ? 'Pause' : 'Play'}
            </button>
          </li>
        ))}
      </ul>
      <audio
        ref={audioRef}
        controls
        src={songs[currentSongIndex].src}
        autoPlay={true}
        onPause={handlePauseAll}
        onPlay={handleCurrentPlay}
      />
      <button onClick={playPrevious}>Previous</button>
      <button onClick={() => togglePlayback(currentSongIndex)}>
        Play/Pause
      </button>
      <button onClick={playNext}>Next</button>
      <button onClick={toggleLoopMode}>
        {loopMode === 'all' ? 'Repeat All' : 'Repeat Single'}
      </button>
    </div>
  );
};

export default AudioPlayer;
