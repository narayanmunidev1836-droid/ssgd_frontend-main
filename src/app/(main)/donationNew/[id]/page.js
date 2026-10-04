"use client";
import dynamic from "next/dynamic";

// DonationNew reads localStorage inside useState initializers at render time,
// so it cannot be server rendered (MIGRATION_PLAN.md 1.4 / phase 5).
const DonationNew = dynamic(() => import("../../../../views/Donation/DonationNew"), {
  ssr: false,
});

export default function Page() {
  return <DonationNew />;
}
