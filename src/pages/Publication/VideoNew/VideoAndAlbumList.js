import VideoAlbumList from "./VideoAlbumList";
import VideoList from "./VideoList";

const VideoAndAlbumList = ({ albumData, isAlbum, publiCationLoading }) => {
    if (isAlbum === true) {
    return <VideoAlbumList albumnData={albumData} publiCationLoadin={publiCationLoading}/>;
  } else {
    return <VideoList videoListData={albumData} isAlbum={isAlbum} publiCationLoading={publiCationLoading}/>;
  }
};

export default VideoAndAlbumList;
