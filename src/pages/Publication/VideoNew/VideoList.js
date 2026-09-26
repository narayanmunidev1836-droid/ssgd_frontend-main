import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Dialog from "../../../common/Dialog/Dialog";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import InnerpageLoader from "../../Home/InnerpageLoader";
import {
  fetchPublicationDetails,
  fetchPublicationList,
  fetchSlider,
} from "../../../api/API";
import PublicationSearchModal from "../../../common/PublicationSearchModal/PublicationSearchModal";
import { useLocation } from "react-router-dom";
import FullpageLoader from "../../../common/HomeSliderLoader/FullpageLoader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

const VideoList = ({ videoListData, publiCationLoading }) => {
  const params = useParams();
    const location = useLocation();

  const [isAlbumDetail, setIsAlbumDetail] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [thumbImage, setThumbNail] = useState("");

  ///FOR BREADCRUM
  const [publicationDetailResponse, setPublicationDetailResponse] = useState();

  const navigate = useNavigate();

  const breadcrumbsData = [
    { label: "Home", url: "/" },
    {
      label: `${publicationDetailResponse?.publication?.name}`,
      url: `/publication-detail/${publicationDetailResponse?.publication?.id}/${publicationDetailResponse?.publication?.name}`,
    },
    <label color="text.primary" className="active-link-color">
      {publicationDetailResponse?.albums?.title}
    </label>,
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoDetailsList, setVideoDetailsList] = useState([]);
  const [mediaUrl, setMediaUrl] = useState("");
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [SelectedPublicationslug, setSelectedPublicationslugn] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const [year, setYear] = React.useState("");
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const [publicationList, setPublicationList] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [publicationData, setPublicationData] = useState(null);
  const [publicatioAlbumnData, setPublicationAlbumData] = useState(null);
  const [isAlbum, setIsAlbum] = useState(false);
  const [list, setList] = useState([]);
  const [publicationId, setPublicationId] = useState();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [youTubeData, setYoutubeData] = useState();

  
  const apiKey = "AIzaSyDEPqey9i1sZFnOGiiE1jqa4tLLH-VC4D8";
  const { id } = useParams();

  
  const handleViewDetailsClick = (url) => {
        setMediaUrl(url);
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isAlbumDetail === false && params.album_id) {
    setIsAlbumDetail(true);
  }

  useEffect(() => {
        if (videoListData) {
      setVideoDetailsList(videoListData);
    }
  }, [videoListData]);

  useEffect(() => {
        if (isAlbumDetail) {
      fetchData();
    }
  }, [isAlbumDetail]);

  const fetchData = async () => {
    try {
      const response = await fetchPublicationDetails({
        url: process.env.REACT_APP_API_URL,
        page: "publication",
        album_id: params.album_id,
      });
      setVideoDetailsList(response.data.responseBody.list);
      setPublicationDetailResponse(response.data.responseBody);
            if (
        response.data.responseBody.list &&
        response.data.responseBody.list.length > 0
      ) {
        setMediaUrl(JSON.parse(response.data.responseBody.list[0].media)[0]);
      }
          } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
        if (mediaUrl !== "") {
            const params = new URLSearchParams(window.location.search);
      const isOpen = params.get("is_open");
            if (isOpen) {
                setIsModalOpen(true);
        handleUrlChange();
      }
    }
  }, [mediaUrl]);

  const handleUrlChange = () => {
    // Parse the current search parameters from the location
    const searchParams = new URLSearchParams(location.search);

    // Remove the 'is_open' parameter
    searchParams.delete("is_open");

    // Construct the new search string
    const newSearch = searchParams.toString();

    // Construct the new pathname with the updated search parameters
    const newPathname = location.pathname;

    // Combine the new pathname and search string to create the new URL
    const newUrl = `${newPathname}${newSearch ? "?" + newSearch : ""}`;

    // Navigate to the new URL
    //  history.push();

    window.history.pushState(null, "", newUrl);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const is_open = params.get("is_open");
        if (is_open && videoListData) {
                  const video = videoListData.find(
        (item) => item.id.toString() === is_open
      );
            if (video) {
        setMediaUrl(JSON.parse(video.media)[0]);
      }
    }
  });

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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    if (params.pub_id) {
      fetchData1(params.pub_id);
      setPublicationId(params.pub_id);
    }
  }, [params.pub_id]);

  const fetchData1 = async (publicationid) => {
    try {
      const response = await fetchPublicationList({
        url: process.env.REACT_APP_API_URL,
        page: "publication",
        order_by: "all",
        publication_id: publicationid,
        // publication_id: params.id,
      });

      if (response?.data?.responseBody.list_publication) {
        setPublicationData(response.data.responseBody.publication.ui_slug);
        // setSelectedPublication(response.data.responseBody.list_publication);
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
  useEffect(() => {
    const fetchVideoDetails = async (videoId) => {
      try {
        if (!videoId) return null;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
        );
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
          return null;
        }

        const { title, thumbnails } = data.items[0].snippet;
        const thumbnailUrl = thumbnails.medium.url;
        return { title, thumbnailUrl };
      } catch (error) {
        console.error("Error fetching video details:", error);
        return null;
      }
    };

    const fetchAllVideoDetails = async () => {
      if (Array.isArray(videoDetailsList)) {
      const videoPromises = videoDetailsList.map(async (item) => {
        const mediaArray = JSON.parse(item.media);
        const firstMedia = mediaArray[0];
        const videoId = firstMedia.match(
          /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        )?.[1];

        const videoData = await fetchVideoDetails(videoId);
        return { videoData, item };
      });

      const resolvedVideos = await Promise.all(videoPromises);
      setYoutubeData(
        resolvedVideos.filter((video) => video.videoData !== null)
      );
          }else{
      setYoutubeData([]);
          }
    };

    fetchAllVideoDetails();
  }, [videoDetailsList, apiKey]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <>
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
        </div>
      )}
      {/* {!imageLoaded && <FullpageLoader />} */}
      <Container>
        {/* if there is an error then we will show no activity message */}
        {/* {typeof videoDetailsList === "string" ||
          (Array.isArray(!videoDetailsList) && !videoDetailsList && (
            <div className="no-data">No data available</div>
          ))} */}

        {Array.isArray(publicationList) && publicationList.length > 0 ? (
          <div className="publication-serach-wrap pt-lg-5 pt-md-0" >
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
        ):(
           <div className="publication-serach-wrap mt-4 pt-3">
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
        {Array.isArray(videoDetailsList) && videoDetailsList.length > 0 ? (
  <Grid
    container
    spacing={3}
    justifyContent="center"
    className="katha-content-wrap"
    data-aos="fade-up"
  >
    {youTubeData?.map((item, index) => (
      <Grid item xs={6} sm={6} md={3} key={index}>
        <div className="katha-img-wrap katha-img-wrap-publication">
          <LazyLoadImage
            src={item?.videoData?.thumbnailUrl}
            alt=""
            className="katha-img video-albums-image"
            wrapperClassName="lazy-load-image-background aboutustype"
            afterLoad={() => {
              const image = document.querySelector(
                `.lazy-load-image-background[data-src="${item?.videoData?.thumbnailUrl}"]`
              );
              if (image) {
                image.classList.add("lazy-load-image-loaded");
              }
            }}
          />
          <div className="katha-content katha-content-publication">
            <div className="video-album-content">
              <h4 className="video-album-content">{item?.videoData?.title}</h4>
            </div>
            <div className="video-album-content">
              <p className="video-album-content">{item?.item?.short_description}</p>
            </div>
            <div>
              <button
                onClick={() =>
                  handleViewDetailsClick(JSON.parse(item?.item?.media)[0])
                }
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </Grid>
    ))}
  </Grid>
) : videoDetailsList === null || typeof videoDetailsList === "string" ? (
  <div className="no-data" style={{paddingTop:"80px"}}>No data available</div>
) : (
  <Grid container spacing={3}>
    {[...Array(8)].map((_, index) => (
      <Grid key={index} item xs={6} sm={6} md={3} style={{paddingTop:"80px"}}>
        <div className="katha-img-wrap katha-img-wrap-publication" data-aos="fade-up">
          <div className="publication-video-card" />
        </div>
      </Grid>
    ))}
  </Grid>
)}
      </Container>

      {isModalOpen && <Dialog onClose={handleCloseModal} mediaUrl={mediaUrl} />}
    </>
  );
};

export default VideoList;
