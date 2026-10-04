"use client";
import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Wallpaper from "../Wallpaper/Wallpaper";
import Tablist from "../Tablist/Tablist";
import "./PublicationDetails.css";
import { useNavigate, useParams } from "../../../common/routerCompat.js";
import { fetchPublicationList, fetchSlider } from "../../../api/API";
import Images from "../../../commonPublication/Images";
import VideoAndAlbumList from "../VideoNew/VideoAndAlbumList";
import AudioAndAlbumList from "../AudioNew/AudioAndAlbumList";
import Loader from "../../../common/Loader/Loader";
import BookAndAlbumList from "../../../commonPublication/BookAndAlbumList";
import InnerpageLoader from "../../Home/InnerpageLoader";
import PublicationSearchModal from "../../../common/PublicationSearchModal/PublicationSearchModal";
import PublicationFilter from "../../../common/PublicationFilter/PublicationFilter";
import FavouriteAlbumList from "../Favourites/FavouriteAlbumList";
import FullpageLoader from "../../../common/HomeSliderLoader/FullpageLoader";
import ActivityLoader from "../../../common/Loader/ActivityLoader";
import { BsHeartFill } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Grid } from "@mui/material";

const PublicationDetails = () => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    <label color="text.primary" className="active-link-color">
      Publication
    </label>,
  ];

  const [SelectedPublicationslug, setSelectedPublicationslugn] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const [year, setYear] = React.useState("");
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const [apiData, setApiData] = useState([]);
  const [publicationList, setPublicationList] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [publicationData, setPublicationData] = useState(null);
  const [publicatioAlbumnData, setPublicationAlbumData] = useState("");
  const [isAlbum, setIsAlbum] = useState(true);
  const [list, setList] = useState([]);
  const [publicationId, setPublicationId] = useState();
  const [banner, setBanner] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [orderBy, setrderBy] = useState("all");
  const [showFavourites, setShowFavourites] = useState(false);
  const [publiCationLoading, setPublicationLoading] = useState(true);

  // NEW STATES
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const params = useParams();
  useEffect(() => {
        fetchData(params.id);
    setPublicationId(params.id);
  }, [params.id]);

  // useEffect(() => {}, [orderBy]);

  useEffect(() => {
    if (publicationId) {
      fetchData(publicationId);
    }
  }, [publicationId, orderBy]);

  const navigate = useNavigate();
  // useEffect(() => {}, [params]);



  const handleChangeYear = (event) => {
    setYear(event.target.value);
  };

  const updateDataByApi = (id) => {
    setPublicationId(id);
    fetchData(id);
  };

    // Add these new states after existing state declarations
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Modify the fetchData function
  const fetchData = async (publicationid, currentPage = 1) => {
    if (currentPage === 1) {
      setInitialLoading(true);
    } else {
      setLoadMoreLoading(true);
    }

    try {
      const response = await fetchPublicationList({
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "publication",
        order_by: orderBy,
        publication_id: publicationid,
        pageData: currentPage,
        per_page: 10,
      });
      setPublicationLoading(false);
      
      if (response?.data?.responseBody.list_publication) {
        setPublicationData(response.data.responseBody.publication.ui_slug);
      }
      
      setSelectedPublicationslugn(response.data.responseBody.publication.ui_slug);
  
      if (response.data.responseBody.albums) {
        setIsAlbum(true);
        if (currentPage === 1) {
          setPublicationAlbumData(response.data.responseBody.albums);
        } else {
          setPublicationAlbumData(prev => [...prev, ...response.data.responseBody.albums]);
        }
      }
      
            if (response.data.responseBody.list) {
        setIsAlbum(false);
                if (currentPage === 1) {
          setPublicationAlbumData(response.data.responseBody.list);
        } else {
          setPublicationAlbumData(prev => [...prev, ...response.data.responseBody.list]);
        }
      }
  
      setHasMore(currentPage < response.data.responseBody.last_page);
      setList(response.data.responseBody);
      setPublicationList(response?.data?.responseBody.list_publication);
      setApiData(response);
    } catch (error) {
      setPublicationLoading(false);
      console.error("Error fetching data:", error);
    } finally {
      if (currentPage === 1) {
        setInitialLoading(false);
      } else {
        setLoadMoreLoading(false);
      }
    }
  };
  
  // Add scroll handler effect
  useEffect(() => {
    const handleScroll = () => {
      if (showFavourites) return;
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 650
      ) {
        if (hasMore && !loadMoreLoading && !initialLoading) {
          setPage(prevPage => prevPage + 1);
        }
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadMoreLoading, initialLoading, showFavourites]);

  useEffect(() => {
    if (publicationId) {
      fetchData(publicationId, page);
    }
  }, [page, publicationId, orderBy]);
  
  // Modify handleButtonClick to reset pagination
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
    setSelectedPublicationslugn(ui_slug);
    setActiveTab(index);
    setIndicatorPosition(index);
    setPage(1);
    setHasMore(true);
    fetchData(PublicationId, 1);
    setActiveStatus(isActive);
    setIsAlbum(true);
  
    window.history.pushState(
      null,
      "",
      `/publication-detail/${PublicationId}/${publicationName}`
    );
    setPublicationId(PublicationId);
  };

  const handleOrderBy = (data) => {
    if (data === "favourites") {
      setShowFavourites(true);
      return;
    }
    setShowFavourites(false);
    setrderBy(data);
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetchSlider({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "publication",
          // order_by: orderBy,
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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // const openModal = () => {
  //   setModalOpen(true);
  // };

  // const closeModal = () => {
  //   setModalOpen(false);
  // };

  return (
    <>
      <div className="contact-img-wrap">
        <div className="spinner-container-banner">
          {!imageLoaded && (
            <div className="shimmer-activity-wrapper">
              <div className="shimmer" />
            </div>
          )}
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
      <Container className="publication-wrap">
        {typeof publicationList === "string" ||
        (Array.isArray(!publicationList) && !publicationList) ? (
          <div className="no-data mt-4">No data available</div>
        ) : null}

        <>
          {initialLoading ? (
            <div className="publication-serach-wrap">
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
              <div className="publication-Search-shimmer" />
            </div>
          ) : (
            Array.isArray(publicationList) &&
            publicationList.length > 0 && (
              <div className="publication-serach-wrap">
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

                {!showFavourites && (
                  <PublicationFilter
                    HandleOrderBy={handleOrderBy}
                    value={orderBy}
                  />
                )}
                <PublicationSearchModal onTap={updateDataByApi} />
              </div>
            )
          )}
        </>
      </Container>
      <Container className="pt-2">
        {showFavourites ? (
          <FavouriteAlbumList />
        ) : (
          <>
        {Array.isArray(publicationList) && publicationList.length === 0 && (
          <div className="pt-5">
            <Grid container spacing={3}>
              {[...Array(8)].map((_, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <div className="publication-shimmer-card" />
                </Grid>
              ))}
            </Grid>
          </div>
        )}
        {SelectedPublicationslug === "image" && (
          <Images
            publicatioAlbumnData={publicatioAlbumnData}
            publiCationLoading={initialLoading}
          />
        )}
        {SelectedPublicationslug === "pdf" && (
          <BookAndAlbumList
            publicatioAlbumnData={publicatioAlbumnData}
            isAlbum={isAlbum}
            publiCationLoading={initialLoading}
          />
        )}
        {SelectedPublicationslug === "audio" && (
          <AudioAndAlbumList
            albumnData={publicatioAlbumnData}
            isAlbum={isAlbum}
            publiCationLoading={initialLoading}
          />
        )}
        {SelectedPublicationslug === "video" && (
          <VideoAndAlbumList
            albumData={publicatioAlbumnData}
            isAlbum={isAlbum}
            publiCationLoading={initialLoading}
          />
        )}

        {hasMore && loadMoreLoading && (
          <Grid container spacing={3}>
            {[...Array(8)].map((_, index) => (
              <Grid item xs={6} md={3} key={index} className="pt-5">
                <div className="publication-shimmer-card" />
              </Grid>
            ))}
          </Grid>
        )}
          </>
        )}
      </Container>
      <div className="section-padding"></div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default PublicationDetails;

