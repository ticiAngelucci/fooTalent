import DashboardLayout from '@/shared/components/layout/dashboard/DashboardLayout'
import { Route } from '@/shared/constants/route'
import EditContractPage from '../components/editContract/EditContractForm'

const EditContract = () => {
  return (
    <DashboardLayout subtitle='Contrato' redirect={Route.Contracts}>
      <EditContractPage />
    </DashboardLayout>
  )
}

export default EditContract