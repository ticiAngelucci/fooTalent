import { useState, useEffect } from "react";
import { Table } from "@tanstack/react-table";



export function TablePagination<T>({ table }: { table: Table<T> }) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  const groupSize = 3;
  const [paginationGroupStart, setPaginationGroupStart] = useState(0);

  useEffect(() => {
    const groupIndex = Math.floor(currentPage / groupSize);
    setPaginationGroupStart(groupIndex * groupSize);
  }, [currentPage]);

  const pageNumbers = Array.from(
    { length: Math.min(groupSize, pageCount - paginationGroupStart) },
    (_, i) => paginationGroupStart + i
  );

  const handlePreviousGroup = () => {
    const prevStart = paginationGroupStart - groupSize;
    if (prevStart >= 0) {
      setPaginationGroupStart(prevStart);
      table.setPageIndex(prevStart);
    }
  };

  const handleNextGroup = () => {
    const nextStart = paginationGroupStart + groupSize;
    if (nextStart < pageCount) {
      setPaginationGroupStart(nextStart);
      table.setPageIndex(nextStart);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm sm:text-base">
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
      >
        &lt; Anterior
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
          onClick={() => table.setPageIndex(pageIndex)}
          className={`w-8 h-8 rounded-md text-center ${
            currentPage === pageIndex
              ? "bg-blue-600 text-white font-semibold"
              : "hover:bg-gray-200"
          }`}
        >
          {pageIndex + 1}
        </button>
      ))}

      {paginationGroupStart + groupSize < pageCount && (
        <button
          onClick={handleNextGroup}
          className="px-2 py-1 rounded-md hover:bg-gray-100"
        >
          ...
        </button>
      )}

      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
      >
        Siguiente &gt;
      </button>
    </div>
  );
};
