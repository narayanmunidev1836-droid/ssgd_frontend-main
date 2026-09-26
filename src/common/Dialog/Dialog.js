import React, { useRef, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { CgCloseO } from "react-icons/cg";
import "./Dialog.css";

const Dialog = ({ onClose, mediaUrl }) => {
  const [isloading, setIsLoading] = useState(true);
  const handleClose = () => {
    onClose();
  };

  
  const videoRef = useRef(null);

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
    <>
      <div className="dialog-overlay">
        <Card className="dialog-content">
          <div className="video-container">
            <div className="close-btn">
              <CgCloseO onClick={handleClose} />
            </div>
            {isloading && (
              <div className="d-flex justify-content-center align-items-center w-100">
              <div className="publication-image-card w-100" />
              </div>
            )}
            {mediaUrl  && (
              <iframe
                title="YouTube Video"
                src={getYoutubeEmbedUrl(mediaUrl)}
                frameBorder="0"
                allowFullScreen
                className="dialog-video"
                style={{ display: isloading ? "none" : "block" }}
                onLoad={() => {
                  setIsLoading(false);
                }}
              ></iframe>
            )}
            
          </div>
        </Card>
      </div>
    </>
  );
};

export default Dialog;
