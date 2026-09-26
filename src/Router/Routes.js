import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "../pages/Navbar/Navbar";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Videos from "../pages/Videos/Videos";
import Publication from "../pages/Publication/Publication";
import AboutUs from "../pages/AboutUs/AboutUs";
import SubActivities from "../pages/Activities/SubActivities/SubActivities";
import Branches from "../pages/Branches/Branches";
import Contact from "../pages/Contact/Contact";
import ScrollBottomToTopArrow from "../pages/ScrollBottomToTopArrow/ScrollBottomToTopArrow";
import Footer from "../pages/Foooter/Footer";
import ScrollToTop from "../pages/ScrollToTop/ScrollToTop";
import Activities from "../pages/Activities/Activities";
import ActivitiesDetails from "../pages/Activities/ActivitiesDetails/ActivitiesDetails";
import PublicationDetails from "../pages/Publication/PublicationDetails/PublicationDetails";
import About from "../pages/AboutUs/About";
import Audio from "../pages/Publication/Audio/Audio";
import Video from "../pages/Publication/Video/Video";
import Wallpaper from "../pages/Publication/Wallpaper/Wallpaper";
import Gallery from "../pages/LightGallery/Gallery";
import DailyDarshan from "../pages/DailyDarshan/DailyDarshan";
import DailyKatha from "../pages/DailyKatha/DailyKatha";
import Donation from "../pages/Donation/Donation";
import TermsConditions from "../pages/TermsConditions/TermsConditions";
import VideoList from "../pages/Publication/VideoNew/VideoList";
import BookAlbumList from "../commonPublication/BookAlbumList";
import PrarthnaMandir from "../pages/AboutUs/PrarthnaMandir/PrarthnaMandir";
import Pdf from "../pages/Publication/Pdf/Pdf";
import AudioListPlayer from "../pages/Publication/AudioNew/AudioListPlayer";
import ThankYou from "../ThankYou/ThankYou";
import ShortDescList from "../pages/AboutUs/ShortDescList/ShortDescList";
import CustomPage from "../pages/CustomePage/CustomePage";
import DonationNew from "../pages/Donation/DonationNew";
import Donors from "../pages/Donation/Donors";
import ViewBill from "../pages/ViewBill";
const MainLayout = () => {
  const location = useLocation(); // Get the current route

// Check if the current path is '/view_bill'
const isViewBillPage = location.pathname === '/view_bill';

return (
  <>
    {/* Conditionally render the Navbar only if it's not the /view_bill route */}
    {!isViewBillPage && <Navbar />}
    {!isViewBillPage && <ScrollToTop />}
    {!isViewBillPage && <ScrollBottomToTopArrow />}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/publication" element={<Publication />} />
      <Route path="/publication-detail/:id/:tab" element={<PublicationDetails />} />
      <Route path="/audio" element={<Audio />} />
      <Route path="/audio-album/:album_id/publication/:pub_id/" element={<AudioListPlayer />} />
      <Route path="/video-album/:album_id/publication/:pub_id" element={<VideoList />} />
      <Route path="/video" element={<Video />} />
      <Route path="/wallpaper" element={<Wallpaper />} />
      <Route path="/activity" element={<Activities />} />
      <Route path="/activities/:activity_id/:name" element={<SubActivities />} />
      <Route path="/activities/" element={<SubActivities />} />
      <Route path="/activities-detail/:activity_id/:id" element={<ActivitiesDetails />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/about-us/about/:title/:id" element={<About />} />
      <Route path="/branches" element={<Branches />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/daily-darshan" element={<DailyDarshan />} />
      <Route path="/daily-katha" element={<DailyKatha />} />
      <Route path="/donationNew/:id" element={<DonationNew />} />
      <Route path="/donation" element={<Donors />} />
      <Route path="/custome-page/:name/:id" element={<CustomPage />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="publication/:publicationid/video-list/:id" element={<VideoList />} />
      <Route path="publication/:publicationid/book-list/:id/publication/:pub_id/" element={<BookAlbumList />} />
      <Route path="/about-us/:title/:id" element={<PrarthnaMandir />} />
      <Route path="/about-us/about/:name/:id" element={<ShortDescList />} />
      <Route path="/pdf/:id/:pdfName/publication/:pub_id/" element={<Pdf />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/thank_you" element={<ThankYou />} />
      <Route path="/view_bill" element={<ViewBill />} />
    </Routes>
    {!isViewBillPage &&  <Footer />}
  </>
);
};





const Routers = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};



// function Routers() {

//   const location = useLocation(); // Get the current route

//   // Check if the current path is '/view_bill'
//   const isViewBillPage = location.pathname === '/view_bill';



//   return (
//     <>
//       <Router>
//         {!isViewBillPage && <Navbar />}
//         {!isViewBillPage && <ScrollToTop />}
//         {!isViewBillPage && <ScrollBottomToTopArrow />}
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/videos" element={<Videos />} />
//           <Route path="/publication" element={<Publication />} />
//           <Route
//             path="/publication-detail/:id/:tab"
//             element={<PublicationDetails />}
//           />
//           <Route path="/audio" element={<Audio />} />

//           <Route
//             path="/audio-album/:album_id/publication/:pub_id/"
//             element={<AudioListPlayer />}
//           />
//           <Route
//             path="/video-album/:album_id/publication/:pub_id"
//             element={<VideoList />}
//           />

//           <Route path="/video" element={<Video />} />
//           <Route path="/wallpaper" element={<Wallpaper />} />
//           <Route path="/activity" element={<Activities />} />
//           <Route
//             path="/activities/:activity_id/:name"
//             element={<SubActivities />}
//           />
//           <Route path="/activities/" element={<SubActivities />} />
//           <Route
//             path="/activities-detail/:activity_id/:id"
//             element={<ActivitiesDetails />}
//           />
//           <Route path="/gallery" element={<Gallery />} />
//           <Route path="/about-us" element={<AboutUs />} />
//           <Route path="/about-us/about/:title/:id" element={<About />} />
//           <Route path="/branches" element={<Branches />} />
//           <Route path="/contact-us" element={<Contact />} />
//           <Route path="/daily-darshan" element={<DailyDarshan />} />
//           <Route path="/daily-katha" element={<DailyKatha />} />
//           {/* <Route path="/donation" element={<Donation />} /> */}
//           <Route path="/donationNew/:id" element={<DonationNew />} />
//           <Route path="/donation" element={<Donors />} />
//           <Route path="/custome-page/:name/:id" element={<CustomPage />} />
//           <Route path="/terms-conditions" element={<TermsConditions />} />
//           <Route
//             path="publication/:publicationid/video-list/:id"
//             element={<VideoList />}
//           />

//           <Route
//             path="publication/:publicationid/book-list/:id/publication/:pub_id/"
//             element={<BookAlbumList />}
//           />
//           <Route path="/about-us/:title/:id" element={<PrarthnaMandir />} />
//           <Route path="/about-us/about/:name/:id" element={<ShortDescList />} />
//           <Route
//             path="/pdf/:id/:pdfName/publication/:pub_id/"
//             element={<Pdf />}
//           />
//           <Route path="*" element={<NotFound />} />
//           <Route path="/thank_you" element={<ThankYou />} />
//           <Route path="/view_bill" element={<ViewBill />} />
//         </Routes>
//         <PageTitleUpdater />
//       </Router>
//       {!isViewBillPage && <Footer />}
//     </>
//   );
// }
function PageTitleUpdater() {
  const location = useLocation();
  const siteName = localStorage.getItem("siteName");

  useEffect(() => {
    const pageTitles = {
      "/": "Home",
      "/activities": "Activities",
      "/videos": "Videos",
      "/publication": "Publication",
      "/publication-detail/:id/:tab": "Publication",
      "/katha": "Katha",
      "/kirtan": "Kirtan",
      "/audio": "Audio",
      "/audio-album/:album_id": "Audio Album",
      "/video-album/:album_id/:tab": "Video Album",
      "/video": "Video",
      "/wallpaper": "Wallpaper",
      "/audio-list": "Audio List",
      "/activity": "Activity",
      "/activities/:activity_id/:name": "Sub Activities",
      "/activities/": "Sub Activities",
      "/activities-detail/:activity_id/:id": "Activities Details",
      "/gallery": "Gallery",
      "/about-us": "About Us",
      "/about-us/about/:id": "About",
      "/about-us/guru-tradition": "Guru Tradition",
      "/branches": "Branches",
      "/contact-us": "Contact Us",
      "/daily-darshan": "Daily Darshan",
      "/daily-katha": "Daily Katha",
      // "/donation": "Donation",
      "/terms-conditions": "Terms & Conditions",
      "/publication/:publicationid/video-list/:id": "Video List",
      "/publication/:publicationid/book-list/:id": "Book Album List",
      "/about-us/prarthna-mandir/:id": "Prarthna Mandir",
      "/about-us/gaushala": "Gaushala",
      "/about-us/brahmanand-vidhyalaya": "Brahmanand Vidhyalaya",
      "/about-us/hostel": "Hostel",
      "/pdf/:id/:pdfName": "PDF",
      "/thank_you": "Thank You",
    };

    const path = location.pathname;
    let pageTitle = pageTitles[path] || "Sanskardham";
    let titleSuffix = siteName ? ` - ${siteName}` : "";

    if (path.startsWith("/publication-detail/")) {
      const tabName = path.split("/").pop();
      const camelCaseTabName =
        tabName.charAt(0).toUpperCase() + tabName.slice(1);
      pageTitle = `${camelCaseTabName}`;
    } else if (path.startsWith("/activities/")) {
      const name = path.split("/").pop().replace(/%20/g, "-");
      pageTitle = `${name}`;
    }

    document.title = `${pageTitle}${titleSuffix}`;
  }, [location.pathname]);

  return null;
}

export default Routers;
