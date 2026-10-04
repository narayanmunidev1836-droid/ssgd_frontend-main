"use client";
import React, { useState, useEffect } from "react";

const YouTubeLiveStatusChecker = ({ channelId, apiKey, fallbackUrl }) => {
  const [isLive, setIsLive] = useState(false);
  const [liveVideoId, setLiveVideoId] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`
        );
        const data = await response.json();

                const liveStatus = data.items[0].snippet.liveBroadcastContent;
        setIsLive(liveStatus === "live");
        if (liveStatus === "live") {
          setLiveVideoId(data.items[0].snippet.liveBroadcastContent);
                  } else {
          // If channel is not live, fetch the latest videos
          const videoResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`
          );
          const videoData = await videoResponse.json();
          setVideos(videoData.items);
                  }
      } catch (error) {
        console.error("Error fetching live status:", error);
      }
    };

    fetchLiveStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on component mount

  const getYoutubeEmbedUrl = (url) => {
    if (url) {
      // Regular expression to match YouTube URL patterns
      const youtubeRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s?]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;

      const match = url.match(youtubeRegex);

      if (match && match[1]) {
        const videoId = match[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return null;
  };

  return (
    <div>
      {isLive ? (
        <div>
          {liveVideoId && (
            <>
              <iframe
                width="100%"
                // height="315"
                // style={{ minHeight: "315px" }}
                src={`https://www.youtube.com/embed/${liveVideoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="live-katha-video"
              ></iframe>
              {/* <h1>live video</h1> */}
            </>
          )}
        </div>
      ) : videos?.length > 0 ? (
        <div>
          <>
            <iframe
              width="100%"
              // height="315"
              // style={{ minHeight: "315px" }}
              src={getYoutubeEmbedUrl(
                `https://www.youtube.com/watch?v=${videos[0].id.videoId}`
              )}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="live-katha-video"
            ></iframe>
            {/* <h1>Prev livevideo</h1> */}
          </>
        </div>
      ) : (
        fallbackUrl && (
          <>
            <iframe
              width="100%"
              // height="315"
              // style={{ minHeight: "315px" }}
              src={fallbackUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video"
              className="live-katha-video"
            ></iframe>
            {/* <h1>Video from api</h1> */}
          </>
        )
      )}
    </div>
  );
};

export default YouTubeLiveStatusChecker;
