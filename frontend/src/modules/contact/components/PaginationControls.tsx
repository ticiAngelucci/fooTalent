import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | string)[] {
  const range: (number | string)[] = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) range.push(i);
  } else {
    if (current <= 3) {
      range.push(1, 2, 3, 4, "...", total);
    } else if (current >= total - 2) {
      range.push(1, "...", total - 3, total - 2, total - 1, total);
    } else {
      range.push(1, "...", current - 1, current, current + 1, "...", total);
    }
  }
  return range;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex justify-end items-center gap-2 mt-4">
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        className="text-neutral-950 text-base font-semibold"
      >
        <ChevronLeft className="!w-6 !h-6 mr-1" />
        Anterior
      </Button>

      {getPageNumbers(currentPage, totalPages).map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2 text-neutral-400 select-none">
            ...
          </span>
        ) : (
          <Button
            key={idx}
            variant={currentPage === page ? "default" : "ghost"}
            size="sm"
            className={
              currentPage === page
                ? "bg-blue-700 text-white text-base font-semibold"
                : "text-base font-semibold text-neutral-950"
            }
            onClick={() => typeof page === "number" && onPageChange(page)}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() =>
          onPageChange(currentPage < totalPages ? currentPage + 1 : currentPage)
        }
        className="text-neutral-950 text-base font-semibold"
      >
        Siguiente
        <ChevronRight className="!w-6 !h-6 ml-1" />
      </Button>
    </div>
  );
}
