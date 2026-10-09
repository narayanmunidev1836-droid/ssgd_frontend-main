import { detailMeta, slugToTitle } from "../../../../../../common/seo";

export async function generateMetadata({ params }) {
  const { album_id, pub_id } = await params;
  return detailMeta({
    title: "Video Album | Katha, Utsav & Kirtan",
    description: "Watch a Swaminarayan video album of katha, utsav and kirtan from Shree Swaminarayan Sanskardham Gurukul (SSGD), organised for easy online viewing.",
    path: `/video-album/${album_id}/publication/${pub_id}`,
  });
}

export default function Layout({ children }) {
  return children;
}
