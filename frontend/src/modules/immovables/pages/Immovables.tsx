import { useEffect } from "react";
import { Tabs, TabsContent } from "@/shared/components/ui/tabs";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { usePropertyStore } from "../store/propertyStore";
import { getPropertyColumns } from "../components/PropertyColumns";
import { PropertyTable } from "../components/PropertyTables";
import { Route } from "@/shared/constants/route";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { HousePlus } from "lucide-react";
import { deleteProperty } from "@/modules/properties/services/PropertyService";
import SuccessToast from "@/shared/components/Toasts/SuccessToast";
import ErrorToast from "@/shared/components/Toasts/ErrorToast";
import { toast } from "sonner";



export default function InmueblesView() {
    const { properties, isLoading, error, fetchProperties, totalElements } = usePropertyStore();

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);


   const handleDelete = async (id: string | number) => {
  try {
    await deleteProperty(String(id));
    fetchProperties();
    toast.custom(
      () => (
        <SuccessToast
          title="Inmueble borrado!"
          description="El inmueble fue borrado exitosamente"
        />
      ),
      {
        duration: 5000,
      }
    );
  } catch {
    toast.custom(
      () => (
        <ErrorToast
          title="Error"
          description="Ocurrió un error al borrar el inmueble, intenta de nuevo"
        />
      ),
      {
        duration: 5000,
      }
    );
  }
};

    const columns = getPropertyColumns(handleDelete);

    return (
        <DashboardLayout subtitle="Inmuebles"
            redirect={Route.Dashboard}
            dashBtn={<Link to={Route.NewProperty}>
                <Button className="btn-primary my-4">
                    <HousePlus />Añadir inmueble
                </Button>
            </Link>}>
            <div className="rounded-md border mt-4 overflow-x-auto ">
                <Tabs defaultValue="inmuebles" className="space-y-4 m-5">
                    <TabsContent value="inmuebles">
                        <PropertyTable
                            data={properties}
                            isLoading={isLoading}
                            error={error}
                            columns={columns}
                            totalElements={totalElements}
                            handleDelete={handleDelete}

                        />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}