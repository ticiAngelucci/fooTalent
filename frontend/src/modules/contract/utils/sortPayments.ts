
import { Payment } from "../types/paymentsContract";

/**
 * Sort payments data based on a specific key and direction
 */
export const sortPayments = (
  data: Payment[], 
  sortKey: keyof Payment | null, 
  sortDirection: "asc" | "desc" | null
): Payment[] => {
  if (!sortKey || !sortDirection) return data;

  return [...data].sort((a, b) => {
    let aValue = a[sortKey as keyof Payment];
    let bValue = b[sortKey as keyof Payment];

    // Handle date fields specially
    if (sortKey === "paymentDate" || sortKey === "dueDate") {
      aValue = aValue ? new Date(aValue as string).getTime() : 0;
      bValue = bValue ? new Date(bValue as string).getTime() : 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};