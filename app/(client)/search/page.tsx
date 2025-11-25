import { Suspense } from "react";
import SearchHomes from "@/app/custom components/SearchHomes";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchHomes />
    </Suspense>
  );
}
