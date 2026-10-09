import { detailMeta, slugToTitle } from "../../../../../../../common/seo";

export async function generateMetadata({ params }) {
  const { id, pdfName, pub_id } = await params;
  return detailMeta({
    title: `${slugToTitle(pdfName, "Book")} | Read Online`,
    description: `Read ${slugToTitle(pdfName, "this Swaminarayan book")} online as a PDF, published by Shree Swaminarayan Sanskardham Gurukul (SSGD) for devotees and readers.`,
    path: `/pdf/${id}/${pdfName}/publication/${pub_id}`,
  });
}

export default function Layout({ children }) {
  return children;
}
