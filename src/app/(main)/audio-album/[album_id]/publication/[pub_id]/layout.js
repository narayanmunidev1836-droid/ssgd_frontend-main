import { detailMeta, slugToTitle } from "../../../../../../common/seo";

export async function generateMetadata({ params }) {
  const { album_id, pub_id } = await params;
  return detailMeta({
    title: "Audio Album | Kirtans & Katha",
    description: "Listen online to a Swaminarayan audio album of kirtans, bhajans and katha published by Shree Swaminarayan Sanskardham Gurukul (SSGD) for devotees.",
    path: `/audio-album/${album_id}/publication/${pub_id}`,
  });
}

export default function Layout({ children }) {
  return children;
}
