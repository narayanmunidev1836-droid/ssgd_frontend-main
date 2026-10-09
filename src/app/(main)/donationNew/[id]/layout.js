import { detailMeta, slugToTitle } from "../../../../common/seo";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return detailMeta({
    title: "Online Donation | Donate Securely",
    description: "Donate securely online to Shree Swaminarayan Sanskardham Gurukul (SSGD) and support education, seva and spiritual programs. Quick, safe and simple.",
    path: `/donationNew/${id}`,
  });
}

export default function Layout({ children }) {
  return children;
}
