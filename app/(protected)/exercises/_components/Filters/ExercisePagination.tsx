"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Pagination } from "@nextui-org/pagination";

export default function ExercisePagination({
  numberOfResults,
  perPage,
}: {
  numberOfResults: number;
  perPage: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const totalPages = Math.ceil(numberOfResults / perPage);
  const endItem = Math.min(currentPage * perPage, numberOfResults);

  return (
    <div className="flex flex-col items-center relative w-full">
      <Pagination
        showControls
        isCompact
        total={totalPages}
        page={currentPage}
        initialPage={1}
        onChange={createPageURL}
      />
      <div className="absolute bottom-0 right-0 mb-4">
        <span>
          {endItem} out of {numberOfResults}
        </span>
      </div>
    </div>
  );
}
