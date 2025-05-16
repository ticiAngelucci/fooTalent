import DashboardLayout from "@/shared/components/layout/dashboard/DashboardLayout";
import { Route } from "@/shared/constants/route";
import CreateContractForm from "../components/createContract/CreateContractForm";


const AddContract = () => {
  return (
    <DashboardLayout subtitle="Crear contrato" redirect={Route.Contracts} >
      <CreateContractForm />
    </DashboardLayout>
  );
};

export default AddContract;
