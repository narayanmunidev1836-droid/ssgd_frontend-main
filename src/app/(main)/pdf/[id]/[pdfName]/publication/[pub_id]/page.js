"use client";
import dynamic from "next/dynamic";

// Pdf renders location.state into its breadcrumbs; navigation state only exists
// on the client, so SSR would hydrate mismatch (MIGRATION_PLAN.md phase 5).
const Pdf = dynamic(() => import("../../../../../../../views/Publication/Pdf/Pdf"), {
  ssr: false,
});

export default function Page() {
  return <Pdf />;
}
