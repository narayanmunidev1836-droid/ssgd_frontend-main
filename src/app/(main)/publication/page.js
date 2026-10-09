import Publication from "../../../views/Publication/Publication";

export const metadata = { alternates: { canonical: "/publication" } };

export default function Page() {
  return (
    <>
      <h1 className="visually-hidden">Publications of Sanskardham Gurukul</h1>
      <Publication />
    </>
  );
}
