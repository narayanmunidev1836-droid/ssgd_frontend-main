import SubActivities from "../../../views/Activities/SubActivities/SubActivities";

export const metadata = { alternates: { canonical: "/activities" } };

export default function Page() {
  return (
    <>
      <h1 className="visually-hidden">Activities and Events of Sanskardham Gurukul</h1>
      <SubActivities />
    </>
  );
}
