// Shared SEO helpers. NEXT_PUBLIC_API_URL doubles as the per-deployment site URL
// (see .env), so each site (www / usa / surat ...) gets its own canonical host.
export const SITE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://www.ssgd.org").replace(/\/+$/, "");
export const SITE_NAME = "SSGD";
export const FULL_NAME = "Shree Swaminarayan Sanskardham Gurukul (SSGD)";
export const OG_IMAGE = "/og-image.png";

// Page-level metadata. Pass `path` only for routes without dynamic children
// (a layout's canonical is inherited by nested routes).
export function pageMeta({ title, description, path }) {
  return {
    title,
    description,
    ...(path && { alternates: { canonical: path } }),
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: FULL_NAME,
      type: "website",
      ...(path && { url: path }),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: FULL_NAME }],
    },
  };
}
