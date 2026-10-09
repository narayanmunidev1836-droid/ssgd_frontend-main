import { SITE_URL } from "../common/seo";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/view_bill", "/thank_you"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
