import Navbar from "../../views/Navbar/Navbar";
import ScrollToTop from "../../views/ScrollToTop/ScrollToTop";
import ScrollBottomToTopArrow from "../../views/ScrollBottomToTopArrow/ScrollBottomToTopArrow";
import Footer from "../../views/Foooter/Footer";

// Parity with old MainLayout (src/Router/Routes.js): Navbar + scroll helpers +
// Footer wrap every route except /view_bill (which lives in the (bare) group).
export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <ScrollBottomToTopArrow />
      {children}
      <Footer />
    </>
  );
}
