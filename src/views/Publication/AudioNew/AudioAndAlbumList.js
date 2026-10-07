"use client";
import React from "react";
import AudioAlbumList from "./AudioAlbumList";
import AudioListPlayer from "./AudioListPlayer";

const AudioAndAlbumList = ({ albumnData, isAlbum , publiCationLoading, publicationName }) => {
    if (isAlbum === true) {
    return <AudioAlbumList albumnData={albumnData} publiCationLoading={publiCationLoading} publicationName={publicationName}/>;
  } else {
    return <AudioListPlayer audioListData={albumnData} publiCationLoading={publiCationLoading} />;
  }
};

export default AudioAndAlbumList;
