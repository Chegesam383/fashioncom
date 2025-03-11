"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useEffect, useState } from "react";

export function ShopPagination({ totalPages }: { totalPages: number }) {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false, scroll: true })
  );
  const [category] = useQueryState(
    "category",
    parseAsString.withOptions({ shallow: false })
  );
  const [subcategories] = useQueryState("subcategories", parseAsString);

  const [localCategory, setLocalCategory] = useState(category);
  const [localSubcategories, setLocalSubcategories] = useState(subcategories);

  useEffect(() => {
    if (category !== localCategory || subcategories !== localSubcategories) {
      setPage(1);
      setLocalCategory(category);
      setLocalSubcategories(subcategories);
    }
  }, [
    category,
    subcategories,
    page,
    setPage,
    localCategory,
    localSubcategories,
  ]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderPaginationLink = (pageNumber: number) => (
    <PaginationItem key={pageNumber}>
      <PaginationLink
        onClick={() => handlePageChange(pageNumber)}
        isActive={pageNumber === page}
        className="cursor-pointer"
      >
        {pageNumber}
      </PaginationLink>
    </PaginationItem>
  );

  const renderEllipsis = (key: string) => (
    <PaginationItem key={key}>
      <PaginationEllipsis />
    </PaginationItem>
  );

  const getPaginationItems = () => {
    const items = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(renderPaginationLink(i));
      }
    } else {
      if (page > 3) {
        items.push(renderPaginationLink(1));
        items.push(renderEllipsis("ellipsis-start"));
      }

      const start = Math.max(1, page - 1);
      const end = Math.min(totalPages, page + 1);
      for (let i = start; i <= end; i++) {
        items.push(renderPaginationLink(i));
      }

      if (page < totalPages - 2) {
        items.push(renderEllipsis("ellipsis-end"));
        items.push(renderPaginationLink(totalPages));
      }
    }

    return items;
  };

  return (
    <Pagination className="my-4">
      <PaginationContent>
        <PaginationItem>
          {page > 1 && (
            <PaginationPrevious
              onClick={() => handlePageChange(page - 1)}
              className="cursor-pointer"
            />
          )}
        </PaginationItem>
        {getPaginationItems()}
        <PaginationItem>
          {page < totalPages && (
            <PaginationNext
              onClick={() => handlePageChange(page + 1)}
              className="cursor-pointer"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
