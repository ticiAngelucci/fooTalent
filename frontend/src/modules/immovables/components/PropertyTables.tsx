import { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { TablePagination } from "./TablePagination";
import { defaultPageSize, Property } from "../types/property";
import { Input } from "@/shared/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { usePropertyStore } from "../store/propertyStore";

interface PropertyTableProps {
  data: Property[];
  isLoading: boolean;
  error: string | null;
  columns: ColumnDef<Property>[];
  totalElements: number;
  handleDelete: (id: string) => void;
}

export function PropertyTable({
  data,
  isLoading,
  error,
  columns,
  totalElements,
}: PropertyTableProps) {
  const { fetchProperties } = usePropertyStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const [columnSizing, setColumnSizing] = useState({});
  const normalizeString = (str: string | number | null | undefined): string => {
    if (typeof str !== "string") {
      return String(str)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalElements / pagination.pageSize),
    columnResizeMode: "onChange",
    globalFilterFn: (row, _columnId, filterValue) => {
      const normalizedFilterValue = normalizeString(filterValue);
      return Object.values(row.original).some((value) => {
        const normalizedCellValue = normalizeString(value);
        return normalizedCellValue.includes(normalizedFilterValue);
      });
    },
  });

  useEffect(() => {
    const initialSizing: Record<string, number> = {};
    columns.forEach((column) => {
      if ("id" in column && column.id && "size" in column) {
        initialSizing[column.id] = column.size as number;
      }
    });

    if (Object.keys(initialSizing).length > 0) {
      setColumnSizing(initialSizing);
    }
  }, [columns]);

  useEffect(() => {
    fetchProperties(
      table.getState().pagination.pageIndex,
      table.getState().pagination.pageSize
    );
  }, [table, fetchProperties]);

  const { pageIndex, pageSize } = table.getState().pagination;

  useEffect(() => {
    fetchProperties(pageIndex, pageSize);
  }, [pageIndex, pageSize, fetchProperties]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setGlobalFilter(value);
  };



  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-600">
          Ocurrió un Error al cargar Propiedades, intente nuevamente
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2 justify-start items-center w-full mb-4">
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <Search />
          </span>
          <Input
            placeholder="Buscar"
            className="w-full text-lg py-3 pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border mt-4 overflow-x-auto bg-white shadow">
        <div className="w-full relative">
          <Table className="w-full table-fixed">
            <TableHeader className="bg-neutral-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="relative"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resizer ${
                            header.column.getIsResizing() ? "isResizing" : ""
                          }`}
                          style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            height: "100%",
                            width: "5px",
                            background: header.column.getIsResizing()
                              ? "blue"
                              : "transparent",
                            cursor: "col-resize",
                            userSelect: "none",
                            touchAction: "none",
                          }}
                        />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-800" />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={
                      row.index % 2 === 0 ? "bg-white" : "bg-neutral-100"
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="pt-2 pr-4 pb-2 pl-4"
                        style={{ width: `${cell.column.getSize()}px` }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center py-20"
                  >
                    <span className="text-lg text-black font-bold">
                      No se encontraron resultados
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex justify-end">
        <TablePagination table={table} />
      </div>
    </>
  );
}
