"use client";
import React, { useEffect, useState } from "react";
import CommonBreadcrumbs from "../../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Container from "@mui/material/Container";
import { useNavigate, useParams } from "../../../common/routerCompat.js";
import { useLocation } from "../../../common/routerCompat.js";
import InnerpageLoader from "../../Home/InnerpageLoader";
import { fetchPublicationList, fetchSlider } from "../../../api/API";
import PublicationSearchModal from "../../../common/PublicationSearchModal/PublicationSearchModal";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import "./Pdf.css";

const Pdf = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [publicationData, setPublicationData] = useState(null);
  const [publicatioAlbumnData, setPublicationAlbumData] = useState(null);
  const [isAlbum, setIsAlbum] = useState(false);
  const [list, setList] = useState([]);
  const [publicationId, setPublicationId] = useState();
  const [SelectedPublicationslug, setSelectedPublicationslugn] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const [year, setYear] = React.useState("");
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const [publicationList, setPublicationList] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [pdfloading, setPdfLoading] = useState(false);

    const params = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const { name, publications_id } = location.state || {};

      useEffect(() => {
    
    var pdf = localStorage.getItem(params.pdfName);
    setPdfUrl(pdf);

      }, []);

  const breadcrumbsData = [
    { label: "Home", url: "/" },
    // { label: "Books", url: `/publication-detail/${params.id}/book` },
    { label: "Books", url: `/publication-detail/${publications_id}/book` },
    <label color="text.primary" className="active-link-color">
      PDF
    </label>,
  ];

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
    if (params.pub_id) {
      fetchData1(params.pub_id);
      setPublicationId(params.pub_id);
    }
  }, [params.pub_id]);

  const fetchData1 = async (publicationid) => {
    try {
      const response = await fetchPublicationList({
        url: process.env.NEXT_PUBLIC_API_URL,
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
      // if (response.data.responseBody.list) {
      //   // setIsAlbum(false);
      //   // setPublicationAlbumData(response.data.responseBody.list);
      //   console.log("lislislistttt", response.data.responseBody.list);
      // }
      setList(response.data.responseBody);
      // console.log(
      //   "response.data.responseBody{{{{",
      //   response.data.responseBody.list_publication
      // );
      // console.log(
      //   "response.data.responseBody....",
      //   response.data.responseBody.albums
      // );
      // console.log(
      //   "responsee........_______.......",
      //   response.data.responseBody.list_publication[0].name
      // );
      setPublicationList(response?.data?.responseBody.list_publication);
                  // setApiData(response);
      // console.log(
      //   "response........",
      //   response.data.responseBody.publication.ui_slug
      // );
      // console.log("reponseresponse", response.data.responseBody.publication);
      // console.log(
      //   "responsePublication",
      //   response?.data?.responseBody.list_publication
      // );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      <Container>
        {Array.isArray(publicationList) && publicationList.length > 0 ? (
          <div className="publication-serach-wrap pt-lg-5 pt-md-0">
            <div>
              <div className="publication-tabs">
                <div className="publication-tab-wrap">
                  {publicationList.map((publication, index) => (
                    <div key={index}>
                      <button
                        className={
                          publications_id?.toString() ===
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
      </Container>

      <Container className="pdf-viewer-wrap">
        {imageLoaded ? (
          <div className="pdf-book-header">
            <div className="pdf-book-header-icon">
              <MenuBookIcon />
            </div>
            <div className="pdf-book-info">
              <h4 className="pdf-book-title">{name || "Book"}</h4>
              <p className="pdf-book-category">
                Publication
              </p>
            </div>
          </div>
        ) : (
          <div className="pdf-header-shimmer">
            <div className="pdf-shimmer-icon"></div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <div className="pdf-shimmer-line" style={{ width: "50%" }}></div>
              <div className="pdf-shimmer-line" style={{ width: "30%", height: "14px" }}></div>
            </div>
          </div>
        )}

        {pdfloading && (
          <div className="pdf-shimmer-iframe"></div>
        )}
        <div className="pdf-iframe-card" style={{ display: pdfloading ? "none" : "block" }}>
          <iframe
            title="pdf-viewer"
            src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
            onLoad={() => setPdfLoading(false)}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
            allow="fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      </Container>
    </>
  );
};

export default Pdf;
