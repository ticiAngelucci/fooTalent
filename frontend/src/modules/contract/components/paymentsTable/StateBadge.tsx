import { Badge } from "@/shared/components/ui/badge";
import { Check, Clock } from "lucide-react";
import { PaymentStatus } from "../../enums/PaymentsEnums";

interface StateBadgeProps {
  state: string;
}

export const StateBadge = ({ state }: StateBadgeProps) => {
  switch (state) {
    case PaymentStatus.PAID:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-900">
          <Clock className="h-3 w-3 mr-1" />
          Pendiente
        </Badge>
      );
    case PaymentStatus.EXPIRED:
      return (
        <Badge className="bg-red-100 text-red-400 hover:bg-red-100 border-red-800">
          <Clock className="h-3 w-3 mr-1" />
          Vencido
        </Badge>
      );
    case PaymentStatus.PENDING:
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-400">
          <Check className="h-3 w-3 mr-1" />
          Al día
        </Badge>
      );
    default:
      return <Badge>{state}</Badge>;
  }
};
