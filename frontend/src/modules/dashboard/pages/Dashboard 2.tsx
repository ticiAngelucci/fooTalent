import { useUserStore } from "@/store/userStore";
import LogoutButton from "@/shared/components/logoutButton/LogoutButton";
import SummaryCard from "@/shared/components/summaryCard/SummaryCard";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/sidebar/Sidebar";
import InfoCard from "@/shared/components/infoCard/InfoCard";

const summary = [
  { label: "Pagos vencidos", value: 4, icon: "\u26A0\uFE0F" },
  { label: "Pagos pendientes", value: 6, icon: "\u2139\uFE0F" },
  { label: "Pagos al día", value: 12, icon: "\u2714\uFE0F" },
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
    type: "property",
    title: "Inmuebles",
    subtitle: "Listado de inmuebles",
    items: properties,
  },
  {
    type: "contract",
    title: "Contratos",
    subtitle: "Contratos vigentes",
    items: contracts,
  },
  {
    type: "contact",
    title: "Contactos",
    subtitle: "Listado de contratos",
    items: contacts,
  },
];
const Dashboard = () => {
  const username = useUserStore((state) => state.username);
  if (!username) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col justify-center items-center w-[90%] m-auto">
        <div className="flex flex-row justify-end items-center w-[100%] mx-auto p-4">
          <LogoutButton />
        </div>
        <div className="min-h-screen flex flex-col w-[90%] p-6 space-y-6">
          <h1 className="text-2xl font-thin">¡Bienvenido, {username}!</h1>
          <h1 className="text-2xl font-thin">Gestiona tus alquileres de forma fácil y eficiente</h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 max-w-[1700px] justify-items-center mt-10">
            {summary.map((item, idx) => (
              <SummaryCard key={idx} {...item} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 max-w-[1700px] gap-6 mt-10">
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

      </div>
    </SidebarProvider>
  );
};

export default Dashboard;