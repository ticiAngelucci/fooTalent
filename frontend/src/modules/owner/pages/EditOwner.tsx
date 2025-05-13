import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import FormEditOwner from "../components/FormEditOwner";
import { Owner } from "../types/owner";
import { API_URL } from "@/shared/constants/api";
import { useUserStore } from "@/store/userStore";
import { Route } from "@/shared/constants/route";

export default function EditOwner() {
  const { id } = useParams();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  const { token } = useUserStore();

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await axios.get(`${API_URL}/owner/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const transformedOwner = {
          ...response.data,
          ...response.data.address,
        };
        setOwner(transformedOwner);
      } catch (error) {
        console.error("Error fetching owner:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchOwner();
    }
  }, [id, token]);

  return (
    <DashboardLayout subtitle="Perfil de propietario" redirect={Route.Contact}>
      <div className="p-6">
        {loading ? (
          <p>Cargando propietario...</p>
        ) : owner ? (
          <FormEditOwner initialData={owner} />
        ) : (
          <p>No se encontró el propietario.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
