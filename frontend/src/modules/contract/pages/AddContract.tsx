import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { Route } from "@/shared/constants/route";
import CreateContract from "../components/createContract/CreateContractForm";

const AddContract = () => {
  return (
    <DashboardLayout subtitle="Crear contrato" redirect={Route.Contracts} >
      <CreateContract />
    </DashboardLayout>
  );
};

export default AddContract;
