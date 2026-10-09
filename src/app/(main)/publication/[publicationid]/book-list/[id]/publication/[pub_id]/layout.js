import { detailMeta, slugToTitle } from "../../../../../../../../common/seo";

export async function generateMetadata({ params }) {
  const { publicationid, id, pub_id } = await params;
  return detailMeta({
    title: "Swaminarayan Books & Albums",
    description: "Read and download Swaminarayan books and albums published by Shree Swaminarayan Sanskardham Gurukul (SSGD) from our online publication library.",
    path: `/publication/${publicationid}/book-list/${id}/publication/${pub_id}`,
  });
}

export default function Layout({ children }) {
  return children;
}
