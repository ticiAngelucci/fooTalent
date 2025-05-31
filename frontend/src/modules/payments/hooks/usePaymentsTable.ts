import { useState, useEffect } from "react";
import { fetchPayments } from "../servises/paymentService";
import { Payment } from "../types/pyments";

function normalizeString(str: string | number | null | undefined): string {
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
}

export function usePaymentsTable(pageSize = 10) {
  const [sortColumn, setSortColumn] = useState<keyof Payment | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await fetchPayments(currentPage, pageSize);
      setPayments(response.dto);
      setTotalPages(
        response.totalPages ||
          Math.ceil((response.totalElements || response.dto.length) / pageSize)
      );
      setTotalElements(response.totalElements || response.dto.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [currentPage, pageSize]);

  const sortData = (column: keyof Payment) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredData = payments.filter((payment) => {
    if (!searchQuery) return true;
    const searchTerm = normalizeString(searchQuery);
    return (
      normalizeString(payment.tenantName).includes(searchTerm) ||
      normalizeString(payment.propertyAddress).includes(searchTerm) ||
      normalizeString(payment.adjustmentFrequency).includes(searchTerm) ||
      normalizeString(payment.amount).includes(searchTerm) ||
      normalizeString(payment.deadline).includes(searchTerm) ||
      normalizeString(payment.status).includes(searchTerm)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  return {
    sortColumn,
    sortDirection,
    sortData,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    loading,
    sortedData,
    filteredData,
    loadPayments
  };
}
