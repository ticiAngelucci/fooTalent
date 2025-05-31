import { Badge } from "@/shared/components/ui/badge"

interface PaymentStatusBadgeProps {
  status: string
}

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  switch (status) {
    case "PAGADO":
      return <Badge className="text-sm bg-success-50 text-success-700 hover:bg-success-100 border-success-700 rounded-full">Pagado</Badge>
    case "VENCIDO":
      return <Badge className="text-sm bg-error-50 text-error-700 hover:bg-error-100 border-error-700 rounded-full">Vencido</Badge>
    case "PENDIENTE":
      return <Badge className="text-sm bg-alert-50 text-alert-700 hover:bg-alert-100 border-alert-700 rounded-full">Pendiente</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}