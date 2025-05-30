import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import EditTenantForm from "../components/FormEditTenant";
import { API_URL } from "@/shared/constants/api";
import { useUserStore } from "@/store/userStore";
import { Route } from "@/shared/constants/route";
import { Tenant } from "../schemas/tenantSchema";
import { DocumentFromAPI } from "@/shared/interfaces/documentInterface";
import { Loader2 } from "lucide-react";

export default function EditTenantPage() {
  const { id } = useParams();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentFromAPI[]>([]);
  const { token } = useUserStore();

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await axios.get(`${API_URL}/tenants/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const transformedTenant = {
          ...response.data,
          ...response.data.address,
        };
        setDocuments(response.data.documents);
        setTenant(transformedTenant);
      } catch (error) {
        console.error("Error fetching tenant:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchTenant();
    }
  }, [id, token]);

  return (
    <DashboardLayout subtitle="Perfil de inquilino" redirect={Route.Contact}>
      <div className="p-6">
        {loading ? (
          <div className="col-span-3 flex justify-center items-center py-10">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-800" />
          </div>
        ) : tenant ? (
          <EditTenantForm initialData={tenant} documents={documents} />
        ) : (
          <p>No se encontró el inquilino.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
