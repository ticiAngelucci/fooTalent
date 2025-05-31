import { Badge } from "@/shared/components/ui/badge";
import { Check, CircleAlert, Clock } from "lucide-react";
import { PaymentStatus } from "../../enums/PaymentsEnums";

interface StateBadgeProps {
  state: string;
}

export const StateBadge = ({ state }: StateBadgeProps) => {
  switch (state) {
    case PaymentStatus.PENDING:
      return (
        <Badge className="text-sm bg-alert-50 text-alert-700 hover:bg-alert-100 border-alert-700 rounded-full">
          <CircleAlert className="h-3 w-3 mr-1" />
          Pendiente
        </Badge>
      );
    case PaymentStatus.EXPIRED:
      return (
        <Badge className="text-sm bg-error-50 text-error-700 hover:bg-error-100 border-error-700 rounded-full">
          <Clock className="h-3 w-3 mr-1" />
          Vencido
        </Badge>
      );
    case PaymentStatus.PAID:
      return (
        <Badge className="text-sm bg-success-50 text-success-700 hover:bg-success-100 border-success-700 rounded-full">
          <Check className="h-3 w-3 mr-1" />
          Al día
        </Badge>
      );
    default:
      return <Badge>{state}</Badge>;
  }
};
