import { useEffect } from "react";
import { Tabs, TabsContent } from "@/shared/components/ui/tabs";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { usePropertyStore } from "../store/propertyStore";
import { getPropertyColumns } from "../components/PropertyColumns";
import { PropertyTable } from "../components/PropertyTables";
import { Route } from "@/shared/constants/route";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { UserRoundPlus } from "lucide-react";



export default function InmueblesView() {
    const { properties, isLoading, error, fetchProperties, totalElements } = usePropertyStore();

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const columns = getPropertyColumns();

    return (
        <DashboardLayout title="Inmuebles"
            redirect={Route.Dashboard}
            dashBtn={<Link to={Route.NewProperty}>
                <Button className="btn-primary my-4">
                    <UserRoundPlus />Crear inmueble
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
                            
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}