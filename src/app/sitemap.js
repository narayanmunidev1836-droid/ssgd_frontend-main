import { SITE_URL } from "../common/seo";

// Static routes plus activity pages fetched from the API (see below). Other
// detail pages (albums, publications) are not listed yet.
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

const API_BASE = "https://beadm.ssgd.org/api/v1/";

// Activity pages come from the API. A failure must never break the sitemap,
// so fall back to the static routes only.
async function getActivityRoutes() {
  try {
    const res = await fetch(`${API_BASE}home_actiivty`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: process.env.NEXT_PUBLIC_API_URL, page: "home" }),
      next: { revalidate: 86400 },
    });
    const json = await res.json();
    const list = json?.responseBody?.activities || [];
    return list
      .filter((a) => a.activity_id && a.title)
      .map((a) => [`/activities/${a.activity_id}/${encodeURIComponent(a.title)}`, "weekly", 0.6]);
  } catch (e) {
    return [];
  }
}

export default async function sitemap() {
  // Fixed date: `new Date()` would claim every page changed on every request.
  const lastModified = new Date("2026-10-09");
  const all = [...routes, ...(await getActivityRoutes())];
  return all.map(([path, changeFrequency, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
