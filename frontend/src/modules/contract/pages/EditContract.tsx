import DashboardLayout from '@/shared/components/layout/dashboard/DashboardLayout'
import { Route } from '@/shared/constants/route'
import EditContractPage from '../components/editContract/EditContractForm'
import { useLocation } from 'react-router-dom';
import DeleteContractModal from '../components/deleteContract/DeleteContractModal';
import { useDeleteContractModal } from '../hooks/useDeleteContractModal';

import { Button } from '@/shared/components/ui/button';
import NewPaymentForm from '@/modules/payments/components/NewPaymentForm';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

import { DollarSign } from 'lucide-react';
import PaymentsTable from '../components/paymentsTable/PaymentsTable';

const EditContract = () => {
  const { deleteOpen, setDeleteOpen, deleteId, handleDelete } = useDeleteContractModal();
  const location = useLocation();
  const contract = location.state?.contract;
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  return (
    <DashboardLayout subtitle='Contrato' redirect={Route.Contracts}>
      <EditContractPage contract={contract} handleDelete={handleDelete} />
      <samp className="text-neutral-950">Pagos</samp>
      
      <DeleteContractModal open={deleteOpen} setOpen={setDeleteOpen} id={deleteId ?? 0} />
      <PaymentsTable contractId={contract?.id} />
      
      <Button
        variant="outline"
        className="w-full mb-5 bg-gray-100"
        onClick={() => setOpenPaymentModal(true)}
      >
        <DollarSign />Agregar Pago
      </Button>      
      <Dialog open={openPaymentModal} onOpenChange={setOpenPaymentModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle> Agregar nuevo pago</DialogTitle>
          </DialogHeader>
          {contract?.id && <NewPaymentForm id={String(contract.id)} 
          onSuccess={() => setOpenPaymentModal(false)}
          />}
        </DialogContent>
      </Dialog>
      
        
    </DashboardLayout>
  )
}

export default EditContract