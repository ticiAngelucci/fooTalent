import { useState, useEffect } from "react";
import { Payment } from "../types/paymentsContract";
import { fetchContractPayments } from "../services/PaymentsTableService";
import { ServiceType } from "../enums/PaymentsEnums";
import { sortPayments } from "../utils/sortPayments";

export const usePayments = (contractId: number) => {
  const [activeTab, setActiveTab] = useState("alquiler");
  const [sortKey, setSortKey] = useState<keyof Payment | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const data = await fetchContractPayments(contractId);
        setPayments(data.dto);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos de pagos');
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [contractId]);

  const handleSort = (key: keyof Payment) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Filter payments by type
  const rentPayments = payments.filter(p => p.serviceType === ServiceType.RENT);
  const otherPayments = payments.filter(p => p.serviceType !== ServiceType.RENT);

  // Sort filtered payments
  const sortedRentPayments = sortPayments(rentPayments, sortKey, sortDirection);
  const sortedOtherPayments = sortPayments(otherPayments, sortKey, sortDirection);

  return {
    activeTab,
    setActiveTab,
    sortKey,
    sortDirection,
    handleSort,
    rentPayments: sortedRentPayments,
    otherPayments: sortedOtherPayments,
    loading,
    error
  };
};
