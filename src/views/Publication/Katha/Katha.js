"use client";
import React from "react";
import Grid from "@mui/material/Grid";
import Container from '@mui/material/Container';
import _image1 from "../../../assets/images/01. Shastriji Maharaj.webp";
const image1 = _image1.src;
import _image2 from "../../../assets/images/02. Purani Premprakash Swami.webp";
const image2 = _image2.src;
import "./Katha.css";

const Katha = () => {
    return (
        <>
            {/* <Container> */}
            <Grid container spacing={3} justifyContent="center" className="katha-content-wrap">
                <Grid item xs={6} sm={6} md={3}>
                    <div className="katha-img-wrap">
                        <img src={image1} alt="" className="katha-img" />
                        <div className="katha-content">
                            <div>
                                <h4>Katha</h4>
                            </div>
                            <div>
                                <p>
                                    01 Gurudev Shastriji...
                                </p>
                            </div>
                            <div>
                                <button>View Details</button>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <div className="katha-img-wrap">
                        <img src={image2} alt="" className="katha-img" />
                        <div className="katha-content">
                            <div>
                                <h4>Katha</h4>
                            </div>
                            <div>
                                <p>
                                    01 Gurudev Shastriji...
                                </p>
                            </div>
                            <div>
                                <button>View Details</button>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <div className="katha-img-wrap">
                        <img src={image1} alt="" className="katha-img" />
                        <div className="katha-content">
                            <div>
                                <h4>Katha</h4>
                            </div>
                            <div>
                                <p>
                                    01 Gurudev Shastriji...
                                </p>
                            </div>
                            <div>
                                <button>View Details</button>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <div className="katha-img-wrap">
                        <img src={image2} alt="" className="katha-img" />
                        <div className="katha-content">
                            <div>
                                <h4>Katha</h4>
                            </div>
                            <div>
                                <p>
                                    01 Gurudev Shastriji...
                                </p>
                            </div>
                            <div>
                                <button>View Details</button>
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
            {/* </Container> */}
        </>
    )
}

export default Katha;