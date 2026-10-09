import { SITE_URL } from "../common/seo";

// Static routes only; detail pages (activities, albums, publications) are
// API-driven and not listed here.
const routes = [
  ["/", "daily", 1],
  ["/daily-darshan", "daily", 0.9],
  ["/daily-katha", "daily", 0.8],
  ["/activity", "weekly", 0.7],
  ["/activities", "weekly", 0.7],
  ["/publication", "weekly", 0.7],
  ["/audio", "weekly", 0.7],
  ["/video", "weekly", 0.7],
  ["/videos", "weekly", 0.6],
  ["/gallery", "weekly", 0.7],
  ["/wallpaper", "weekly", 0.7],
  ["/donation", "monthly", 0.8],
  ["/about-us", "monthly", 0.8],
  ["/branches", "monthly", 0.6],
  ["/contact-us", "monthly", 0.6],
  ["/terms-conditions", "yearly", 0.2],
];

export default function sitemap() {
  const lastModified = new Date();
  return routes.map(([path, changeFrequency, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
