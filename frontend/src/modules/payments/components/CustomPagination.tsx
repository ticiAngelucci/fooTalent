import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PaginationProps } from "../types/pyments"



export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const groupSize = 3
  const [paginationGroupStart, setPaginationGroupStart] = useState(0)

  useEffect(() => {
    const groupIndex = Math.floor(currentPage / groupSize)
    setPaginationGroupStart(groupIndex * groupSize)
  }, [currentPage])

  const pageNumbers = Array.from(
    { length: Math.min(groupSize, totalPages - paginationGroupStart) },
    (_, i) => paginationGroupStart + i
  )

  const handlePreviousGroup = () => {
    const prevStart = paginationGroupStart - groupSize
    if (prevStart >= 0) {
      setPaginationGroupStart(prevStart)
      onPageChange(prevStart)
    }
  }

  const handleNextGroup = () => {
    const nextStart = paginationGroupStart + groupSize
    if (nextStart < totalPages) {
      setPaginationGroupStart(nextStart)
      onPageChange(nextStart)
    }
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-4 text-sm sm:text-base">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex items-center gap-1 text-neutral-950 px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </button>

      {paginationGroupStart > 0 && (
        <button
          onClick={handlePreviousGroup}
          className="px-2 py-1 rounded-md hover:bg-gray-100"
        >
          ...
        </button>
      )}

      {pageNumbers.map((pageIndex) => (
        <button
          key={pageIndex}
          onClick={() => onPageChange(pageIndex)}
          className={`w-8 h-8 rounded-md flex items-center justify-center ${
            currentPage === pageIndex
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          {pageIndex + 1}
        </button>
      ))}

      {paginationGroupStart + groupSize < totalPages && (
        <button
          onClick={handleNextGroup}
          className="px-2 py-1 rounded-md hover:bg-gray-100"
        >
          ...
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="flex items-center gap-1 text-neutral-950 px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
      >
        Siguiente
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}