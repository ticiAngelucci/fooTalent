"use client"

import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout"


type AjusteType = "Trimestral" | "Cuatrimestral" | "Semestral"
type IndiceType = "ICL" | "% fijo"
type EstadoType = "Pagado" | "Vencido" | "Pendiente"

interface Payment {
  id: number
  contrato: string
  direccion: string
  ajuste: AjusteType
  indice: IndiceType
  valorAlquiler: number
  fechaLimite: string
  estado: EstadoType
}


const paymentsData: Payment[] = [
  {
    "id": 1,
    "contrato": "Pablo Escobar",
    "direccion": "Avenida Rivadavia, 3210, Rosario",
    "ajuste": "Trimestral",
    "indice": "ICL",
    "valorAlquiler": 400000,
    "fechaLimite": "30 / Julio",
    "estado": "Pagado"
  },
  {
    "id": 2,
    "contrato": "Esther Ramirez",
    "direccion": "Avenida Libertador, 4567, Córdoba",
    "ajuste": "Cuatrimestral",
    "indice": "% fijo",
    "valorAlquiler": 410000,
    "fechaLimite": "10 / Septiembre",
    "estado": "Vencido"
  },
  {
    "id": 3,
    "contrato": "Jenna Ortega",
    "direccion": "Calle San Martín, 789, Mendoza",
    "ajuste": "Trimestral",
    "indice": "ICL",
    "valorAlquiler": 350000,
    "fechaLimite": "15 / Noviembre",
    "estado": "Pendiente"
  },
  {
    "id": 4,
    "contrato": "Anita Morales",
    "direccion": "Avenida de Mayo, 404, Neuquén",
    "ajuste": "Trimestral",
    "indice": "ICL",
    "valorAlquiler": 250000,
    "fechaLimite": "10 / Agosto",
    "estado": "Pagado"
  },
  {
    "id": 5,
    "contrato": "Arlene López",
    "direccion": "Calle Belgrano, 505, San Luis",
    "ajuste": "Trimestral",
    "indice": "ICL",
    "valorAlquiler": 420000,
    "fechaLimite": "10 / Diciembre",
    "estado": "Pagado"
  },
  {
    "id": 6,
    "contrato": "Teresa Pérez",
    "direccion": "Calle San Juan, 606, Bahía Blanca",
    "ajuste": "Semestral",
    "indice": "% fijo",
    "valorAlquiler": 475000,
    "fechaLimite": "10 / Junio",
    "estado": "Vencido"
  },
  {
    "id": 7,
    "contrato": "Floyd Martinez",
    "direccion": "Calle Entre Ríos, 707, Santa Rosa",
    "ajuste": "Trimestral",
    "indice": "% fijo",
    "valorAlquiler": 460000,
    "fechaLimite": "10 / Octubre",
    "estado": "Vencido"
  },
  {
    "id": 8,
    "contrato": "Alberto Torres",
    "direccion": "Avenida Santa Fe, 808, Comodoro Rivadavia",
    "ajuste": "Cuatrimestral",
    "indice": "ICL",
    "valorAlquiler": 455000,
    "fechaLimite": "10 / Septiembre",
    "estado": "Pendiente"
  },
  {
    "id": 9,
    "contrato": "Pablo González",
    "direccion": "Calle San Nicolás, 909, Formosa",
    "ajuste": "Semestral",
    "indice": "% fijo",
    "valorAlquiler": 480000,
    "fechaLimite": "30 / Octubre",
    "estado": "Pendiente"
  },
  {
    "id": 10,
    "contrato": "Ricardo Díaz",
    "direccion": "Avenida San Martín, 1001, Resistencia",
    "ajuste": "Semestral",
    "indice": "ICL",
    "valorAlquiler": 490000,
    "fechaLimite": "10 / Agosto",
    "estado": "Pendiente"
  },
  {
    "id": 11,
    "contrato": "Julia Herrera",
    "direccion": "Calle Libertad, 1102, Posadas",
    "ajuste": "Trimestral",
    "indice": "% fijo",
    "valorAlquiler": 430000,
    "fechaLimite": "15 / Diciembre",
    "estado": "Pendiente"
  },
  {
    "id": 12,
    "contrato": "Ana María Castro",
    "direccion": "Calle 9 de Julio, 101, La Plata",
    "ajuste": "Trimestral",
    "indice": "ICL",
    "valorAlquiler": 470000,
    "fechaLimite": "15 / Julio",
    "estado": "Pendiente"
  },
  {
    "id": 13,
    "contrato": "Pablo Fernández",
    "direccion": "Calle Falsa, 123, Buenos Aires",
    "ajuste": "Cuatrimestral",
    "indice": "% fijo",
    "valorAlquiler": 440000,
    "fechaLimite": "30 / Noviembre",
    "estado": "Pendiente"
  },
  {
    "id": 14,
    "contrato": "Carmen Ruiz",
    "direccion": "Calle Tucumán, 303, San Juan",
    "ajuste": "Cuatrimestral",
    "indice": "ICL",
    "valorAlquiler": 425000,
    "fechaLimite": "15 / Octubre",
    "estado": "Pagado"
  },
  {
    "id": 15,
    "contrato": "Marcos Salazar",
    "direccion": "Calle Corrientes, 202, Salta",
    "ajuste": "Cuatrimestral",
    "indice": "% fijo",
    "valorAlquiler": 450000,
    "fechaLimite": "10 / Noviembre",
    "estado": "Vencido"
  }
]

