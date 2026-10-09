import { detailMeta, slugToTitle } from "../../../../../../common/seo";

export async function generateMetadata({ params }) {
  const { publicationid, id } = await params;
  return detailMeta({
    title: "Swaminarayan Video Albums",
    description: "Watch Swaminarayan video albums of katha, utsav and kirtan published by Shree Swaminarayan Sanskardham Gurukul (SSGD) in our online publication library.",
    path: `/publication/${publicationid}/video-list/${id}`,
  });
}

export default function Layout({ children }) {
  return children;
}
