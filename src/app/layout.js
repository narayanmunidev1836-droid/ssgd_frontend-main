import "bootstrap/dist/css/bootstrap.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
/* ---- Global CSS: every stylesheet CRA loaded on every route (single main.css),
   imported in CRA/webpack module-graph order so the cascade matches the CRA build.
   Next otherwise loads only the current route's component CSS, which drops rules
   owned by other routes (e.g. /about-us losing About.css). ---- */
import "../index.css";
import "../views/Navbar/Navbar.css";
import "../common/NavbarLoader/NavbarLoader.css";
import "../common/HomeSliderLoader/HomeSliderLoader.css";
import "../common/Loader/Loader.css";
import "../views/Header/Header.css";
import "../common/HomeSliderLoader/FullpageLoader.css";
import "../views/Home/Home.css";
import "../views/Home/QuickNavCards.css";
import "../views/Home/MissionSection.css";
import "../views/Videos/Videos.css";
import "../views/Publication/Publication.css";
import "../views/Activities/Activities.css";
import "../views/Home/StatsSection.css";
import "../views/SantPhotos/SantPhotos.css";
import "../views/Home/CTASection.css";
import "../views/AboutUs/AboutUs.css";
import "../common/CommonBreadcrumbs/CommonBreadcrumbs.css";
import "../common/HomeSliderLoader/SubpageLoader.css";
import "../views/Activities/SubActivities/SubActivities.css";
import "../common/Loader/ActivityLoader.css";
import "../views/Branches/Branches.css";
import "../common/Loader/Lazyloader.css";
import "../views/Contact/Contact.css";
import "../views/Foooter/Footer.css";
import "../views/Activities/ActivitiesDetails/ActivitiesDetails.css";
/* lightgallery CSS: ActivitiesDetails.js mounts <LightGallery> but never imported
   the plugin styles, so Next dropped them on /activities-detail - the portal that
   lightgallery appends to <body> (after <footer>) rendered unstyled and showed the
   gallery photos below the footer. Global import (CRA bundled it on every route). */
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
/* react-image-lightbox: DailyDarshan.js mounts <Lightbox> without importing
   style.css (only Images.js did), so /daily-darshan opened it unstyled. */
import "react-image-lightbox/style.css";
import "../views/Publication/PublicationDetails/PublicationDetails.css";
import "../views/Publication/Wallpaper/Wallpaper.css";
import "../views/Publication/Tablist/Tablist.css";
import "../views/Publication/Katha/Katha.css";
import "../common/Dialog/Dialog.css";
import "../views/Publication/AudioNew/AudioPlayer.css";
import "../common/Loader/AudioPlayerLoader.css";
import "../views/AboutUs/About.css";
import "../views/DailyDarshan/DailyDarshan.css";
import "../views/DailyKatha/DailyKatha.css";
import "../views/Donation/Donation.css";
import "../views/TermsConditions/TermsConditions.css";
import "../views/AboutUs/Founder.css";
import "../views/Publication/Pdf/Pdf.css";
import "../ThankYou/Thankyou.css";
import "../views/CustomePage/CustomPage.css";
import "../views/Donation/Donors.css";
import Providers from "./Providers";
import { SITE_URL, SITE_NAME, FULL_NAME, OG_IMAGE } from "../common/seo";

const DESCRIPTION =
  "Official website of Shree Swaminarayan Sanskardham Gurukul (SSGD): daily darshan, katha, kirtans, publications, wallpapers, activities and online donation.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: FULL_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "SSGD",
    "Sanskardham",
    "Swaminarayan Gurukul Sanskardham",
    "Swaminarayan Gurukul",
    "Swaminarayan Gurukul Dhrangadhra",
    "Sanskardham Dhrangadhra",
    "Swaminarayan Mandir Dhrangadhra",
    "Gurukul Surendranagar",
    "Swaminarayan Gurukul Gujarat",
    "Swaminarayan Gurukul Halwad Road Dhrangadhra",
    "Swaminarayan daily darshan",
    "Swaminarayan katha",
    "Swaminarayan kirtan",
    "Sanskardham daily darshan",
    "Sanskardham katha",
    "Sanskardham kirtan",
    "સંસ્કારધામ",
    "સંસ્કારધામ ગુરુકુલ ધ્રાંગધ્રા",
    "સ્વામિનારાયણ ગુરુકુલ",
    "સ્વામિનારાયણ ગુરુકુલ ધ્રાંગધ્રા",
    "સ્વામિનારાયણ મંદિર ધ્રાંગધ્રા",
    "સુરેન્દ્રનગર ગુરુકુલ",
  ],

  openGraph: {
    title: FULL_NAME,
    description: DESCRIPTION,
    url: "/",
    siteName: FULL_NAME,
    type: "website",
    locale: "en_IN",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: FULL_NAME }],
  },
  twitter: { card: "summary_large_image", title: FULL_NAME, description: DESCRIPTION, images: [OG_IMAGE] },
  icons: {
    icon: "/favicon.webp",
    apple: "/logo192.png",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: FULL_NAME,
  alternateName: ["SSGD", "Sanskardham", "શ્રી સ્વામિનારાયણ સંસ્કારધામ ગુરુકુલ"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo512.png`,
  email: "info@ssgd.org",
  telephone: "+91 98258 03174",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Halwad Road, Post Box No. 22",
    addressLocality: "Dhrangadhra",
    addressRegion: "Gujarat",
    postalCode: "363310",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.facebook.com/sanskardhamgurukul",
    "https://www.youtube.com/@SanskardhamGurukul",
    "https://instagram.com/sanskardhamgurukul",
    "https://x.com/sanskardham",
    "https://t.me/SANSKARDHAM",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* ---- CDN assets ported from CRA public/index.html ----
             Font Awesome + Poppins stay on the CDN (no npm package in use).
             Bootstrap/Slick CSS moved to npm imports at the top of this file:
             Next puts its own stylesheet links in <head> BEFORE body-level CDN
             links, which inverts CRA's cascade order (CDN first, bundle last)
             and measurably changes computed styles. Bundling them ahead of
             index.css restores CRA ordering. ---- */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        <noscript>You need to enable JavaScript to run this app.</noscript>

        {/* CRA parity: App.js ran `console.log = function no_console() {}` on
            render, so the app ships no console.log noise. Same override here,
            before hydration (console.warn/error untouched). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if (true) { console.log = function no_console() {}; }`,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />

        <Providers>{children}</Providers>

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
