import { useEffect } from "react";
import { Tabs, TabsContent } from "@/shared/components/ui/tabs";
import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { usePropertyStore } from "../store/propertyStore";
import { getPropertyColumns } from "../components/PropertyColumns";
import { PropertyTable } from "../components/PropertyTables";
import { Route } from "@/shared/constants/route";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";


export default function InmueblesView() {
    const { properties, isLoading, error, fetchProperties } = usePropertyStore();

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const columns = getPropertyColumns();

    return (
        <DashboardLayout title="Inmuebles">
            <div className="p-6 space-y-4 w-[95%] mx-auto max-w-[1700px] min-h-screen">
                <Link to={Route.NewProperty}

                >
                    <Button className="btn-primary">
                        Crear inmueble
                    </Button>

                </Link>

                <Tabs defaultValue="inmuebles" className="space-y-4">
                    <TabsContent value="inmuebles">
                        <PropertyTable
                            data={properties}
                            isLoading={isLoading}
                            error={error}
                            columns={columns}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}