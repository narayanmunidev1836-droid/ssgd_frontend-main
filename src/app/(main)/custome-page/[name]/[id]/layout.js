import { detailMeta, slugToTitle } from "../../../../../common/seo";

export async function generateMetadata({ params }) {
  const { name, id } = await params;
  return detailMeta({
    title: `${slugToTitle(name, "Information")} | SSGD Page`,
    description: `Read about ${slugToTitle(name, "this topic")} from Shree Swaminarayan Sanskardham Gurukul (SSGD): details, announcements and information for devotees and visitors.`,
    path: `/custome-page/${name}/${id}`,
  });
}

export default function Layout({ children }) {
  return children;
}
