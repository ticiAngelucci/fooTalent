import { Search } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"

interface PaymentSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}


export const PaymentSearch = ({ searchQuery, setSearchQuery }: PaymentSearchProps) => {
  return (
    <div className="flex gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Buscar"
          className="pl-9 w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button variant="outline">Buscar</Button>
    </div>
  )
}