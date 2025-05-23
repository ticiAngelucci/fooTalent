import { Badge } from "@/shared/components/ui/badge"

interface PaymentStatusBadgeProps {
  status: string
}

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  switch (status) {
    case "PAGADO":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-900">Pagado</Badge>
    case "VENCIDO":
      return <Badge className="bg-red-100 text-red-400 hover:bg-red-100 border-red-900">Vencido</Badge>
    case "PENDIENTE":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-900">Pendiente</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}