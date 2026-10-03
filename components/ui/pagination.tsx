import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1.5 flex-wrap justify-center", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"button">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        "cursor-pointer transition-all",
        isActive &&
          "border-[#50644C] bg-[#50644C] text-white font-semibold shadow-xs hover:bg-[#243021] hover:text-white dark:border-[#94A478] dark:bg-[#50644C]",
        !isActive &&
          "text-[#5A6659] hover:bg-[#EDF2EB] hover:text-[#50644C]",
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      disabled={disabled}
      className={cn(
        "gap-1 px-2.5 sm:px-3 border border-[#DFD5C6] bg-white text-xs font-semibold text-[#17231C] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#50644C]/40 hover:bg-[#FAF9F5]",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="hidden sm:inline">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      disabled={disabled}
      className={cn(
        "gap-1 px-2.5 sm:px-3 border border-[#DFD5C6] bg-white text-xs font-semibold text-[#17231C] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#50644C]/40 hover:bg-[#FAF9F5]",
        className
      )}
      {...props}
    >
      <span className="hidden sm:inline">Next</span>
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
  )
}

function PaginationFirst({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to first page"
      size="icon"
      disabled={disabled}
      className={cn(
        "border border-[#DFD5C6] bg-white text-[#17231C] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#50644C]/40 hover:bg-[#FAF9F5]",
        className
      )}
      {...props}
    >
      <ChevronsLeftIcon className="h-4 w-4" />
    </PaginationLink>
  )
}

function PaginationLast({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to last page"
      size="icon"
      disabled={disabled}
      className={cn(
        "border border-[#DFD5C6] bg-white text-[#17231C] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#50644C]/40 hover:bg-[#FAF9F5]",
        className
      )}
      {...props}
    >
      <ChevronsRightIcon className="h-4 w-4" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-8 items-center justify-center text-[#5A6659]", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

/**
 * Calculates page numbers with smart ellipsis windowing (1-based page indices).
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): (number | "ellipsis")[] {
  // If total pages is small enough, show all
  const totalNumbers = siblingCount * 2 + 5 // e.g. 1 + siblings + current + siblings + totalPages
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, "ellipsis", totalPages]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    )
    return [1, "ellipsis", ...rightRange]
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    )
    return [1, "ellipsis", ...middleRange, "ellipsis", totalPages]
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1)
}

export interface DataTablePaginationProps {
  page: number; // 0-indexed
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPageSize?: boolean;
  showItemCount?: boolean;
  itemLabel?: string;
  className?: string;
}

/**
 * Full responsive pagination control component for tables, grids, and catalogs.
 */
export function DataTablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
  showPageSize = false,
  showItemCount = true,
  itemLabel = "items",
  className,
}: DataTablePaginationProps) {
  if (totalPages <= 1 && (!totalItems || totalItems === 0)) {
    return null
  }

  const currentPageOneBased = page + 1
  const paginationRange = getPaginationRange(currentPageOneBased, totalPages)

  const startItem = totalItems !== undefined && totalItems > 0
    ? (pageSize ? page * pageSize + 1 : page + 1)
    : 0
  const endItem = totalItems !== undefined && totalItems > 0
    ? (pageSize ? Math.min((page + 1) * pageSize, totalItems) : totalItems)
    : 0

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2",
        className
      )}
    >
      {/* Items count summary & page size selector */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A6659]">
        {showItemCount && totalItems !== undefined && totalItems > 0 && (
          <span>
            Showing <strong className="font-semibold text-[#17231C]">{startItem}</strong>
            –
            <strong className="font-semibold text-[#17231C]">{endItem}</strong> of{" "}
            <strong className="font-semibold text-[#17231C]">{totalItems}</strong> {itemLabel}
          </span>
        )}

        {showPageSize && onPageSizeChange && pageSize && (
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                onPageSizeChange(Number(val))
                onPageChange(0)
              }}
            >
              <SelectTrigger size="sm" className="h-7 w-16 text-xs bg-white border-[#DFD5C6] rounded-none">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)} className="text-xs cursor-pointer">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Pagination navigation controls */}
      {totalPages > 1 && (
        <Pagination className="mx-0 w-auto justify-center sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst
                disabled={page <= 0}
                onClick={() => onPageChange(0)}
                title="First Page"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                disabled={page <= 0}
                onClick={() => onPageChange(Math.max(0, page - 1))}
              />
            </PaginationItem>

            {paginationRange.map((pageNumber, idx) => {
              if (pageNumber === "ellipsis") {
                return (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              const isCurrent = pageNumber === currentPageOneBased
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={isCurrent}
                    size="sm"
                    className="size-8 rounded-none text-xs"
                    onClick={() => onPageChange((pageNumber as number) - 1)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                disabled={page >= totalPages - 1}
                onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast
                disabled={page >= totalPages - 1}
                onClick={() => onPageChange(totalPages - 1)}
                title="Last Page"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
}
