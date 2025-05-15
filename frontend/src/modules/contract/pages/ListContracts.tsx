import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout"
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent } from "@/shared/components/ui/tabs";
import { Route } from "@/shared/constants/route"
import { UserRoundPlus } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useContractStore } from "../store/contractStore";
import { getContractColumns } from "../components/ContractCollumns";
import { ContractTable } from "../components/ContractTable";


const ListContracts = () => {
    const { contracts, isLoading, error, fetchContracts, totalElements } = useContractStore();

    useEffect(() => {
        fetchContracts();
    }, [fetchContracts]);

    const columns = getContractColumns();

    return (
        <DashboardLayout subtitle="Contratos"
            redirect={Route.Dashboard}
            dashBtn={<Link to={Route.NewContract}>
                <Button className="btn-primary my-4">
                    <UserRoundPlus />Crear contrato
                </Button>
            </Link>}>
            <div className="rounded-md border mt-4 overflow-x-auto ">
                <Tabs defaultValue="inmuebles" className="space-y-4 m-5">
                    <TabsContent value="inmuebles">
                        <ContractTable
                            data={contracts}
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

export default ListContracts