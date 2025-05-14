import { useUserStore } from "@/store/userStore";
import SummaryCard from "@/shared/components/summaryCard/SummaryCard";
import InfoCard from "@/shared/components/infoCard/InfoCard";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { AlertCircle, CircleCheck, Clock4 } from "lucide-react";

const summary = [

  { label: "Pagos vencidos", value: 4, icon: <AlertCircle className="size-20 text-error-600" />, borderClass: "border-error-600" },
  { label: "Pagos pendientes", value: 6, icon: <Clock4 className="size-20 text-alert-600" />, borderClass: "border-alert-600" },
  { label: "Pagos al día", value: 12, icon: <CircleCheck className="size-20 text-success-600" />, borderClass: "border-success-600" },
];

const properties = [
  {
    type: "Casa",
    location: "San Andrés #4613",
    status: "Disponible",
    image: "https://example.com/casa.jpg",
    name: "Casa Moderna"
  },
  {
    type: "Depto",
    location: "San Andrés #4613",
    status: "Disponible",
    image: "https://example.com/depto.jpg",
    name: "Depto Familiar"
  },
];

const contracts = [
  {
    name: "Maria García",
    location: "San Andrés #4613",
    image: "https://example.com/avatar1.jpg",
    type: "Contrato",
    status: "Vigente"
  },
  {
    name: "Juan Perez",
    location: "San Andrés #4613",
    image: "https://example.com/avatar2.jpg",
    type: "Contrato",
    status: "Vigente"
  },
];

const contacts = [
  {
    name: "Carlos Pérez",
    location: "San Andrés #4613",
    type: "Inquilino",
    image: "https://example.com/avatar3.jpg",
    status: "Activo"
  },
];

const infoSections = [
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
    items: contacts,
  },
];
const Dashboard = () => {
  const username = useUserStore((state) => state.firstName);
  if (!username) return null;

  return (
    <DashboardLayout subtitle={`Tablero`}>
      <div className="flex flex-col items-start gap-1 p-3 w-full rounded-2xl bg-brand-400 text-white">
        <h3 className="text-[40px]">¡Bienvenido, <span className="font-bold">{username}!</span></h3>
        <p className="text-sm font-medium">Es hora de ponernos al día con tus propiedades. ¡Comencemos!</p>
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