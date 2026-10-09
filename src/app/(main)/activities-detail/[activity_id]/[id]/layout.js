import { detailMeta, slugToTitle } from "../../../../../common/seo";

export async function generateMetadata({ params }) {
  const { activity_id, id } = await params;
  return detailMeta({
    title: "Activity Details & Photo Gallery",
    description: "Explore photos, description and related events of an activity organised by Shree Swaminarayan Sanskardham Gurukul (SSGD) for the community.",
    path: `/activities-detail/${activity_id}/${id}`,
  });
}

export default function Layout({ children }) {
  return children;
}
