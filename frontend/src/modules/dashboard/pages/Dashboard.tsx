import { useUserStore } from "@/store/userStore";
import SummaryCard from "@/shared/components/summaryCard/SummaryCard";
import InfoCard from "@/shared/components/infoCard/InfoCard";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { AlertCircle, CircleCheck, Clock4 } from "lucide-react";
import { usePagosStore } from "../store/paymentsStore";
import { useEffect } from "react";
import { useContractStore } from "../store/contractStore";
import { usePropertyStore } from "../store/propertyStore";
import { useTenantStore } from "../store/tenantStore";
import { InfoCardProps } from "@/modules/dashboard/types/infoCard";

// const summary = [

//   { label: "Pagos vencidos", value: 4, icon: <AlertCircle className="size-20 text-error-600" />, borderClass: "border-error-600" },
//   { label: "Pagos pendientes", value: 6, icon: <Clock4 className="size-20 text-alert-600" />, borderClass: "border-alert-600" },
//   { label: "Pagos al día", value: 12, icon: <CircleCheck className="size-20 text-success-600" />, borderClass: "border-success-600" },
// ];

// const properties = [
//   {
//     type: "Casa",
//     location: "San Andrés #4613",
//     status: "Disponible",
//     image: "https://example.com/casa.jpg",
//     name: "Casa Moderna"
//   },
//   {
//     type: "Depto",
//     location: "San Andrés #4613",
//     status: "Disponible",
//     image: "https://example.com/depto.jpg",
//     name: "Depto Familiar"
//   },
// ];

// const contracts = [
//   {
//     name: "Maria García",
//     location: "San Andrés #4613",
//     image: "https://example.com/avatar1.jpg",
//     type: "Contrato",
//     status: "Vigente"
//   },
//   {
//     name: "Juan Perez",
//     location: "San Andrés #4613",
//     image: "https://example.com/avatar2.jpg",
//     type: "Contrato",
//     status: "Vigente"
//   },
// ];

// const contacts = [
//   {
//     name: "Carlos Pérez",
//     location: "San Andrés #4613",
//     type: "Inquilino",
//     image: "https://example.com/avatar3.jpg",
//     status: "Activo"
//   },
// ];

// const infoSections = [
//   {
//     type: "contract",
//     title: "Contratos",
//     subtitle: "Contratos vigentes",
//     items: contracts,
//   },
//   {
//     type: "property",
//     title: "Inmuebles",
//     subtitle: "Listado de inmuebles",
//     items: properties,
//   },
//   {
//     type: "contact",
//     title: "Contactos",
//     subtitle: "Listado de contratos",
//     items: contacts,
//   },
// ];
const Dashboard = () => {
  const username = useUserStore((state) => state.firstName);

  const pagos = usePagosStore((state) => state.pagos);
  const fetchPagos = usePagosStore((state) => state.fetchPagos);

  const contracts = useContractStore((state) => state.contracts);
  const fetchContracts = useContractStore((state) => state.fetchContracts);

  const properties = usePropertyStore((state)=> state.properties);
  const fetchProperties = usePropertyStore((state)=> state.fetchProperties);

  const tenants = useTenantStore((state)=> state.tenants);
  const fetchTenants = useTenantStore((state)=> state.fetchTenants);


  useEffect(() => {
    if (contracts.length === 0) {
      fetchContracts();
    } else {
    }
  }, [contracts.length, fetchContracts]);

    useEffect(() => {
    if (properties.length === 0) {
      fetchProperties();
    } else {
    }
  }, [properties.length, fetchProperties]);

    useEffect(() => {
    if (tenants.length === 0) {
      fetchTenants();
    } else {
    }
  }, [tenants.length, fetchTenants]);

  useEffect(() => {
    if (pagos.length === 0) {
      fetchPagos();
    }
  }, [pagos.length, fetchPagos]);

  // Payments
  const pagosVencidos = pagos.filter(p => p.status === "VENCIDO").length;
  const pagosPendientes = pagos.filter(p => p.status === "PENDIENTE").length;
  const pagosAlDia = pagos.filter(p => p.status === "PAGADO").length;

  const summary = [
    {
      label: "Pagos vencidos",
      value: pagosVencidos,
      icon: <AlertCircle className="size-20 text-error-600" />,
      borderClass: "border-error-600",
    },
    {
      label: "Pagos pendientes",
      value: pagosPendientes,
      icon: <Clock4 className="size-20 text-alert-600" />,
      borderClass: "border-alert-600",
    },
    {
      label: "Pagos al día",
      value: pagosAlDia,
      icon: <CircleCheck className="size-20 text-success-600" />,
      borderClass: "border-success-600",
    },
  ];

  //Cards Sections

 const infoSections: InfoCardProps[] = [
  {
    type: "contract",
    title: "Contratos",
    subtitle: "Contratos vigentes",
    items: contracts,
  },
  {
    type: "property",
    title: "Inmuebles",
    subtitle: "Listado de inmuebles",
    items: properties,
  },
  {
    type: "contact",
    title: "Contactos",
    subtitle: "Listado de contratos",
    items: tenants,
  },
];

  if (!username) return null;

  return (
    <DashboardLayout subtitle={`Tablero`}>
      <div className="flex flex-col items-start gap-1 p-3 w-full rounded-2xl text-neutral-950">
        <h3 className="text-[40px]">¡Bienvenido, <span className="font-bold">{username}!</span></h3>
        <p className="text-sm font-medium text-neutral-600">Es hora de ponernos al día con tus propiedades. ¡Comencemos!</p>
      </div>
      <div className="flex flex-col w-full space-y-6 mb-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 justify-items-center">
          {summary.map((item, idx) => (
            <SummaryCard key={idx} {...item} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {infoSections.map((section, idx) => (
            <InfoCard
              key={idx}
              type={section.type}
              subtitle={section.subtitle}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;