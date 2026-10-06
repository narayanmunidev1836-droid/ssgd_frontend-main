"use client";
import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CommonBreadcrumbs from "../common/CommonBreadcrumbs/CommonBreadcrumbs";
import { useNavigate } from "../common/routerCompat.js";
import { useParams } from "../common/routerCompat.js";
import PublicationSearchModal from "../common/PublicationSearchModal/PublicationSearchModal";
import InnerpageLoader from "../views/Home/InnerpageLoader";
import {
  fetchPublicationDetails,
  fetchPublicationList,
  fetchSlider,
} from "../api/API";
import FullpageLoader from "../common/HomeSliderLoader/FullpageLoader";
import AOS from "aos";
import "aos/dist/aos.css";

const BookAlbumList = () => {
  const params = useParams();
  
  ///FOR BREADCRUM
  const [publicationDetailResponse, setPublicationDetailResponse] = useState();

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

  const { id } = useParams();
    const navigate = useNavigate();
  const [bookDetailsList, setBookDetailsList] = useState([]);

  const [publicationList, setPublicationList] = useState([]);

  const [publicationId, setPublicationId] = useState();
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadedPages, setLoadedPages] = useState(new Set([1]));
  // const handleViewDetailsClick = (id) => {
  //   navigate(`/publication/${params.id}/book-list/${id}`);
  //   console.log("");
  // };

  const handleView = (pdfName) => {
    const parts = pdfName.split("/");
    const fileNameWithExtension = parts[parts.length - 1];
    const fileName = fileNameWithExtension.split(".")[0];
        localStorage.setItem(fileName, pdfName);

    navigate(`/pdf/${params.id}/${fileName}/publication/${params.id}`);
  };

  const handleButtonClick = (
    publicationName,
    PublicationId,
    index,
    ui_slug,
    publicationData,
    isActive
  ) => {
    fetchData1(PublicationId);

    setPublicationId(PublicationId);

    navigate(`/publication-detail/${PublicationId}/${publicationName}`);
    setPublicationId(PublicationId);
              };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPublicationDetails({
          url: process.env.NEXT_PUBLIC_API_URL,
          page: "publication",
          album_id: id,
        });
        setBookDetailsList(response.data.responseBody.list);
        setPublicationDetailResponse(response.data.responseBody);
              } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    setLoading(true);
    const fetchBanner = async () => {
      try {
        const response = await fetchSlider({
          url: process.env.NEXT_PUBLIC_API_URL,
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



    useEffect(() => {
        AOS.init({
          duration: 1000,
          once: false,
        });
      }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        if (hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);
  
  // Watch for page changes and fetch new data
  useEffect(() => {
    if (params.pub_id && hasMore) {
      fetchData1(params.pub_id, page);
    }
  }, [page, params.pub_id]);
  
  // Reset pagination when publication changes
  useEffect(() => {
    if (params.pub_id) {
      setPage(1);
      setHasMore(true);
      setLoadedPages(new Set([1]));
      fetchData1(params.pub_id, 1);
    }
  }, [params.pub_id]);
  useEffect(() => {
    if (params.pub_id) {
      fetchData1(params.pub_id);
      setPublicationId(params.pub_id);
    }
  }, [params.pub_id]);

  const fetchData1 = async (publicationid, pageNumber) => {
    // Don't fetch if we already have this page
    if (loadedPages.has(pageNumber)) {
      return;
    }

    try {
      const response = await fetchPublicationList({
        url: process.env.NEXT_PUBLIC_API_URL,
        page: "publication",
        order_by: "all",
        publication_id: publicationid,
        pageData: pageNumber,
        per_page: 10
      });
  
      const newData = response?.data?.responseBody.list_publication;
      const totalPages = response?.data?.responseBody.last_page;
  
      setPublicationList(prevList => {
        // Combine existing and new data
        const combinedData = pageNumber === 1 ? 
          [...newData] : 
          [...prevList, ...newData];
        
        // Remove duplicates based on id
        return Array.from(new Map(combinedData.map(item => [item.id, item])).values());
      });
  
      // Update pagination state
      setHasMore(pageNumber < totalPages);
      setLoadedPages(prev => new Set(prev.add(pageNumber)));
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchBanner = async () => {
      try {
        const response = await fetchSlider({
          url: process.env.NEXT_PUBLIC_API_URL,
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
    <div className="temple-page-bg">
      <div className="contact-img-wrap">
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
              {!imageLoaded && <FullpageLoader />}
          </div>
        </div>
      </div>
      <Container>
        {Array.isArray(publicationList) && publicationList.length > 0 ? (
          <div className="publication-serach-wrap">
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
          <div></div>
        )}

        <Grid
          container
          spacing={3}
          justifyContent="center"
          className="katha-content-wrap"
        >
          {Array.isArray(bookDetailsList) &&
            bookDetailsList.map((book, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <div className="katha-img-wrap" data-aos="fade-up">
                  <img src={book.image} alt="" className="katha-img" />
                  <div className="katha-content">
                    <div>
                      <h4>{book.name}</h4>
                    </div>
                    <div>
                      <p>{book.short_description}</p>
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          handleView(
                            JSON.parse(book.media)[0],
                            book.name,
                            book.short_description
                          )
                        }
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          
          {hasMore && (
       
            <Grid item xs={12} className="text-center py-3">
              {}
              <div className="loading-spinner"></div>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default BookAlbumList;
