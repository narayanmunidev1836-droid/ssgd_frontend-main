import Navbar from "../views/Navbar/Navbar";
import Footer from "../views/Foooter/Footer";
import NotFound from "../views/NotFound/NotFound";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

// Root not-found sits outside the (main) group, so it needs its own Navbar/Footer.
export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <NotFound />
      <Footer />
    </>
  );
}
