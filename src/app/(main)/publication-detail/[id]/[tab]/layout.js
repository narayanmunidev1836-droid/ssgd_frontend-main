import { detailMeta, slugToTitle } from "../../../../../common/seo";

export async function generateMetadata({ params }) {
  const { id, tab } = await params;
  return detailMeta({
    title: `${slugToTitle(tab, "Publication")} | Publication Details`,
    description: `Browse ${slugToTitle(tab, "books, audio and video")} published by Shree Swaminarayan Sanskardham Gurukul (SSGD): Swaminarayan books, kirtans, katha and videos.`,
    path: `/publication-detail/${id}/${tab}`,
  });
}

export default function Layout({ children }) {
  return children;
}
