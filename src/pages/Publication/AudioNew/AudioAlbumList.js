import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const AudioAlbumList = ({ albumnData,publiCationLoading }) => {
  const navigate = useNavigate();
  
  const handleClick = (album_id, publication_id) => {
        navigate(`/audio-album/${album_id}/publication/${publication_id}`);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <Grid
      container
      spacing={3}
      justifyContent="center"
      className="katha-content-wrap"
    >{publiCationLoading ? (
      <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
          <Grid key={index} item xs={6} sm={6} md={3}>
          <div className="katha-img-wrap katha-img-wrap-publication" data-aos="fade-up">
          <div className="publication-katha-image-card" />
          </div>
        </Grid>
      ))}
    </Grid>
    ):(
      albumnData &&
        albumnData.map((album, index) => (
          <Grid key={index} item xs={6} sm={6} md={3}>
            {/* <div className="katha-img-wrap"> */}
            <div className="katha-img-wrap katha-img-wrap-publication"  data-aos="fade-up">
              <img
                src={album.image}
                alt=""
                className="katha-img katha-albums-image"
              />
              <div className="katha-content katha-content-publication">
                <div className="video-album-content">
                  <h4 className="video-album-content">
                    {album.name ? album.name : album.title}
                  </h4>
                </div>
                <div>
                  <p>{album.short_description}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleClick(album.id, album.publication_id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Grid>
        )))}
    </Grid>
  );
};

export default AudioAlbumList;
