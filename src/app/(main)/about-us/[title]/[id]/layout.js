import { detailMeta, slugToTitle } from "../../../../../common/seo";

export async function generateMetadata({ params }) {
  const { title, id } = await params;
  return detailMeta({
    title: `${slugToTitle(title, "About Us")} | About Us`,
    description: `Learn about ${slugToTitle(title, "our institution")} at Shree Swaminarayan Sanskardham Gurukul (SSGD): history, activities, saints and seva for the community.`,
    path: `/about-us/${title}/${id}`,
  });
}

export default function Layout({ children }) {
  return children;
}
