import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/shared/components/ui/tabs";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { usePropertyStore } from "../store/propertyStore";
import { getPropertyColumns } from "../components/PropertyColumns";
import { PropertyTable } from "../components/PropertyTables";
import { Route } from "@/shared/constants/route";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { HousePlus } from "lucide-react";
import DeletePropertyModal from "@/modules/properties/components/DeletePropertyModal";

export default function InmueblesView() {
  const { properties, isLoading, error, fetchProperties, totalElements } =
    usePropertyStore();
  const [deleteId, setDeleteId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const columns = getPropertyColumns(handleDelete);

  return (
    <DashboardLayout
      subtitle="Inmuebles"
      redirect={Route.Dashboard}
      dashBtn={
        <Link to={Route.NewProperty}>
          <Button className="btn-primary my-4">
            <HousePlus />
            Añadir inmueble
          </Button>
        </Link>
      }
    >
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
      <DeletePropertyModal open={modalOpen} setOpen={setModalOpen} id={deleteId} />
    </DashboardLayout>
  );
}
