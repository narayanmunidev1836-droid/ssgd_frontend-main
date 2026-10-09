import AboutUs from "../../../views/AboutUs/AboutUs";

export const metadata = { alternates: { canonical: "/about-us" } };

export default function Page() {
  return (
    <>
      <h1 className="visually-hidden">About Shree Swaminarayan Sanskardham Gurukul (SSGD)</h1>
      <AboutUs />
    </>
  );
}
