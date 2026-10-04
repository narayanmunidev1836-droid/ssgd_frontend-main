"use client";
import dynamic from "next/dynamic";

// ViewBill renders location.search into the iframe src; the query string only
// exists on the client, so SSR would hydrate mismatch (MIGRATION_PLAN.md phase 5).
const ViewBill = dynamic(() => import("../../../views/ViewBill"), { ssr: false });

export default function Page() {
  return <ViewBill />;
}
