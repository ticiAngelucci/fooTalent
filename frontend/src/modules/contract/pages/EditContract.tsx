import DashboardLayout from '@/shared/components/layout/dashboard/DashboardLayout'
import { Route } from '@/shared/constants/route'
import EditContractPage from '../components/editContract/EditContractForm'
import { useLocation } from 'react-router-dom';
import DeleteContractModal from '../components/deleteContract/DeleteContractModal';
import { useDeleteContractModal } from '../hooks/useDeleteContractModal';

const EditContract = () => {
  const { deleteOpen, setDeleteOpen, deleteId, handleDelete } = useDeleteContractModal();
  const location = useLocation();
  const contract = location.state?.contract;
  return (
    <DashboardLayout subtitle='Contrato' redirect={Route.Contracts}>
      <EditContractPage contract={contract} handleDelete={handleDelete} />
      <DeleteContractModal open={deleteOpen} setOpen={setDeleteOpen} id={deleteId ?? 0} />
    </DashboardLayout>
  )
}

export default EditContract