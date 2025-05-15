import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import EditTenantForm from "../components/FormEditTenant"; 
import { Tenant } from "../types/tenant";
import { API_URL } from "@/shared/constants/api";
import { useUserStore } from "@/store/userStore";
import { Route } from "@/shared/constants/route";

export default function EditTenantPage() { 
  const { id } = useParams();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

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
          <p>Cargando inquilino...</p>
        ) : tenant ? (
          <EditTenantForm initialData={tenant} /> 
        ) : (
          <p>No se encontró el inquilino.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