export default function PaymentsView() {
  const [sortColumn, setSortColumn] = useState<keyof Payment | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
 

  
  const sortData = (column: keyof Payment) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  
  const filteredData = paymentsData.filter((payment) => {
    if (!searchQuery) return true

    const searchTerm = searchQuery.toLowerCase()
    return (
      payment.contrato.toLowerCase().includes(searchTerm) ||
      payment.direccion.toLowerCase().includes(searchTerm) ||
      payment.ajuste.toLowerCase().includes(searchTerm) ||
      payment.indice.toLowerCase().includes(searchTerm) ||
      payment.valorAlquiler.toString().includes(searchTerm) ||
      payment.fechaLimite.toLowerCase().includes(searchTerm) ||
      payment.estado.toLowerCase().includes(searchTerm)
    )
  })

  
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  
  const renderEstadoBadge = (estado: EstadoType) => {
    switch (estado) {
      case "Pagado":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pagado</Badge>
      case "Vencido":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Vencido</Badge>
      case "Pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  

  

  // Acciones de fila
  const handleAccess = (id: number) => {
    alert(`Accediendo al pago ${id}`)
  }

  const handleRegisterPayment = (id: number) => {
    alert(`Registrando pago para ${id}`)
  }

  const handleDelete = (id: number) => {
    alert(`Eliminando pago ${id}`)
  }

  return (
    <DashboardLayout title="Pagos">
    <div className="rounded-md border mt-4 overflow-x-auto">
      

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por estado"
                className="pl-9 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">Buscar</Button>
          </div>
          
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => sortData("contrato")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Contrato
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => sortData("direccion")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Dirección
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => sortData("ajuste")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Ajuste
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => sortData("indice")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Índice
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => sortData("valorAlquiler")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Valor de alquiler
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => sortData("fechaLimite")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Fecha límite
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => sortData("estado")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Estado
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    
                  </TableCell>
                  <TableCell className="font-medium">{payment.contrato}</TableCell>
                  <TableCell>{payment.direccion}</TableCell>
                  <TableCell>{payment.ajuste}</TableCell>
                  <TableCell>{payment.indice}</TableCell>
                  <TableCell>$ {payment.valorAlquiler.toLocaleString()}</TableCell>
                  <TableCell>{payment.fechaLimite}</TableCell>
                  <TableCell>{renderEstadoBadge(payment.estado)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAccess(payment.id)}>Acceder</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRegisterPayment(payment.id)}>
                          Registrar pago
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(payment.id)}>Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between p-4 border-t">
            <div>
              {filteredData.length} filas en total.
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    
                  >
                    {pageNumber}
                  </Button>
                )
              })}
              {totalPages > 3 && <span>...</span>}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}
