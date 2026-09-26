import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const VideoAlbumList = ({ albumnData }) => {
  const navigate = useNavigate();
  const params = useParams();

  const handleClick = (album_id, pub_id) => {
        navigate(`/video-album/${album_id}/publication/${pub_id}`);
  };

  
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        className="katha-content-wrap"

      >
        {!albumnData ? (
          <Grid container spacing={3}>
            {[...Array(8)].map((_, index) => (
              <Grid key={index} item xs={6} sm={6} md={3}>
                <div className="katha-img-wrap katha-img-wrap-publication" data-aos="fade-up">
                  <div className="publication-video-card" />
                </div>
              </Grid>
            ))}
          </Grid>
        ) : (
          albumnData &&
          albumnData.map((album, index) => (
            <Grid key={index} item xs={6} sm={6} md={3}>
              <div className="katha-img-wrap katha-img-wrap-publication" data-aos="fade-up">
                <img src={album.image} alt="" className="video-album-img" />
                <div className="katha-content katha-content-publication">
                  <div>
                    <h4>{album.name ? album.name : album.title}</h4>
                  </div>
                  <div>
                    <p>{album.short_description}</p>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        handleClick(album.id, album.publication_id)
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
};

export default VideoAlbumList;
