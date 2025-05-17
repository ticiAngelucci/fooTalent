import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import FormEditOwner from "../components/FormEditOwner";
import { Route } from "@/shared/constants/route";
import { fetchOwner } from "../services/ownerService";
import { OwnerFromAPI } from "../types/ownerFromApi";

export default function EditOwner() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState<OwnerFromAPI>();

  useEffect(() => {
    const getOwner = async()=>{
      const editOwner = await fetchOwner(id);
      if(editOwner) setOwner(editOwner);
      setLoading(false);
    }
      getOwner();
  }, []);

  return (
    <DashboardLayout subtitle="Perfil de propietario" redirect={Route.Contact}>
      <div className="p-6">
        {loading ? (
          <p>Cargando propietario...</p>
        ) : owner ? (
          <FormEditOwner initialData={owner}/>
        ) : (
          <p>No se encontró el propietario.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
