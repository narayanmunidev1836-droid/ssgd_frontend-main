import { detailMeta, slugToTitle } from "../../../../../common/seo";

export async function generateMetadata({ params }) {
  const { activity_id, name } = await params;
  return detailMeta({
    title: `${slugToTitle(name, "Activity")} | Activity Albums`,
    description: `View photos and events of ${slugToTitle(name, "this activity")} organised by Shree Swaminarayan Sanskardham Gurukul (SSGD) for devotees and the community.`,
    path: `/activities/${activity_id}/${name}`,
  });
}

export default function Layout({ children }) {
  return children;
}
