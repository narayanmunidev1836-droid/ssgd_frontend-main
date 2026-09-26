import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AOS from "aos";
import "aos/dist/aos.css";

const BookList = ({ publicatioAlbumnData,publiCationLoading }) => {
  const navigate = useNavigate();
    const params = useParams();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const is_open_pdf = params.get("is_open_pdf");
        if (is_open_pdf && publicatioAlbumnData) {
            const book = publicatioAlbumnData.find(
        (item) => item.id.toString() === is_open_pdf
      );
            if (book) {
        handleView(
          JSON.parse(book.media)[0],
          book.name,
          book.short_description,
          book.publications_id
        );
      }
    }
  });

  // const bookPath =
  const handleView = (
    pdfName,
    bookName,
    short_description,
    publications_id
  ) => {
    const parts = pdfName.split("/");
    const fileNameWithExtension = parts[parts.length - 2];
    const fileName = fileNameWithExtension.split(".")[0];
        localStorage.setItem(fileName, pdfName);

    // navigate(`/pdf/${params.id}/${fileName}`);

        navigate(`/pdf/${params.id}/${fileName}/publication/${params.id}`, {
      state: {
        name: bookName,
        publications_id: publications_id,
      },
    });
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <>
      <Container>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          className="katha-content-wrap"
        >
          {publiCationLoading ? (
                    <Grid container spacing={3}>
                    {[...Array(8)].map((_, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <div className="katha-img-wrap">
                        <div className="publication-image-card" />
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                  ):(
          publicatioAlbumnData &&
            publicatioAlbumnData.map((book, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <div className="katha-img-wrap" data-aos="fade-up">
                  {/* <img src={book.image} alt="" className="katha-img" /> */}
                  <LazyLoadImage
                    src={book.image}
                    alt=""
                    className="katha-img"
                    wrapperClassName="lazy-load-image-background aboutustype"
                    afterLoad={() => {
                      const image = document.querySelector(
                        `.lazy-load-image-background[data-src="${book.image}"]`
                      );
                      if (image) {
                        image.classList.add("lazy-load-image-loaded");
                      }
                    }}
                  />
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
                            book.short_description,
                            book.publications_id
                          )
                        }
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </>
  );
};

export default BookList;
