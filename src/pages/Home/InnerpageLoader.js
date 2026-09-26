import React from "react";
import { useState } from "react";
import SubpageLoader from "../../common/HomeSliderLoader/SubpageLoader";
export default function InnerpageLoader({
  src,
  width,
  size,
  className,
  onImageLoad,
}) {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
    onImageLoad();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: width ? width : "100%",
        // marginTop: "-150px",
      }}
    >
      <img
        src={src}
        className={className}
        style={{
          display: loading ? "none" : "block",
          width: "100%",
          animation: "fadeIn 0.5s",
        }}
        onLoad={handleLoad}
      ></img>

    </div>
  );
}
