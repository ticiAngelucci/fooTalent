import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import { TablePagination } from "./TablePagination";
import { Contract, defaultPageSize } from "../types/contract";
import { useContractStore } from "../store/contractStore";
import {
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

interface ContractTableProps {
  data: Contract[];
  isLoading: boolean;
  error: string | null;
  columns: ColumnDef<Contract>[];
  totalElements: number;
}

export function ContractTable({
  data,
  isLoading,
  error,
  columns,
  totalElements,
}: ContractTableProps) {
  const { fetchContracts } = useContractStore();
  const [searchQuery, setSearchQuery] = useState("");

  

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      globalFilter: searchQuery,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalElements / pagination.pageSize),
    globalFilterFn: (row, _columnId, filterValue) => {
      return Object.values(row.original).some((value) =>
        String(value).toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  useEffect(() => {
    fetchContracts(pageIndex, pageSize);
  }, [pageIndex, pageSize, fetchContracts]);

  

  if (isLoading) {
    return <div className="text-center py-6">Cargando contratos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-6">{error}</div>;
  }

  return (
    <>
      <div className="flex gap-2 justify-start items-center w-full mb-4">
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <Search />
          </span>
          <Input
            placeholder="Buscar contrato..."
            className="w-full text-lg py-3 pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border mt-4 overflow-x-auto bg-white shadow">
        <Table className="w-full table-fixed">
          <TableHeader className="bg-[#E5E7EB]">
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
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <TablePagination table={table} />
      </div>
    </>
  );
}
