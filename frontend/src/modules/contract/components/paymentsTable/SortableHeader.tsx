import { ChevronDown, ChevronUp } from "lucide-react";
import { TableHead } from "@/shared/components/ui/table";
import { cn } from "@/lib/utils";
import { Payment } from "../../types/paymentsContract";

interface SortableHeaderProps {
  label: string;
  sortKey: keyof Payment;
  currentSortKey: keyof Payment | null;
  sortDirection: "asc" | "desc" | null;
  onSort: (key: keyof Payment) => void;
}

export const SortableHeader = ({ 
  label, 
  sortKey, 
  currentSortKey, 
  sortDirection, 
  onSort 
}: SortableHeaderProps) => {
  const isActive = currentSortKey === sortKey;

  return (
    <TableHead className="cursor-pointer hover:bg-muted/30" onClick={() => onSort(sortKey)}>
      <div className="flex items-center justify-between">
        {label}
        <div className="flex flex-col">
          <ChevronUp
            className={cn(
              "h-3 w-3 text-muted-foreground/50", 
              isActive && sortDirection === "asc" && "text-foreground"
            )}
          />
          <ChevronDown
            className={cn(
              "h-3 w-3 text-muted-foreground/50",
              isActive && sortDirection === "desc" && "text-foreground"
            )}
          />
        </div>
      </div>
    </TableHead>
  );
};